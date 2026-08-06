import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateStoreDto, UpdateStoreDto, CreateStaffDto, UpdateInventoryDto } from './dto';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(vendorId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { id: vendorId },
      include: {
        stores: true,
        products: { take: 5, orderBy: { createdAt: 'desc' } },
        _count: { select: { products: true, stores: true, staff: true } },
      },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');

    const orders = await this.prisma.order.findMany({
      where: { items: { some: { product: { vendorId } } } },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const revenue = await this.prisma.order.aggregate({
      where: { items: { some: { product: { vendorId } } }, status: 'DELIVERED' },
      _sum: { totalAmount: true },
    });

    return { vendor, recentOrders: orders, totalRevenue: revenue._sum.totalAmount || 0 };
  }

  async createStore(vendorId: string, dto: CreateStoreDto) {
    return this.prisma.store.create({
      data: { ...dto, vendorId },
    });
  }

  async updateStore(storeId: string, vendorId: string, dto: UpdateStoreDto) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store || store.vendorId !== vendorId) throw new ForbiddenException();
    return this.prisma.store.update({ where: { id: storeId }, data: dto });
  }

  async createStaff(vendorId: string, dto: CreateStaffDto) {
    return this.prisma.staffMember.create({ data: { ...dto, vendorId } });
  }

  async updateInventory(vendorId: string, productId: string, dto: UpdateInventoryDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.vendorId !== vendorId) throw new ForbiddenException();
    const previousQty = product.quantity;
    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: { quantity: dto.quantity },
    });
    await this.prisma.inventoryLog.create({
      data: {
        productId,
        type: dto.quantity > previousQty ? 'STOCK_IN' : 'STOCK_OUT',
        quantity: Math.abs(dto.quantity - previousQty),
        previousQty,
        newQty: dto.quantity,
        reason: dto.reason,
        createdBy: vendorId,
      },
    });
    return updated;
  }

  async getSalesReport(vendorId: string, startDate: Date, endDate: Date) {
    return this.prisma.order.groupBy({
      by: ['status'],
      where: {
        items: { some: { product: { vendorId } } },
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    });
  }
}
