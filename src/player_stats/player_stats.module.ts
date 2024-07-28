import { Module } from '@nestjs/common';
import { PlayerStatsController } from './player_stats.controller';
import { PlayerStatsService } from './player_stats.service';

@Module({
  imports: [],
  controllers: [PlayerStatsController],
  providers: [PlayerStatsService],
})
export class PlayerStatsModule {}
