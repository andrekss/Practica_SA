import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsBase64, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { AppService } from './app.service';

class UploadPayrollDto {
  @IsString()
  name!: string;

  @IsString()
  uploadedBy!: string;

  @IsBase64()
  csvBase64!: string;
}

class ApprovePayrollDto {
  @IsInt()
  @Min(1)
  @Max(3)
  step!: number;

  @IsString()
  approverUserId!: string;

  @IsOptional()
  @IsString()
  comment?: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return this.appService.health();
  }

  @Post('payrolls/upload-json')
  uploadPayroll(@Body() body: UploadPayrollDto) {
    return this.appService.uploadPayroll(body);
  }

  @Get('payrolls')
  listPayrolls() {
    return this.appService.listPayrolls();
  }

  @Get('payrolls/:id')
  getPayroll(@Param('id') id: string) {
    return this.appService.getPayroll(id);
  }

  @Post('payrolls/:id/approve')
  approvePayroll(@Param('id') id: string, @Body() body: ApprovePayrollDto) {
    return this.appService.approvePayroll({
      payrollId: id,
      step: body.step,
      approverUserId: body.approverUserId,
      comment: body.comment,
    });
  }

  @Get('payrolls/:id/download')
  download(@Param('id') id: string) {
    return this.appService.getDownloadUrl(id);
  }
}
