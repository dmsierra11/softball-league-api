import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  findAll(@Query('type') type: string, @Query('game_id') game_id?: number) {
    return this.statsService.findAll(type, game_id);
  }
}
