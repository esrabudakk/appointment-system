import { IsEmail, MinLength } from 'class-validator';

export class SignInRequest {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
