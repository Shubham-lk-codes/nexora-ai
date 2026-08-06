import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import { CreatePaymentDto, WalletTopupDto } from './dto';
import { PaymentStatus, TransactionType } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async createTransaction(userId: string, dto: CreatePaymentDto) {
    return this.prisma.paymentTransaction.create({
      data: {
        userId,
        orderId: dto.orderId,
        amount: dto.amount,
        currency: 'INR',
        gateway: dto.gateway,
        method: dto.method,
        status: PaymentStatus.PENDING,
      },
    });
  }

  async verifyPayment(gateway: string, payload: any) {
    if (gateway === 'RAZORPAY') {
      // Verify razorpay signature
    }
    return { verified: true };
  }

  async walletTopup(userId: string, dto: WalletTopupDto) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new BadRequestException('Wallet not found');

    const updated = await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: dto.amount } },
    });

    await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: TransactionType.CREDIT,
        amount: dto.amount,
        balance: updated.balance,
        description: 'Wallet top-up',
      },
    });
    return updated;
  }

  async processPayout(userId: string, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || Number(wallet.balance) < amount) throw new BadRequestException('Insufficient balance');

    const updated = await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });

    await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: TransactionType.PAYOUT,
        amount: -amount,
        balance: updated.balance,
        description: 'Payout to bank account',
      },
    });
    return updated;
  }
}
