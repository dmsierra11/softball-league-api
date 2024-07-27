import { Module } from '@nestjs/common';
import { RosterController } from './rosters.controller';
import { RosterService } from './rosters.service';

@Module({
  imports: [],
  controllers: [RosterController],
  providers: [RosterService],
})
export class RosterModule {}
