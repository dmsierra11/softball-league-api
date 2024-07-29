import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { BoxscoreService } from './boxscore.service';
import { Boxscore } from './boxscore.types';

@Controller('boxscore')
export class BoxscoreController {
  constructor(private readonly boxscoreService: BoxscoreService) {}

  @Post()
  async createBoxscore(
    @Query('game_id') game_id: number,
    @Query('team_id') team_id: number,
    @Body() boxscore: Boxscore,
  ): Promise<Boxscore> {
    return this.boxscoreService.createBoxscore(
      Number(game_id),
      Number(team_id),
      boxscore,
    );
  }

  @Get()
  async getBoxscore(@Query('game_id') game_id: number): Promise<Boxscore> {
    return this.boxscoreService.getBoxscore(game_id);
  }
}
