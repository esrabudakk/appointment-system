import { Injectable } from '@nestjs/common';
import { SignUpRequest } from './request/sign-up.request';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { SignInRequest } from './request/sign-in.request';
import { ClientUsers, Customers } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
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

  async signUp(
    signUpRequest: SignUpRequest,
  ): Promise<{ accessToken: string } | string> {
    const { firstName, lastName, phone, email, password } = signUpRequest;

    const secureSalt = this.generateSalt(10);

    const generatedHash = this.generateHashString(password, secureSalt);

    await this.redisService.set(email, generatedHash);

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

    const redisHash = await this.redisService.get(email);

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

    if (redisHash !== generatedHash) {
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
