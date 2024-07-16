import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { GamesModule } from './games/games.module';
import { ConfigModule } from '@nestjs/config';
import { StatsModule } from './stats/stats.module';
import { StandingsModule } from './standings/standings.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TeamsModule,
    PlayersModule,
    GamesModule,
    StatsModule,
    StandingsModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
