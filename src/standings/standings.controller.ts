import { Controller, Get, Param, Query } from '@nestjs/common';
import { StandingsService } from './standings.service';

@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get()
  findAll() {
    return this.standingsService.findAll();
  }

  @Get('team/:id')
  findById(@Param('id') id: string) {
    return this.standingsService.findById(id);
  }
}
