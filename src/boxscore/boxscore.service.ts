import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Boxscore } from './boxscore.types';
import { PlayersService } from 'src/players/players.service';
import { StatsService } from 'src/stats/stats.service';
import { PlayerStatsService } from 'src/player_stats/player_stats.service';
import { GamesService } from 'src/games/games.service';

@Injectable()
export class BoxscoreService {
  private readonly pool: Pool;
  private readonly playersService: PlayersService;
  private readonly statsService: StatsService;
  private readonly playerStatsService: PlayerStatsService;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
    this.playersService = new PlayersService();
    this.statsService = new StatsService();
    this.playerStatsService = new PlayerStatsService();
  }

  async createBoxscore(
    game_id: number,
    team_id: number,
    boxscore: Boxscore,
  ): Promise<any> {
    const playersNotFound = [];
    const statsNotFound = [];
    const playerStats = await Promise.all(
      Object.keys(boxscore).map(async (playerStat) => {
        const player = await this.playersService.findByName(playerStat, 'id');
        if (!player) {
          playersNotFound.push(playerStat);
          return null;
        }

        const stats = await Promise.all(
          Object.entries(boxscore[playerStat].stats).map(
            async ([statName, statValue]) => {
              const stat = await this.statsService.findByName(statName, 'id');
              if (!stat) {
                statsNotFound.push(statName);
                return null;
              }
              return {
                game_id,
                team_id,
                stat_id: stat.id,
                player_id: player.id,
                value: statValue,
              };
            },
          ),
        );
        this.playerStatsService.create(stats);
        return stats;
      }),
    );
    if (playersNotFound.length > 0) {
      console.log(`Players not found: ${playersNotFound}`);
    }
    if (statsNotFound.length > 0) {
      console.log(`Stats not found: ${statsNotFound}`);
    }
    return {
      players_inserted: playerStats.filter((playerStat) => playerStat !== null),
      players_not_found: playersNotFound,
      stats_inserted: playerStats.filter((playerStat) => playerStat !== null),
      stats_not_found: statsNotFound,
    };
  }

  async getBoxscore(game_id: number): Promise<any> {
    return this.playerStatsService.findByGameId(game_id);
  }
}
