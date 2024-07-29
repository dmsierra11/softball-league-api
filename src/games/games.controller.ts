import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(@Query('type') type: string, @Query('team_id') teamId: string) {
    return this.gamesService.findAll(type, teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(Number(id));
  }

  @Post()
  createGame(
    @Body('away_team_id') awayTeamId: number,
    @Body('home_team_id') homeTeamId: number,
    @Body('tournament_id') tournamentId: number,
    @Body('date') date?: string,
    @Body('time') time?: string,
  ) {
    return this.gamesService.createGame(
      Number(awayTeamId),
      Number(homeTeamId),
      Number(tournamentId),
      date,
      time,
    );
  }

  @Put(':id')
  updateGame(
    @Param('id') id: string,
    @Body('date') date?: string,
    @Body('time') time?: string,
    @Body('location_id') location_id?: number,
    @Body('away_score') away_score?: number,
    @Body('home_score') home_score?: number,
    @Body('status') status?: string,
  ) {
    return this.gamesService.updateGame(
      Number(id),
      date,
      time,
      location_id,
      away_score,
      home_score,
      status,
    );
  }

  @Delete(':id')
  deleteGame(@Param('id') id: string) {
    return this.gamesService.deleteGame(Number(id));
  }
}
