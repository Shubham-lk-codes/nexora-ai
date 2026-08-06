export class UpdateVendorStatusDto {
  status: string;
  commissionRate?: number;
}

export class CreateCouponDto {
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startDate: Date;
  endDate: Date;
}
