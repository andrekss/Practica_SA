import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { Express } from 'express';
import { parse } from 'csv-parse/sync';

@Injectable()
export class GatewayService {
  private readonly payrollUrl =
    process.env.PAYROLL_SERVICE_URL ?? 'http://payroll-service:3002';
  private readonly auditUrl =
    process.env.AUDIT_SERVICE_URL ?? 'http://audit-service:3004';
  private readonly authzUrl =
    process.env.AUTHZ_SERVICE_URL ?? 'http://authz-service:3001';

  async uploadPayroll(file: Express.Multer.File, userId: string, name: string) {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }
    if (!name) {
      throw new BadRequestException('Payroll name is required');
    }

    try {
      const csvText = file.buffer.toString('utf8');
      parse(csvText, { columns: true, skip_empty_lines: true });
      const csvBase64 = Buffer.from(csvText).toString('base64');

      const response = await axios.post(`${this.payrollUrl}/payrolls/upload-json`, {
        name,
        uploadedBy: userId,
        csvBase64,
      });
      return response.data;
    } catch (error) {
      throw new BadRequestException('Invalid CSV format or upload failed');
    }
  }

  async getPayrolls() {
    const response = await axios.get(`${this.payrollUrl}/payrolls`);
    return response.data;
  }

  async getPayroll(payrollId: string) {
    const response = await axios.get(`${this.payrollUrl}/payrolls/${payrollId}`);
    return response.data;
  }

  async approvePayroll(
    payrollId: string,
    userId: string,
    step: number,
    comment?: string,
  ) {
    const response = await axios.post(
      `${this.payrollUrl}/payrolls/${payrollId}/approve`,
      {
        step,
        approverUserId: userId,
        comment,
      },
    );
    return response.data;
  }

  async getDownloadUrl(payrollId: string) {
    const response = await axios.get(
      `${this.payrollUrl}/payrolls/${payrollId}/download`,
    );
    return response.data;
  }

  async getLogs(params: Record<string, string | undefined>) {
    const response = await axios.get(`${this.auditUrl}/logs`, { params });
    return response.data;
  }

  async getPermissions(userId: string) {
    const response = await axios.get(`${this.authzUrl}/users/${userId}/permissions`);
    return response.data;
  }

  async healthCheck() {
    try {
      const [payroll, authz, audit] = await Promise.all([
        axios.get(`${this.payrollUrl}/health`),
        axios.get(`${this.authzUrl}/health`),
        axios.get(`${this.auditUrl}/health`),
      ]);
      return {
        status: 'ok',
        services: {
          payroll: payroll.data,
          authz: authz.data,
          audit: audit.data,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Dependency health check failed');
    }
  }
}
