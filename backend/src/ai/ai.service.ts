import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ElasticsearchService } from '../common/elasticsearch.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService, private es: ElasticsearchService) {}

  async getRecommendations(userId: string) {
    const profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
      include: { orders: { include: { items: true } }, wishlistItems: true },
    });
    if (!profile) return [];

    const categoryIds = profile.orders.flatMap(o => o.items.map(i => i.productId));
    const trending = await this.prisma.product.findMany({
      where: { status: 'ACTIVE', categoryId: { in: categoryIds.length ? categoryIds : undefined } },
      orderBy: [{ totalSales: 'desc' }, { avgRating: 'desc' }],
      take: 10,
      include: { vendor: true, category: true },
    });
    return trending;
  }

  async smartSearch(query: string, userId?: string) {
    await this.prisma.searchLog.create({
      data: { userId, query, resultsCount: 0 },
    });

    const results = await this.es.search('products', {
      multi_match: {
        query,
        fields: ['name^3', 'description', 'tags^2'],
        fuzziness: 'AUTO',
      },
    });
    return results.hits.hits;
  }

  async sentimentAnalysis(text: string) {
    const positive = ['good', 'great', 'excellent', 'amazing', 'love', 'best'];
    const negative = ['bad', 'terrible', 'worst', 'hate', 'poor', 'awful'];
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    words.forEach(w => {
      if (positive.includes(w)) score++;
      if (negative.includes(w)) score--;
    });
    return { sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral', score };
  }

  async demandForecast(productId: string) {
    const history = await this.prisma.orderItem.findMany({
      where: { productId },
      include: { order: true },
      orderBy: { order: { createdAt: 'desc' } },
      take: 90,
    });
    const dailySales = history.reduce((acc: any, item) => {
      const date = item.order.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + item.quantity;
      return acc;
    }, {});
    const values = Object.values(dailySales) as number[];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return { forecast: Math.round(avg * 30), confidence: 0.75, trend: 'stable' };
  }
}
