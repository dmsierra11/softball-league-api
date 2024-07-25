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
import { BattingStatsService } from './batting_stats.service';
import { BattingStats } from './batting_stats.types';

@Controller('batting_stats')
export class BattingStatsController {
  constructor(private readonly battingStatsService: BattingStatsService) { }

  @Get()
  async findAll(): Promise<BattingStats[]> {
    return this.battingStatsService.findAll();
  }
}
