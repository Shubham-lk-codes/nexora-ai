import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private pubClient: Redis;
  private subClient: Redis;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get('REDIS_URL') || 'redis://localhost:6379';

    const options = {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: (times: number) => {
        if (times > 3) {
          this.logger.warn('Redis unavailable — retrying in 10s');
          return 10000;
        }
        return Math.min(times * 200, 2000);
      },
      reconnectOnError: () => false,
    };

    this.client = new Redis(redisUrl, options);
    this.pubClient = new Redis(redisUrl, options);
    this.subClient = new Redis(redisUrl, options);

    // Suppress unhandled error events — ioredis emits these when Redis is down
    this.client.on('error', (err) => this.logger.warn(`Redis client error: ${err.message}`));
    this.pubClient.on('error', (err) => this.logger.warn(`Redis pub error: ${err.message}`));
    this.subClient.on('error', (err) => this.logger.warn(`Redis sub error: ${err.message}`));

    // Attempt connection (non-blocking)
    this.client.connect().catch(() => {});
    this.pubClient.connect().catch(() => {});
    this.subClient.connect().catch(() => {});
  }

  getClient(): Redis {
    return this.client;
  }

  getPubClient(): Redis {
    return this.pubClient;
  }

  getSubClient(): Redis {
    return this.subClient;
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch {
      // Redis unavailable — silently skip caching
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch {
      // ignore
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch {
      return false;
    }
  }

  async geoAdd(key: string, longitude: number, latitude: number, member: string): Promise<void> {
    try {
      await this.client.geoadd(key, longitude, latitude, member);
    } catch {
      // ignore
    }
  }

  async geoRadius(key: string, longitude: number, latitude: number, radius: number, unit: 'km' | 'm' = 'km'): Promise<string[]> {
    try {
      const result = await this.client.georadius(key, longitude, latitude, radius, unit, 'WITHDIST');
      return result as string[];
    } catch {
      return [];
    }
  }
}
