import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateLocationDto, AcceptDeliveryDto } from './dto';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class DeliveryService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private notifications: NotificationsService,
  ) {}

  async assignDelivery(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { address: true } });
    if (!order) throw new NotFoundException('Order not found');

    const partners = await this.redis.geoRadius(
      'delivery:partners',
      Number(order.address.longitude),
      Number(order.address.latitude),
      5,
      'km',
    );

    const delivery = await this.prisma.delivery.create({
      data: {
        orderId,
        pickupLat: 0,
        pickupLng: 0,
        dropoffLat: Number(order.address.latitude),
        dropoffLng: Number(order.address.longitude),
        status: DeliveryStatus.UNASSIGNED,
      },
    });
    return delivery;
  }

  async acceptDelivery(partnerId: string, dto: AcceptDeliveryDto) {
    const delivery = await this.prisma.delivery.update({
      where: { id: dto.deliveryId },
      data: { partnerId, status: DeliveryStatus.ACCEPTED },
      include: { order: true },
    });
    await this.notifications.sendPush(delivery.order.customerId, 'Delivery Update', 'A delivery partner has been assigned.');
    return delivery;
  }

  async updateLocation(partnerId: string, dto: UpdateLocationDto) {
    await this.redis.geoAdd('delivery:partners', dto.longitude, dto.latitude, partnerId);
    await this.prisma.deliveryPartnerProfile.update({
      where: { id: partnerId },
      data: { currentLat: dto.latitude, currentLng: dto.longitude, isOnline: true },
    });
    await this.prisma.locationHistory.create({
      data: { partnerId, latitude: dto.latitude, longitude: dto.longitude, accuracy: dto.accuracy },
    });
    return { success: true };
  }

  async updateStatus(deliveryId: string, status: DeliveryStatus, partnerId: string) {
    const delivery = await this.prisma.delivery.update({
      where: { id: deliveryId },
      data: { status, pickedUpAt: status === 'PICKED_UP' ? new Date() : undefined, deliveredAt: status === 'DELIVERED' ? new Date() : undefined },
      include: { order: true },
    });
    await this.notifications.sendPush(delivery.order.customerId, 'Delivery Update', `Order is ${status.toLowerCase().replace('_', ' ')}`);
    return delivery;
  }

  async getPartnerDeliveries(partnerId: string, status?: string) {
    return this.prisma.delivery.findMany({
      where: { partnerId, ...(status && { status: status as DeliveryStatus }) },
      include: { order: { include: { items: true, address: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
