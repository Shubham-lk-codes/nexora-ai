import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateServiceDto, BookAppointmentDto, UpdateAvailabilityDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async createService(providerId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: { ...dto, providerId },
    });
  }

  async findServices(categoryId?: string, lat?: number, lng?: number) {
    return this.prisma.service.findMany({
      where: { isActive: true, ...(categoryId && { categoryId }) },
      include: { provider: { include: { user: true } }, category: true, reviews: true },
    });
  }

  async bookAppointment(customerId: string, dto: BookAppointmentDto) {
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    return this.prisma.appointment.create({
      data: {
        customerId,
        serviceId: dto.serviceId,
        providerId: service.providerId,
        scheduledDate: new Date(dto.scheduledDate),
        startTime: dto.startTime,
        endTime: dto.endTime,
        price: service.price,
        totalAmount: Number(service.price) + (Number(service.price) * 0.05),
        address: dto.address,
        notes: dto.notes,
      },
    });
  }

  async updateAvailability(providerId: string, dto: UpdateAvailabilityDto) {
    await this.prisma.availabilitySlot.deleteMany({ where: { providerId } });
    return this.prisma.availabilitySlot.createMany({
      data: dto.slots.map((slot) => ({ ...slot, providerId })),
    });
  }
}
