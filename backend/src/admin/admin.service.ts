import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UpdateVendorStatusDto, CreateCouponDto } from './dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalVendors, totalOrders, totalRevenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.vendorProfile.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: 'DELIVERED' } }),
    ]);
    return { totalUsers, totalVendors, totalOrders, totalRevenue: totalRevenue._sum.totalAmount || 0 };
  }

  async getPendingVendors() {
    return this.prisma.vendorProfile.findMany({
      where: { status: 'PENDING' },
      include: { user: true },
    });
  }

  async updateVendorStatus(vendorId: string, dto: UpdateVendorStatusDto) {
    return this.prisma.vendorProfile.update({
      where: { id: vendorId },
      data: { status: dto.status as any, commissionRate: dto.commissionRate },
    });
  }

  async createCoupon(dto: CreateCouponDto) {
    return this.prisma.coupon.create({ data: dto as any });
  }

  async getSupportTickets(status?: string) {
    return this.prisma.supportTicket.findMany({
      where: status ? { status: status as any } : {},
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
