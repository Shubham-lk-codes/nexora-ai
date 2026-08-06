export class CreateOrderDto {
  addressId: string;
  paymentMethod: string;
  deliveryFee?: number;
  discountAmount?: number;
  couponCode?: string;
  notes?: string;
}

export class UpdateOrderStatusDto {
  status: string;
  note?: string;
}
