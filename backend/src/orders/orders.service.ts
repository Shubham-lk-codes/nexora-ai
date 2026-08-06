import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private notifications: NotificationsService,
  ) {}

  async create(customerId: string, dto: CreateOrderDto) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { customerId },
      include: { product: true },
    });
    if (!cartItems.length) throw new BadRequestException('Cart is empty');

    let subtotal = 0;
    const orderItems = cartItems.map((item) => {
      const price = item.product.salePrice || item.product.basePrice;
      const total = Number(price) * item.quantity;
      subtotal += total;
      return {
        productId: item.productId,
        productName: item.product.name,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: total,
      };
    });

    const orderNumber = `NXR-${Date.now()}`;
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerId,
        addressId: dto.addressId,
        subtotal,
        taxAmount: subtotal * 0.18,
        deliveryFee: dto.deliveryFee || 0,
        platformFee: subtotal * 0.02,
        discountAmount: dto.discountAmount || 0,
        totalAmount: subtotal + (subtotal * 0.18) + (dto.deliveryFee || 0) + (subtotal * 0.02) - (dto.discountAmount || 0),
        paymentMethod: dto.paymentMethod,
        items: { create: orderItems },
        timeline: { create: { status: OrderStatus.PENDING, note: 'Order placed' } },
      },
      include: { items: true, address: true },
    });

    await this.prisma.cartItem.deleteMany({ where: { customerId } });
    await this.notifications.sendPush(customerId, 'Order Placed', `Your order ${orderNumber} has been placed successfully.`);

    return order;
  }

  async findByCustomer(customerId: string, page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { customerId },
        skip: (page - 1) * limit,
        take: limit,
        include: { items: { include: { product: { select: { images: true } } } }, delivery: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { customerId } }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async findById(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true, address: true, delivery: true, timeline: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.customerId !== userId && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      throw new BadRequestException('Access denied');
    }
    return order;
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto, updatedBy: string) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status as OrderStatus },
    });
    await this.prisma.orderTimeline.create({
      data: { orderId, status: dto.status as OrderStatus, note: dto.note, createdBy: updatedBy },
    });
    await this.notifications.sendPush(order.customerId, 'Order Update', `Your order is now ${dto.status}`);
    return order;
  }
}
