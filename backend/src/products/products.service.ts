import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ElasticsearchService } from '../common/elasticsearch.service';
import { CreateProductDto, UpdateProductDto, SearchProductsDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private esService: ElasticsearchService,
  ) {}

  async create(vendorId: string, dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        ...dto,
        vendorId,
        slug: this.generateSlug(dto.name),
        sku: `NXR-${Date.now()}`,
      },
    });
    await this.esService.indexDocument('products', product.id, {
      name: product.name,
      description: product.description,
      tags: product.tags,
      categoryId: product.categoryId,
      vendorId: product.vendorId,
      basePrice: product.basePrice,
      status: product.status,
    });
    return product;
  }

  async findAll(query: SearchProductsDto) {
    const { page = 1, limit = 20, categoryId, vendorId, minPrice, maxPrice, search, lat, lng, radius = 10 } = query;

    const where: any = { status: 'ACTIVE' };
    if (categoryId) where.categoryId = categoryId;
    if (vendorId) where.vendorId = vendorId;
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = minPrice;
      if (maxPrice) where.basePrice.lte = maxPrice;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { vendor: true, category: true, variants: true, reviews: { take: 3 } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { vendor: true, category: true, variants: true, reviews: { include: { customer: { include: { user: true } } } } },
    });
    if (!product) throw new NotFoundException('Product not found');
    await this.prisma.product.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    return product;
  }

  async update(id: string, vendorId: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || product.vendorId !== vendorId) throw new NotFoundException();
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async delete(id: string, vendorId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || product.vendorId !== vendorId) throw new NotFoundException();
    return this.prisma.product.update({ where: { id }, data: { status: 'DISCONTINUED' } });
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
}
