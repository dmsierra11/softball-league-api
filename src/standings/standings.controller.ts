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
import { StandingsService } from './standings.service';
import { Standings } from './standings.types';

@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) { }

  @Get()
  async findAll(@Query('tournament_id') tournamentId): Promise<Standings[]> {
    return this.standingsService.findAll(tournamentId);
  }

  @Put()
  async update(
    @Body() standings: Standings[],
  ): Promise<Standings[]> {
    return this.standingsService.update(standings);
  }
}
