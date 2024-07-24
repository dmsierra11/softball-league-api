import { Module } from '@nestjs/common';
import { PitchingStatsController } from './pitching_stats.controller';
import { PitchingStatsService } from './pitching_stats.service';

@Module({
  imports: [],
  controllers: [PitchingStatsController],
  providers: [PitchingStatsService],
})
export class PitchingStatsModule {}
