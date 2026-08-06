import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateServiceDto, BookAppointmentDto, UpdateAvailabilityDto } from './dto';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'List services' })
  async findAll(@Query('categoryId') categoryId?: string) {
    return this.servicesService.findServices(categoryId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create service' })
  async create(@CurrentUser('sub') providerId: string, @Body() dto: CreateServiceDto) {
    return this.servicesService.createService(providerId, dto);
  }

  @Post('appointments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Book appointment' })
  async book(@CurrentUser('sub') customerId: string, @Body() dto: BookAppointmentDto) {
    return this.servicesService.bookAppointment(customerId, dto);
  }

  @Patch('availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update availability' })
  async updateAvailability(@CurrentUser('sub') providerId: string, @Body() dto: UpdateAvailabilityDto) {
    return this.servicesService.updateAvailability(providerId, dto);
  }
}
