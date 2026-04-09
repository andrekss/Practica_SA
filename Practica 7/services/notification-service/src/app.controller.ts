import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsArray, IsString } from 'class-validator';
import { AppService } from './app.service';

class NotifyPayrollDto {
  @IsString()
  payrollId!: string;

  @IsArray()
  emails!: string[];

  @IsString()
  subject!: string;

  @IsString()
  message!: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return this.appService.health();
  }

  @Post('notifications/payroll-approved')
  notifyPayroll(@Body() body: NotifyPayrollDto) {
    return this.appService.notifyPayrollApproved(body);
  }

  @Get('notifications/history/:payrollId')
  history(@Param('payrollId') payrollId: string) {
    return this.appService.getHistory(payrollId);
  }
}
