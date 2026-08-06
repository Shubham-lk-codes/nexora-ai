export class UpdateLocationDto {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export class AcceptDeliveryDto {
  deliveryId: string;
}
