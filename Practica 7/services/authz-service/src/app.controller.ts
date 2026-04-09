import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsString } from 'class-validator';
import { AppService } from './app.service';

class AuthorizeDto {
  @IsString()
  userId!: string;

  @IsString()
  permission!: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return this.appService.health();
  }

  @Post('authorize')
  authorize(@Body() body: AuthorizeDto) {
    return this.appService.authorize(body.userId, body.permission);
  }

  @Get('users/:userId/permissions')
  userPermissions(@Param('userId') userId: string) {
    return this.appService.getUserPermissions(userId);
  }
}
