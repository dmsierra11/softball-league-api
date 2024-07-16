import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getStats(@Query('type') type: string) {
    if (!type) {
      throw new BadRequestException('Type query parameter is required');
    }
    return this.statsService.getStats(type);
  }
}
