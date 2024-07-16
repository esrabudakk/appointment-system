import { Injectable } from '@nestjs/common';

import Redis from 'ioredis';
@Injectable()
export class RedisService {
  private readonly redisClient;

  constructor() {
    const redisHost = process.env.REDIS_HOST;

    const redisPort = Number(process.env.REDIS_PORT);

    this.redisClient = new Redis({
      host: redisHost,
      port: redisPort,
    });

    this.redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async set(key: string, value: string) {
    return this.redisClient.set(key, value);
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async exists(key: string) {
    return this.redisClient.exists(key);
  }

  getClient() {
    return this.redisClient;
  }
}
