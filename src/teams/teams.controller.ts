import { Controller, Get, Param, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(@Query('type') type: string) {
    return await this.teamsService.findAll(type);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Query('tournament_id') tournamentId: number,
  ) {
    let team = {};
    if (tournamentId) {
      team = await this.teamsService.findRoster(id, tournamentId);
      return team;
    }
    team = await this.teamsService.findOne(Number(id));
    return team;
  }
}
