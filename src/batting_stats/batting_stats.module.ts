import { Module } from '@nestjs/common';
import { BattingStatsController } from './batting_stats.controller';
import { BattingStatsService } from './batting_stats.service';

@Module({
  imports: [],
  controllers: [BattingStatsController],
  providers: [BattingStatsService],
})
export class BattingStatsModule {}
