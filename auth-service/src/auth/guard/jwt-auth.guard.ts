import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    const secret = process.env.JWT_SECRET;

    try {
      const payload = this.jwtService.verify(token, {
        secret: secret,
      });

      const user = await this.authService.validateUser(payload);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
