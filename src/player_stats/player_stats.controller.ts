import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { PlayerStatsService } from './player_stats.service';
import { PlayerStats } from './player_stats.types';

@Controller('player_stats')
export class PlayerStatsController {
  constructor(private readonly playerStatsService: PlayerStatsService) {}

  @Post()
  create(@Body() createPlayerStats: PlayerStats[]) {
    return this.playerStatsService.create(createPlayerStats);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updatePlayerStats: PlayerStats) {
    return this.playerStatsService.update(id, updatePlayerStats);
  }
}
