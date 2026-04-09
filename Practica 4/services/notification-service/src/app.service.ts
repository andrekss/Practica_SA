import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { pool } from './db';

@Injectable()
export class AppService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'mailhog',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
  });

  async health() {
    await pool.query('SELECT 1');
    return { status: 'ok', service: 'notification-service' };
  }

  async notifyPayrollApproved(input: {
    payrollId: string;
    emails: string[];
    subject: string;
    message: string;
  }) {
    for (const email of input.emails) {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM ?? 'no-reply@empresa.com',
        to: email,
        subject: input.subject,
        text: input.message,
      });
      await pool.query(
        `
        INSERT INTO notifications(id, payroll_id, recipient_email, subject, message)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [uuidv4(), input.payrollId, email, input.subject, input.message],
      );
    }
    return { payrollId: input.payrollId, sent: input.emails.length };
  }

  async getHistory(payrollId: string) {
    const result = await pool.query(
      `
      SELECT recipient_email, subject, message, sent_at
      FROM notifications
      WHERE payroll_id = $1
      ORDER BY sent_at DESC
      `,
      [payrollId],
    );
    return { payrollId, notifications: result.rows };
  }
}
