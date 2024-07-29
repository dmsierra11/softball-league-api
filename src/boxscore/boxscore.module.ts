import { Module } from '@nestjs/common';
import { BoxscoreController } from './boxscore.controller';
import { BoxscoreService } from './boxscore.service';

@Module({
  imports: [],
  controllers: [BoxscoreController],
  providers: [BoxscoreService],
})
export class BoxscoreModule {}
