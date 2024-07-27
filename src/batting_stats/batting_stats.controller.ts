import { Controller, Get, Body, Put, Post, Query } from '@nestjs/common';
import { BattingStatsService } from './batting_stats.service';
import { BattingStats } from './batting_stats.types';

@Controller('batting_stats')
export class BattingStatsController {
  constructor(private readonly battingStatsService: BattingStatsService) {}

  @Get()
  async findAll(
    @Query('game_id') game_id: number,
    @Query('team_id') team_id?: number,
    @Query('player_id') player_id?: number,
  ): Promise<BattingStats[]> {
    if (game_id) {
      return this.battingStatsService.findByGame(game_id, team_id, player_id);
    }

    if (team_id) {
      return this.battingStatsService.findByTeam(team_id);
    }

    if (player_id) {
      return this.battingStatsService.findByPlayer(player_id);
    }

    return this.battingStatsService.findAll();
  }

  @Put()
  async updateBattingStats(
    @Body('team_id') team_id: number,
    @Body('game_id') game_id: number,
    @Body('batting_stats') batting_stats?: BattingStats[],
  ): Promise<BattingStats[]> {
    return this.battingStatsService.update(team_id, game_id, batting_stats);
  }

  @Post()
  async createBattingStats(
    @Body('team_id') team_id: number,
    @Body('game_id') game_id: number,
    @Body('players') players: BattingStats[],
  ): Promise<BattingStats[]> {
    return this.battingStatsService.createGameBattingStats(
      team_id,
      game_id,
      players,
    );
  }
}
