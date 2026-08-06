import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import { ElasticsearchService } from './elasticsearch.service';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [PrismaService, RedisService, ElasticsearchService, LoggerService],
  exports: [PrismaService, RedisService, ElasticsearchService, LoggerService],
})
export class CommonModule {}
