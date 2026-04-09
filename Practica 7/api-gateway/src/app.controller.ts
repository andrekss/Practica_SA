import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GatewayService } from './gateway.service';
import { ApprovePayrollDto } from './dto/approve-payroll.dto';
import { RequirePermission } from './permission.decorator';

@Controller()
export class AppController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('health')
  getHealth() {
    return this.gatewayService.healthCheck();
  }

  @Post('api/payrolls/upload')
  @RequirePermission('payroll:create')
  @UseInterceptors(FileInterceptor('file'))
  uploadPayroll(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: { user: { userId: string } },
    @Body('name') name: string,
  ) {
    return this.gatewayService.uploadPayroll(file, request.user.userId, name);
  }

  @Get('api/payrolls')
  @RequirePermission('payroll:read')
  listPayrolls() {
    return this.gatewayService.getPayrolls();
  }

  @Get('api/payrolls/:id')
  @RequirePermission('payroll:read')
  getPayroll(@Param('id') id: string) {
    return this.gatewayService.getPayroll(id);
  }

  @Post('api/payrolls/:id/approve')
  @RequirePermission('payroll:approve')
  approvePayroll(
    @Param('id') id: string,
    @Req() request: { user: { userId: string } },
    @Body() dto: ApprovePayrollDto,
  ) {
    return this.gatewayService.approvePayroll(
      id,
      request.user.userId,
      dto.step,
      dto.comment,
    );
  }

  @Get('api/payrolls/:id/download')
  @RequirePermission('payroll:read')
  downloadPayroll(@Param('id') id: string) {
    return this.gatewayService.getDownloadUrl(id);
  }

  @Get('api/logs')
  @RequirePermission('logs:read')
  getLogs(@Query() query: Record<string, string | undefined>) {
    return this.gatewayService.getLogs(query);
  }

  @Get('api/users/:id/permissions')
  @RequirePermission('users:read')
  getPermissions(@Param('id') id: string) {
    return this.gatewayService.getPermissions(id);
  }
}
