import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'AI product recommendations' })
  async getRecommendations(@CurrentUser('sub') userId: string) {
    return this.aiService.getRecommendations(userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Smart search with AI' })
  async smartSearch(@Query('q') query: string, @CurrentUser('sub') userId?: string) {
    return this.aiService.smartSearch(query, userId);
  }

  @Post('sentiment')
  @ApiOperation({ summary: 'Analyze sentiment' })
  async sentiment(@Body('text') text: string) {
    return this.aiService.sentimentAnalysis(text);
  }

  @Get('forecast/:productId')
  @ApiOperation({ summary: 'Demand forecasting' })
  async forecast(@Param('productId') productId: string) {
    return this.aiService.demandForecast(productId);
  }
}
