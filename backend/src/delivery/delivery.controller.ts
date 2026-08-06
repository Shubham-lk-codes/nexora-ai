import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateLocationDto, AcceptDeliveryDto } from './dto';
import { UserRole } from '@prisma/client';

@ApiTags('Delivery')
@Controller('delivery')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Post('location')
  @Roles(UserRole.DELIVERY_PARTNER)
  @ApiOperation({ summary: 'Update partner location' })
  async updateLocation(@CurrentUser('sub') partnerId: string, @Body() dto: UpdateLocationDto) {
    return this.deliveryService.updateLocation(partnerId, dto);
  }

  @Post('accept')
  @Roles(UserRole.DELIVERY_PARTNER)
  @ApiOperation({ summary: 'Accept delivery' })
  async acceptDelivery(@CurrentUser('sub') partnerId: string, @Body() dto: AcceptDeliveryDto) {
    return this.deliveryService.acceptDelivery(partnerId, dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.DELIVERY_PARTNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update delivery status' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.deliveryService.updateStatus(id, status as any, '');
  }

  @Get('my-deliveries')
  @Roles(UserRole.DELIVERY_PARTNER)
  @ApiOperation({ summary: 'Get partner deliveries' })
  async getMyDeliveries(@CurrentUser('sub') partnerId: string, @Query('status') status: string) {
    return this.deliveryService.getPartnerDeliveries(partnerId, status);
  }
}
