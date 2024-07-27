import { Controller, Get, Param, Query, Post, Body, Put } from '@nestjs/common';
import { GamesService } from './games.service';
import { BoxScore } from './games.types'
import { BattingStats } from 'src/batting_stats/batting_stats.types';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

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
    @Body('location_id') location_id?: number,
    @Body('home_team') home_team?: BoxScore,
    @Body('away_team') away_team?: BoxScore,
  ) {
    console.log('UPDATE GAME: ');
    if (home_team) {
      console.log('HOME TEAM:', home_team);
      const { batting_stats, pitching_stats, defense_stats } = home_team;
      return this.gamesService.updateGame(
        'home',
        Number(id),
        date,
        time,
        location_id,
        batting_stats,
        pitching_stats,
        defense_stats
      );
      // return home_team;
    }

    if (away_team) {
      console.log('AWAY TEAM:', away_team);
      const { batting_stats, pitching_stats, defense_stats } = away_team;
      return this.gamesService.updateGame(
        'away',
        Number(id),
        date,
        time,
        location_id,
        batting_stats,
        pitching_stats,
        defense_stats
      );
      // return away_team;
    }
  }
}
