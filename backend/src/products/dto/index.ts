export class CreateProductDto {
  name: string;
  description: string;
  categoryId: string;
  storeId?: string;
  basePrice: number;
  salePrice?: number;
  costPrice?: number;
  quantity: number;
  minOrderQty?: number;
  maxOrderQty?: number;
  weight?: number;
  dimensions?: any;
  images: string[];
  attributes?: any;
  tags?: string[];
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  basePrice?: number;
  salePrice?: number;
  quantity?: number;
  images?: string[];
  status?: string;
  isFeatured?: boolean;
}

export class SearchProductsDto {
  page?: number = 1;
  limit?: number = 20;
  categoryId?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
