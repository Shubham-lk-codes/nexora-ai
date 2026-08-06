import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateVendorStatusDto, CreateCouponDto } from './dto';
import { UserRole } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth('JWT')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('vendors/pending')
  @ApiOperation({ summary: 'Pending vendor approvals' })
  async getPendingVendors() {
    return this.adminService.getPendingVendors();
  }

  @Patch('vendors/:id/status')
  @ApiOperation({ summary: 'Approve/reject vendor' })
  async updateVendorStatus(@Param('id') id: string, @Body() dto: UpdateVendorStatusDto) {
    return this.adminService.updateVendorStatus(id, dto);
  }

  @Post('coupons')
  @ApiOperation({ summary: 'Create coupon' })
  async createCoupon(@Body() dto: CreateCouponDto) {
    return this.adminService.createCoupon(dto);
  }

  @Get('support-tickets')
  @ApiOperation({ summary: 'Get support tickets' })
  async getTickets(@Query('status') status: string) {
    return this.adminService.getSupportTickets(status);
  }
}
