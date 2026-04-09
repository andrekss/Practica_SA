import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuthService } from './oauth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly oauthService: OAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.path === '/health') {
      return true;
    }

    const header = request.headers.authorization as string | undefined;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = header.replace('Bearer ', '').trim();
    const user = await this.oauthService.validateToken(token);
    request.user = user;
    return true;
  }
}
