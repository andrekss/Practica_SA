import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { AppService } from './app.service';

class CreateLogDto {
  @IsString()
  service!: string;

  @IsString()
  action!: string;

  @IsString()
  entity!: string;

  @IsString()
  entityId!: string;

  @IsString()
  actor!: string;

  @IsObject()
  payload!: Record<string, unknown>;
}

class LogQueryDto {
  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  entity?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return this.appService.health();
  }

  @Post('logs')
  create(@Body() body: CreateLogDto) {
    return this.appService.createLog(body);
  }

  @Get('logs')
  list(@Query() query: LogQueryDto) {
    return this.appService.listLogs(query);
  }
}
