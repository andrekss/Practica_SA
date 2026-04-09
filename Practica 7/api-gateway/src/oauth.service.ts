import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

export interface AuthenticatedUser {
  userId: string;
  username: string;
}

@Injectable()
export class OAuthService {
  private readonly introspectionUrl =
    process.env.OAUTH_INTROSPECTION_URL ??
    'http://oauth-mock:3010/oauth/introspect';

  async validateToken(token: string): Promise<AuthenticatedUser> {
    try {
      const response = await axios.post(this.introspectionUrl, { token });
      if (!response.data?.active) {
        throw new UnauthorizedException('Token is not active');
      }
      return {
        userId: String(response.data.userId),
        username: String(response.data.username ?? 'unknown'),
      };
    } catch (error) {
      throw new UnauthorizedException('OAuth validation failed');
    }
  }
}
