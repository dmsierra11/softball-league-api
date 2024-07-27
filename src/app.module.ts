import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { GamesModule } from './games/games.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { UploadModule } from './upload/upload.module';
import { BattingStatsModule } from './batting_stats/batting_stats.module';
import { DefenseStatsModule } from './defense_stats/defense_stats.module';
import { PitchingStatsModule } from './pitching_stats/pitching_stats.module';
import { StandingsModule } from './standings/standings.module';
import { RosterModule } from './rosters/rosters.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TeamsModule,
    PlayersModule,
    GamesModule,
    NewsModule,
    UploadModule,
    BattingStatsModule,
    DefenseStatsModule,
    PitchingStatsModule,
    StandingsModule,
    RosterModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
