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
exports.GatewayService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const sync_1 = require("csv-parse/sync");
let GatewayService = class GatewayService {
    constructor() {
        this.payrollUrl = process.env.PAYROLL_SERVICE_URL ?? 'http://payroll-service:3002';
        this.auditUrl = process.env.AUDIT_SERVICE_URL ?? 'http://audit-service:3004';
        this.authzUrl = process.env.AUTHZ_SERVICE_URL ?? 'http://authz-service:3001';
    }
    async uploadPayroll(file, userId, name) {
        if (!file) {
            throw new common_1.BadRequestException('CSV file is required');
        }
        if (!name) {
            throw new common_1.BadRequestException('Payroll name is required');
        }
        try {
            const csvText = file.buffer.toString('utf8');
            (0, sync_1.parse)(csvText, { columns: true, skip_empty_lines: true });
            const csvBase64 = Buffer.from(csvText).toString('base64');
            const response = await axios_1.default.post(`${this.payrollUrl}/payrolls/upload-json`, {
                name,
                uploadedBy: userId,
                csvBase64,
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid CSV format or upload failed');
        }
    }
    async getPayrolls() {
        const response = await axios_1.default.get(`${this.payrollUrl}/payrolls`);
        return response.data;
    }
    async getPayroll(payrollId) {
        const response = await axios_1.default.get(`${this.payrollUrl}/payrolls/${payrollId}`);
        return response.data;
    }
    async approvePayroll(payrollId, userId, step, comment) {
        const response = await axios_1.default.post(`${this.payrollUrl}/payrolls/${payrollId}/approve`, {
            step,
            approverUserId: userId,
            comment,
        });
        return response.data;
    }
    async getDownloadUrl(payrollId) {
        const response = await axios_1.default.get(`${this.payrollUrl}/payrolls/${payrollId}/download`);
        return response.data;
    }
    async getLogs(params) {
        const response = await axios_1.default.get(`${this.auditUrl}/logs`, { params });
        return response.data;
    }
    async getPermissions(userId) {
        const response = await axios_1.default.get(`${this.authzUrl}/users/${userId}/permissions`);
        return response.data;
    }
    async healthCheck() {
        try {
            const [payroll, authz, audit] = await Promise.all([
                axios_1.default.get(`${this.payrollUrl}/health`),
                axios_1.default.get(`${this.authzUrl}/health`),
                axios_1.default.get(`${this.auditUrl}/health`),
            ]);
            return {
                status: 'ok',
                services: {
                    payroll: payroll.data,
                    authz: authz.data,
                    audit: audit.data,
                },
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Dependency health check failed');
        }
    }
};
exports.GatewayService = GatewayService;
exports.GatewayService = GatewayService = __decorate([
    (0, common_1.Injectable)()
], GatewayService);
//# sourceMappingURL=gateway.service.js.map