import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreatePaymentDto, WalletTopupDto } from './dto';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('transaction')
  @ApiOperation({ summary: 'Create payment transaction' })
  async createTransaction(@CurrentUser('sub') userId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createTransaction(userId, dto);
  }

  @Post('wallet/topup')
  @ApiOperation({ summary: 'Top up wallet' })
  async walletTopup(@CurrentUser('sub') userId: string, @Body() dto: WalletTopupDto) {
    return this.paymentsService.walletTopup(userId, dto);
  }

  @Post('wallet/payout')
  @ApiOperation({ summary: 'Request payout' })
  async payout(@CurrentUser('sub') userId: string, @Body('amount') amount: number) {
    return this.paymentsService.processPayout(userId, amount);
  }
}
