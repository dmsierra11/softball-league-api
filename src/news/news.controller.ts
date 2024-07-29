import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findLatestNews(@Query('type') type: string) {
    return this.newsService.getNews(type);
  }

  @Get(':id')
  findNewsById(@Param('id') id: string) {
    return this.newsService.getNewsContent(id);
  }
}
