import { Injectable } from '@nestjs/common';
import { SignUpCustomerRequest } from './request/sign-up-customer.request';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignInRequest } from './request/sign-in.request';
import { ClientUsers, Customers } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import * as crypto from 'crypto';
import { SignUpClientRequest } from './request/sign-up-client.request';
import { ClientType } from './enum/client-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private generateSalt(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  private generateHashString(password: string, salt: string): string {
    return crypto.createHmac('sha512', salt).update(password).digest('hex');
  }

  async generateAccessToken(user: Customers | ClientUsers): Promise<string> {
    const payload = { username: user.email, sub: user.id };

    return this.jwtService.sign(payload);
  }

  async signUpCustomer(
    signUpCustomerRequest: SignUpCustomerRequest,
  ): Promise<{ accessToken: string } | string> {
    const { firstName, lastName, phone, email, password } =
      signUpCustomerRequest;

    const secureSalt = this.generateSalt(10);

    const hashedPassword = this.generateHashString(password, secureSalt);

    const foundUser = await this.prismaService.customers.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (foundUser) {
      return 'User already exists';
    }

    const createdUser = await this.prismaService.customers.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        secureSalt,
        hashedPassword,
        createdAt: new Date(),
      },
    });

    const accessToken = await this.generateAccessToken(createdUser);

    return { accessToken: accessToken };
  }

  async signUpClient(
    signUpClientRequest: SignUpClientRequest,
  ): Promise<{ accessToken: string } | string> {
    const {
      firstName,
      lastName,
      phone,
      email,
      password,
      clientName,
      clientType,
      taxNumber,
      taxOffice,
      country,
      city,
      address,
    } = signUpClientRequest;

    const secureSalt = this.generateSalt(10);

    const hashedPassword = this.generateHashString(password, secureSalt);

    const foundUser = await this.prismaService.clientUsers.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (foundUser) {
      return 'User already exists';
    }

    const createdClient = await this.prismaService.clients.create({
      data: {
        clientName,
        clientType: ClientType[clientType as keyof typeof ClientType],
        taxNumber,
        taxOffice,
        country,
        city,
        address,
        createdAt: new Date(),
      },
    });

    const createdUser = await this.prismaService.clientUsers.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        secureSalt,
        hashedPassword,
        clientId: createdClient.id,
        createdAt: new Date(),
      },
    });

    const accessToken = await this.generateAccessToken(createdUser);

    return { accessToken: accessToken };
  }

  async signIn(
    signInRequest: SignInRequest,
  ): Promise<{ accessToken: string } | string> {
    const { email, password } = signInRequest;

    const foundUser = await this.prismaService.customers.findFirst({
      where: {
        email,
      },
    });

    if (!foundUser) {
      return 'Invalid credentials';
    }

    const generatedHash = this.generateHashString(
      password,
      foundUser.secureSalt,
    );

    if (foundUser.hashedPassword !== generatedHash) {
      return 'Invalid credentials';
    }

    const accessToken = await this.generateAccessToken(foundUser);

    return { accessToken: accessToken };
  }

  async validateUser(payload: JwtPayload): Promise<Customers | ClientUsers> {
    return this.prismaService.customers.findUnique({
      where: { id: payload.sub },
    });
  }
}
