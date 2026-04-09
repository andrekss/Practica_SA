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
const class_validator_1 = require("class-validator");
const app_service_1 = require("./app.service");
class UploadPayrollDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadPayrollDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadPayrollDto.prototype, "uploadedBy", void 0);
__decorate([
    (0, class_validator_1.IsBase64)(),
    __metadata("design:type", String)
], UploadPayrollDto.prototype, "csvBase64", void 0);
class ApprovePayrollDto {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(3),
    __metadata("design:type", Number)
], ApprovePayrollDto.prototype, "step", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApprovePayrollDto.prototype, "approverUserId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApprovePayrollDto.prototype, "comment", void 0);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    health() {
        return this.appService.health();
    }
    uploadPayroll(body) {
        return this.appService.uploadPayroll(body);
    }
    listPayrolls() {
        return this.appService.listPayrolls();
    }
    getPayroll(id) {
        return this.appService.getPayroll(id);
    }
    approvePayroll(id, body) {
        return this.appService.approvePayroll({
            payrollId: id,
            step: body.step,
            approverUserId: body.approverUserId,
            comment: body.comment,
        });
    }
    download(id) {
        return this.appService.getDownloadUrl(id);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "health", null);
__decorate([
    (0, common_1.Post)('payrolls/upload-json'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UploadPayrollDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "uploadPayroll", null);
__decorate([
    (0, common_1.Get)('payrolls'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "listPayrolls", null);
__decorate([
    (0, common_1.Get)('payrolls/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getPayroll", null);
__decorate([
    (0, common_1.Post)('payrolls/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ApprovePayrollDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "approvePayroll", null);
__decorate([
    (0, common_1.Get)('payrolls/:id/download'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "download", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map