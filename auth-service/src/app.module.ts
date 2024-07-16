import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, RedisModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
