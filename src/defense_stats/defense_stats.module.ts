import { Module } from '@nestjs/common';
import { DefenseStatsController } from './defense_stats.controller';
import { DefenseStatsService } from './defense_stats.service';

@Module({
  imports: [],
  controllers: [DefenseStatsController],
  providers: [DefenseStatsService],
})
export class DefenseStatsModule {}
