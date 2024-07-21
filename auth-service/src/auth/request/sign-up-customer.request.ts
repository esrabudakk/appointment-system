import { IsString, IsEmail, IsPhoneNumber, MinLength } from 'class-validator';

export class SignUpCustomerRequest {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @MinLength(6)
  password: string;
}
