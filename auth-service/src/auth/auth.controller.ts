import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpCustomerRequest } from './request/sign-up-customer.request';
import { SignInRequest } from './request/sign-in.request';
import { SignUpClientRequest } from './request/sign-up-client.request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer/sign-up')
  async signUpCustomer(
    @Body() signUpRequest: SignUpCustomerRequest,
  ): Promise<{ accessToken: string } | string> {
    const result = await this.authService.signUpCustomer(signUpRequest);
    return result;
  }

  @Post('client/sign-up')
  async signUpClient(
    @Body() signUpClientRequest: SignUpClientRequest,
  ): Promise<{ accessToken: string } | string> {
    const result = await this.authService.signUpClient(signUpClientRequest);
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
