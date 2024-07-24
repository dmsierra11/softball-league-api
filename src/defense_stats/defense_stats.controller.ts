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
import { DefenseStatsService } from './defense_stats.service';
import { DefenseStats } from './defense_stats.types';

@Controller('defense_stats')
export class DefenseStatsController {
  constructor(private readonly defenseStatsService: DefenseStatsService) {}

  @Get()
  async findAll(): Promise<DefenseStats[]> {
    return this.defenseStatsService.findAll();
  }
}
