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
import { PitchingStatsService } from './pitching_stats.service';
import { PitchingStats } from './pitching_stats.types';

@Controller('pitching_stats')
export class PitchingStatsController {
  constructor(private readonly pitchingStatsService: PitchingStatsService) {}

  @Get()
  async findAll(): Promise<PitchingStats[]> {
    return this.pitchingStatsService.findAll();
  }
}
