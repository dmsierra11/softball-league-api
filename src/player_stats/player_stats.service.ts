import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PlayerStats } from './player_stats.types';

@Injectable()
export class PlayerStatsService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }

  async create(playerStats: PlayerStats) {
    const query = `INSERT INTO player_stats (stat_id, player_id, team_id, game_id, value) VALUES ($1, $2, $3, $4, $5)`;
    await this.pool.query(query, [
      playerStats.stat_id,
      playerStats.player_id,
      playerStats.team_id,
      playerStats.game_id,
      playerStats.value,
    ]);
  }

  async update(id: number, playerStats: PlayerStats) {
    const query = `UPDATE player_stats SET stat_id = $1, player_id = $2, team_id = $3, game_id = $4, value = $5 WHERE id = $6`;
    await this.pool.query(query, [
      playerStats.stat_id,
      playerStats.player_id,
      playerStats.team_id,
      playerStats.game_id,
      playerStats.value,
      id,
    ]);
  }
}
