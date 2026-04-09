"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const sync_1 = require("csv-parse/sync");
const uuid_1 = require("uuid");
const db_1 = require("./db");
const storage_service_1 = require("./storage.service");
let AppService = class AppService {
    constructor(storageService) {
        this.storageService = storageService;
        this.notificationUrl = process.env.NOTIFICATION_SERVICE_URL ?? 'http://notification-service:3003';
        this.financeUrl = process.env.FINANCE_SERVICE_URL ?? 'http://finance-mock:3011/finance/process';
        this.auditUrl = process.env.AUDIT_SERVICE_URL ?? 'http://audit-service:3004/logs';
    }
    async health() {
        await db_1.pool.query('SELECT 1');
        return { status: 'ok', service: 'payroll-service' };
    }
    async uploadPayroll(input) {
        const csvText = Buffer.from(input.csvBase64, 'base64').toString('utf8');
        const rows = (0, sync_1.parse)(csvText, { columns: true, skip_empty_lines: true });
        if (!rows.length) {
            throw new common_1.BadRequestException('CSV has no rows');
        }
        for (const row of rows) {
            if (!row.employeeEmail || !row.employeeName || !row.amount) {
                throw new common_1.BadRequestException('CSV must contain employeeEmail, employeeName, amount');
            }
            const amount = Number(row.amount);
            if (Number.isNaN(amount) || amount <= 0) {
                throw new common_1.BadRequestException('Invalid amount in CSV');
            }
        }
        const payrollId = (0, uuid_1.v4)();
        const objectKey = `${payrollId}.csv`;
        await this.storageService.uploadCsv(objectKey, csvText);
        const client = await db_1.pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(`
        INSERT INTO payrolls(id, name, status, current_step, uploaded_by, csv_object_key)
        VALUES ($1, $2, 'PENDING_STEP_1', 1, $3, $4)
        `, [payrollId, input.name, input.uploadedBy, objectKey]);
            for (const row of rows) {
                await client.query(`
          INSERT INTO payroll_entries(id, payroll_id, employee_email, employee_name, amount, raw_json)
          VALUES ($1, $2, $3, $4, $5, $6::jsonb)
          `, [
                    (0, uuid_1.v4)(),
                    payrollId,
                    row.employeeEmail,
                    row.employeeName,
                    Number(row.amount).toFixed(2),
                    JSON.stringify(row),
                ]);
            }
            await client.query('COMMIT');
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
        await this.audit('payroll-service', 'CREATE_PAYROLL', 'payroll', payrollId, {
            rows: rows.length,
            uploadedBy: input.uploadedBy,
        });
        return { payrollId, status: 'PENDING_STEP_1', rows: rows.length };
    }
    async listPayrolls() {
        const result = await db_1.pool.query(`
      SELECT id, name, status, current_step, uploaded_by, created_at, updated_at
      FROM payrolls
      ORDER BY created_at DESC
      `);
        return { items: result.rows };
    }
    async getPayroll(payrollId) {
        const payrollResult = await db_1.pool.query(`SELECT * FROM payrolls WHERE id = $1`, [payrollId]);
        if (!payrollResult.rows[0]) {
            throw new common_1.NotFoundException('Payroll not found');
        }
        const entriesResult = await db_1.pool.query(`
      SELECT employee_email, employee_name, amount, raw_json
      FROM payroll_entries
      WHERE payroll_id = $1
      ORDER BY employee_name
      `, [payrollId]);
        const approvalsResult = await db_1.pool.query(`
      SELECT step, approver_user_id, status, comment, acted_at
      FROM approvals
      WHERE payroll_id = $1
      ORDER BY step, acted_at
      `, [payrollId]);
        return {
            payroll: payrollResult.rows[0],
            entries: entriesResult.rows,
            approvals: approvalsResult.rows,
        };
    }
    async approvePayroll(input) {
        const payrollResult = await db_1.pool.query(`SELECT * FROM payrolls WHERE id = $1`, [
            input.payrollId,
        ]);
        const payroll = payrollResult.rows[0];
        if (!payroll) {
            throw new common_1.NotFoundException('Payroll not found');
        }
        if (input.step !== payroll.current_step) {
            throw new common_1.BadRequestException(`Payroll currently expects approval step ${payroll.current_step}`);
        }
        const newStep = input.step + 1;
        const isFinal = input.step === 3;
        const nextStatus = isFinal ? 'APPROVED' : `PENDING_STEP_${newStep}`;
        const nextCurrentStep = isFinal ? 3 : newStep;
        const client = await db_1.pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(`
        INSERT INTO approvals(id, payroll_id, step, approver_user_id, status, comment)
        VALUES ($1, $2, $3, $4, 'APPROVED', $5)
        `, [(0, uuid_1.v4)(), input.payrollId, input.step, input.approverUserId, input.comment ?? null]);
            await client.query(`
        UPDATE payrolls
        SET status = $2, current_step = $3, updated_at = NOW()
        WHERE id = $1
        `, [input.payrollId, nextStatus, nextCurrentStep]);
            await client.query('COMMIT');
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
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
    async getDownloadUrl(payrollId) {
        const result = await db_1.pool.query(`SELECT csv_object_key FROM payrolls WHERE id = $1`, [
            payrollId,
        ]);
        const payroll = result.rows[0];
        if (!payroll) {
            throw new common_1.NotFoundException('Payroll not found');
        }
        const url = await this.storageService.getDownloadUrl(payroll.csv_object_key);
        return { payrollId, url };
    }
    async handleFinalApproval(payrollId, approverUserId) {
        const emailsResult = await db_1.pool.query(`SELECT employee_email FROM payroll_entries WHERE payroll_id = $1`, [payrollId]);
        const emails = emailsResult.rows.map((row) => row.employee_email);
        await axios_1.default.post(this.financeUrl, { payrollId, approvedBy: approverUserId });
        await axios_1.default.post(`${this.notificationUrl}/notifications/payroll-approved`, {
            payrollId,
            emails,
            subject: 'Planilla aprobada - pago en proceso',
            message: 'Tu planilla ha sido aprobada en el paso final y tu pago esta en proceso de deposito.',
        });
        await this.audit('payroll-service', 'PAYROLL_APPROVED', 'payroll', payrollId, {
            recipients: emails.length,
            approvedBy: approverUserId,
        });
    }
    async audit(service, action, entity, entityId, payload) {
        try {
            await axios_1.default.post(this.auditUrl, {
                service,
                action,
                entity,
                entityId,
                actor: service,
                payload,
            });
        }
        catch (error) {
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], AppService);
//# sourceMappingURL=app.service.js.map