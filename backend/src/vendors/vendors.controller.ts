import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateStoreDto, UpdateStoreDto, CreateStaffDto, UpdateInventoryDto } from './dto';
import { UserRole } from '@prisma/client';

@ApiTags('Vendors')
@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  @Get('dashboard')
  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get vendor dashboard' })
  async getDashboard(@CurrentUser('sub') userId: string) {
    return this.vendorsService.getDashboard(userId);
  }

  @Post('stores')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Create new store' })
  async createStore(@CurrentUser('sub') userId: string, @Body() dto: CreateStoreDto) {
    return this.vendorsService.createStore(userId, dto);
  }

  @Patch('stores/:id')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Update store' })
  async updateStore(@CurrentUser('sub') userId: string, @Param('id') storeId: string, @Body() dto: UpdateStoreDto) {
    return this.vendorsService.updateStore(storeId, userId, dto);
  }

  @Post('staff')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Add staff member' })
  async createStaff(@CurrentUser('sub') userId: string, @Body() dto: CreateStaffDto) {
    return this.vendorsService.createStaff(userId, dto);
  }

  @Patch('inventory/:productId')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Update product inventory' })
  async updateInventory(@CurrentUser('sub') userId: string, @Param('productId') productId: string, @Body() dto: UpdateInventoryDto) {
    return this.vendorsService.updateInventory(userId, productId, dto);
  }

  @Get('sales-report')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Get sales analytics' })
  async getSalesReport(@CurrentUser('sub') userId: string, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.vendorsService.getSalesReport(userId, new Date(startDate), new Date(endDate));
  }
}
