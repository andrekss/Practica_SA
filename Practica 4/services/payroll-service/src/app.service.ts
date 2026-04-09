import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';
import { pool } from './db';
import { StorageService } from './storage.service';

interface UploadPayrollInput {
  name: string;
  uploadedBy: string;
  csvBase64: string;
}

interface ApproveInput {
  payrollId: string;
  step: number;
  approverUserId: string;
  comment?: string;
}

@Injectable()
export class AppService {
  private readonly notificationUrl =
    process.env.NOTIFICATION_SERVICE_URL ?? 'http://notification-service:3003';
  private readonly financeUrl =
    process.env.FINANCE_SERVICE_URL ?? 'http://finance-mock:3011/finance/process';
  private readonly auditUrl =
    process.env.AUDIT_SERVICE_URL ?? 'http://audit-service:3004/logs';

  constructor(private readonly storageService: StorageService) {}

  async health() {
    await pool.query('SELECT 1');
    return { status: 'ok', service: 'payroll-service' };
  }

  async uploadPayroll(input: UploadPayrollInput) {
    const csvText = Buffer.from(input.csvBase64, 'base64').toString('utf8');
    const rows = parse(csvText, { columns: true, skip_empty_lines: true }) as Record<
      string,
      string
    >[];

    if (!rows.length) {
      throw new BadRequestException('CSV has no rows');
    }

    for (const row of rows) {
      if (!row.employeeEmail || !row.employeeName || !row.amount) {
        throw new BadRequestException(
          'CSV must contain employeeEmail, employeeName, amount',
        );
      }
      const amount = Number(row.amount);
      if (Number.isNaN(amount) || amount <= 0) {
        throw new BadRequestException('Invalid amount in CSV');
      }
    }

    const payrollId = uuidv4();
    const objectKey = `${payrollId}.csv`;

    await this.storageService.uploadCsv(objectKey, csvText);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `
        INSERT INTO payrolls(id, name, status, current_step, uploaded_by, csv_object_key)
        VALUES ($1, $2, 'PENDING_STEP_1', 1, $3, $4)
        `,
        [payrollId, input.name, input.uploadedBy, objectKey],
      );

      for (const row of rows) {
        await client.query(
          `
          INSERT INTO payroll_entries(id, payroll_id, employee_email, employee_name, amount, raw_json)
          VALUES ($1, $2, $3, $4, $5, $6::jsonb)
          `,
          [
            uuidv4(),
            payrollId,
            row.employeeEmail,
            row.employeeName,
            Number(row.amount).toFixed(2),
            JSON.stringify(row),
          ],
        );
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    await this.audit('payroll-service', 'CREATE_PAYROLL', 'payroll', payrollId, {
      rows: rows.length,
      uploadedBy: input.uploadedBy,
    });

    return { payrollId, status: 'PENDING_STEP_1', rows: rows.length };
  }

  async listPayrolls() {
    const result = await pool.query(
      `
      SELECT id, name, status, current_step, uploaded_by, created_at, updated_at
      FROM payrolls
      ORDER BY created_at DESC
      `,
    );
    return { items: result.rows };
  }

  async getPayroll(payrollId: string) {
    const payrollResult = await pool.query(`SELECT * FROM payrolls WHERE id = $1`, [payrollId]);
    if (!payrollResult.rows[0]) {
      throw new NotFoundException('Payroll not found');
    }
    const entriesResult = await pool.query(
      `
      SELECT employee_email, employee_name, amount, raw_json
      FROM payroll_entries
      WHERE payroll_id = $1
      ORDER BY employee_name
      `,
      [payrollId],
    );
    const approvalsResult = await pool.query(
      `
      SELECT step, approver_user_id, status, comment, acted_at
      FROM approvals
      WHERE payroll_id = $1
      ORDER BY step, acted_at
      `,
      [payrollId],
    );
    return {
      payroll: payrollResult.rows[0],
      entries: entriesResult.rows,
      approvals: approvalsResult.rows,
    };
  }

  async approvePayroll(input: ApproveInput) {
    const payrollResult = await pool.query(`SELECT * FROM payrolls WHERE id = $1`, [
      input.payrollId,
    ]);
    const payroll = payrollResult.rows[0];
    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }
    if (input.step !== payroll.current_step) {
      throw new BadRequestException(
        `Payroll currently expects approval step ${payroll.current_step}`,
      );
    }

    const newStep = input.step + 1;
    const isFinal = input.step === 3;
    const nextStatus = isFinal ? 'APPROVED' : `PENDING_STEP_${newStep}`;
    const nextCurrentStep = isFinal ? 3 : newStep;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `
        INSERT INTO approvals(id, payroll_id, step, approver_user_id, status, comment)
        VALUES ($1, $2, $3, $4, 'APPROVED', $5)
        `,
        [uuidv4(), input.payrollId, input.step, input.approverUserId, input.comment ?? null],
      );
      await client.query(
        `
        UPDATE payrolls
        SET status = $2, current_step = $3, updated_at = NOW()
        WHERE id = $1
        `,
        [input.payrollId, nextStatus, nextCurrentStep],
      );
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    await this.audit('payroll-service', 'APPROVAL_STEP', 'payroll', input.payrollId, {
      step: input.step,
      approverUserId: input.approverUserId,
      status: nextStatus,
    });

    if (isFinal) {
      await this.handleFinalApproval(input.payrollId, input.approverUserId);
    }

    return { payrollId: input.payrollId, status: nextStatus, currentStep: nextCurrentStep };
  }

  async getDownloadUrl(payrollId: string) {
    const result = await pool.query(`SELECT csv_object_key FROM payrolls WHERE id = $1`, [
      payrollId,
    ]);
    const payroll = result.rows[0];
    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }
    const url = await this.storageService.getDownloadUrl(payroll.csv_object_key);
    return { payrollId, url };
  }

  private async handleFinalApproval(payrollId: string, approverUserId: string) {
    const emailsResult = await pool.query(
      `SELECT employee_email FROM payroll_entries WHERE payroll_id = $1`,
      [payrollId],
    );
    const emails = emailsResult.rows.map((row) => row.employee_email as string);

    await axios.post(this.financeUrl, { payrollId, approvedBy: approverUserId });
    await axios.post(`${this.notificationUrl}/notifications/payroll-approved`, {
      payrollId,
      emails,
      subject: 'Planilla aprobada - pago en proceso',
      message:
        'Tu planilla ha sido aprobada en el paso final y tu pago esta en proceso de deposito.',
    });

    await this.audit('payroll-service', 'PAYROLL_APPROVED', 'payroll', payrollId, {
      recipients: emails.length,
      approvedBy: approverUserId,
    });
  }

  private async audit(
    service: string,
    action: string,
    entity: string,
    entityId: string,
    payload: Record<string, unknown>,
  ) {
    try {
      await axios.post(this.auditUrl, {
        service,
        action,
        entity,
        entityId,
        actor: service,
        payload,
      });
    } catch (error) {
      // Auditing should not block business flow.
    }
  }
}
