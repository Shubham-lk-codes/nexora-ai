import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService {
  private client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get('ELASTICSEARCH_URL') || 'http://localhost:9200',
    });
  }

  getClient(): Client {
    return this.client;
  }

  async indexDocument(index: string, id: string, document: any): Promise<void> {
    await this.client.index({ index, id, document });
  }

  async search(index: string, query: any): Promise<any> {
    return this.client.search({ index, query });
  }

  async deleteDocument(index: string, id: string): Promise<void> {
    await this.client.delete({ index, id });
  }
}
