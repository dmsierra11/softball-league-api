import { Controller, Get, Param, Query, Post, Body, Put } from '@nestjs/common';
import { GamesService } from './games.service';
import { PlayerStats } from '../players/players.types';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(@Query('type') type: string, @Query('team_id') teamId: string) {
    return this.gamesService.findAll(type, teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('boxscore') boxscore?: boolean) {
    return this.gamesService.findOne(Number(id), boxscore);
  }

  @Post()
  createGame(
    @Body('away_team_id') awayTeamId: number,
    @Body('home_team_id') homeTeamId: number,
    @Query('boxscore') boxscore?: string,
  ) {
    return this.gamesService.createGame(
      Number(awayTeamId),
      Number(homeTeamId),
      Boolean(boxscore),
    );
  }

  @Put(':id')
  updateGame(
    @Param('id') id: string,
    @Body('date') date?: string,
    @Body('time') time?: string,
    @Body('location_id') locationId?: number,
    @Body('batting_stats') battingStats?: PlayerStats[],
    @Body('pitching_stats') pitchingStats?: PlayerStats[],
    @Body('defense_stats') defenseStats?: PlayerStats[],
  ) {
    return this.gamesService.updateGame(
      Number(id),
      date,
      time,
      locationId,
      battingStats,
      pitchingStats,
      defenseStats,
    );
  }
}
