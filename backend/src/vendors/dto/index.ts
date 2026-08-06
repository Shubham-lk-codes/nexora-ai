export class CreateStoreDto {
  name: string;
  description?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  openTime?: string;
  closeTime?: string;
  openDays?: number[];
}

export class UpdateStoreDto {
  name?: string;
  description?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  isActive?: boolean;
  openTime?: string;
  closeTime?: string;
}

export class CreateStaffDto {
  name: string;
  email?: string;
  phone?: string;
  role: string;
  permissions?: any;
}

export class UpdateInventoryDto {
  quantity: number;
  reason?: string;
}
