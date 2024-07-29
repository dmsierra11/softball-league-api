import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Stats } from './stats.types';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  findAll(@Query('type') type: string, @Query('game_id') game_id?: number) {
    return this.statsService.findAll(type, game_id);
  }

  @Post()
  createOne(@Body() stat: Stats) {
    return this.statsService.createOne(stat);
  }
}
