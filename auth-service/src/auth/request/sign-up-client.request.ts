import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ClientType } from '../enum/client-type.enum';

export class SignUpClientRequest {
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

  @IsString()
  clientName: string;

  @IsEnum(ClientType)
  clientType: string;

  @IsString()
  taxNumber: string;

  @IsString()
  taxOffice: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  address: string;
}
