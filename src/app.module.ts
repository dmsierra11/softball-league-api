import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [TeamsModule, PlayersModule, GamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
