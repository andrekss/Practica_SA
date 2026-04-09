import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import axios from 'axios';
import { PERMISSION_KEY } from './permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly authzUrl =
    process.env.AUTHZ_SERVICE_URL ?? 'http://authz-service:3001';

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId as string | undefined;
    if (!userId) {
      throw new ForbiddenException('Missing user');
    }

    const response = await axios.post(`${this.authzUrl}/authorize`, {
      userId,
      permission: requiredPermission,
    });

    if (!response.data?.allowed) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
