export class CreateServiceDto {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  duration: number;
  image?: string;
}

export class BookAppointmentDto {
  serviceId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  address?: any;
  notes?: string;
}

export class UpdateAvailabilityDto {
  slots: { dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }[];
}
