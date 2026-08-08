import { Module } from '@nestjs/common';
import { DeliveryGateway } from './delivery.gateway';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [DeliveryService, DeliveryGateway],
  controllers: [DeliveryController],
  exports: [DeliveryService],
})
export class DeliveryModule {}
