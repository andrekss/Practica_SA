import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GatewayService } from './gateway.service';
import { OAuthService } from './oauth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { PermissionGuard } from './permission.guard';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    GatewayService,
    OAuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
