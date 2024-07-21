import { Controller, Get, Param, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(@Query('type') type: string) {
    return this.teamsService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('roster') roster: boolean) {
    let teamRoster = [];
    if (roster) {
      teamRoster = this.teamsService.findRoster(Number(id));
    }
    const team = this.teamsService.findOne(Number(id));
    return { ...team, players: teamRoster };
  }
}
