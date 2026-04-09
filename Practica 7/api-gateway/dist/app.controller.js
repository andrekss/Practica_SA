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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const gateway_service_1 = require("./gateway.service");
const approve_payroll_dto_1 = require("./dto/approve-payroll.dto");
const permission_decorator_1 = require("./permission.decorator");
let AppController = class AppController {
    constructor(gatewayService) {
        this.gatewayService = gatewayService;
    }
    getHealth() {
        return this.gatewayService.healthCheck();
    }
    uploadPayroll(file, request, name) {
        return this.gatewayService.uploadPayroll(file, request.user.userId, name);
    }
    listPayrolls() {
        return this.gatewayService.getPayrolls();
    }
    getPayroll(id) {
        return this.gatewayService.getPayroll(id);
    }
    approvePayroll(id, request, dto) {
        return this.gatewayService.approvePayroll(id, request.user.userId, dto.step, dto.comment);
    }
    downloadPayroll(id) {
        return this.gatewayService.getDownloadUrl(id);
    }
    getLogs(query) {
        return this.gatewayService.getLogs(query);
    }
    getPermissions(id) {
        return this.gatewayService.getPermissions(id);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('api/payrolls/upload'),
    (0, permission_decorator_1.RequirePermission)('payroll:create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "uploadPayroll", null);
__decorate([
    (0, common_1.Get)('api/payrolls'),
    (0, permission_decorator_1.RequirePermission)('payroll:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "listPayrolls", null);
__decorate([
    (0, common_1.Get)('api/payrolls/:id'),
    (0, permission_decorator_1.RequirePermission)('payroll:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getPayroll", null);
__decorate([
    (0, common_1.Post)('api/payrolls/:id/approve'),
    (0, permission_decorator_1.RequirePermission)('payroll:approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, approve_payroll_dto_1.ApprovePayrollDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "approvePayroll", null);
__decorate([
    (0, common_1.Get)('api/payrolls/:id/download'),
    (0, permission_decorator_1.RequirePermission)('payroll:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "downloadPayroll", null);
__decorate([
    (0, common_1.Get)('api/logs'),
    (0, permission_decorator_1.RequirePermission)('logs:read'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('api/users/:id/permissions'),
    (0, permission_decorator_1.RequirePermission)('users:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getPermissions", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [gateway_service_1.GatewayService])
], AppController);
//# sourceMappingURL=app.controller.js.map