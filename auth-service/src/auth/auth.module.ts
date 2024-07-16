import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Secret key
      signOptions: { expiresIn: process.env.JWT_EXPIRATION }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
