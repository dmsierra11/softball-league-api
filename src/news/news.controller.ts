import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findLatestNews(@Query('type') type: string) {
    return this.newsService.getStats(type);
  }
}
