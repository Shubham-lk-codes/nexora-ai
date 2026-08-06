export class CreatePaymentDto {
  orderId?: string;
  amount: number;
  gateway: string;
  method: string;
}

export class WalletTopupDto {
  amount: number;
  gateway: string;
}
