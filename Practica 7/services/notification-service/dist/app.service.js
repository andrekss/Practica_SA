"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = __importDefault(require("nodemailer"));
const uuid_1 = require("uuid");
const db_1 = require("./db");
let AppService = class AppService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST ?? 'mailhog',
            port: Number(process.env.SMTP_PORT ?? 1025),
            secure: false,
        });
    }
    async health() {
        await db_1.pool.query('SELECT 1');
        return { status: 'ok', service: 'notification-service' };
    }
    async notifyPayrollApproved(input) {
        for (const email of input.emails) {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM ?? 'no-reply@empresa.com',
                to: email,
                subject: input.subject,
                text: input.message,
            });
            await db_1.pool.query(`
        INSERT INTO notifications(id, payroll_id, recipient_email, subject, message)
        VALUES ($1, $2, $3, $4, $5)
        `, [(0, uuid_1.v4)(), input.payrollId, email, input.subject, input.message]);
        }
        return { payrollId: input.payrollId, sent: input.emails.length };
    }
    async getHistory(payrollId) {
        const result = await db_1.pool.query(`
      SELECT recipient_email, subject, message, sent_at
      FROM notifications
      WHERE payroll_id = $1
      ORDER BY sent_at DESC
      `, [payrollId]);
        return { payrollId, notifications: result.rows };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map