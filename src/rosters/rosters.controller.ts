import { Controller, Get, Query, Post, Body, Put } from '@nestjs/common';
import { RosterService } from './rosters.service';
import { Roster } from './rosters.types';
import { Player } from '../players/players.types';

@Controller('rosters')
export class RosterController {
  constructor(private readonly rosterService: RosterService) {}

  @Get()
  async getRosters(
    @Query('team_id') team_id: number,
    @Query('tournament_id') tournament_id: number,
  ): Promise<Roster[]> {
    return this.rosterService.getRosters(team_id, tournament_id);
  }

  @Post()
  async createRoster(
    @Body('team_id') team_id: number,
    @Body('tournament_id') tournament_id: number,
    @Body('players') players: Player[],
  ): Promise<Player[]> {
    return this.rosterService.createRoster(team_id, tournament_id, players);
  }

  @Put()
  async updateRoster(
    @Body('team_id') team_id: number,
    @Body('tournament_id') tournament_id: number,
    @Body('players') players: Player[],
  ): Promise<Player[]> {
    return this.rosterService.updateRoster(team_id, tournament_id, players);
  }
}
