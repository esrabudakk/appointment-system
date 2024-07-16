import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequest } from './request/sign-up.request';
import { SignInRequest } from './request/sign-in.request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body() signUpRequest: SignUpRequest,
  ): Promise<{ accessToken: string } | string> {
    const result = await this.authService.signUp(signUpRequest);
    return result;
  }

  @Get('sign-in')
  async singIn(
    @Body() signInRequest: SignInRequest,
  ): Promise<{ accessToken: string } | string> {
    const result = await this.authService.signIn(signInRequest);
    return result;
  }

  @Get('ping')
  test(): string {
    return 'pong';
  }
}
