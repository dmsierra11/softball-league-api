import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  imports: [],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule { }
