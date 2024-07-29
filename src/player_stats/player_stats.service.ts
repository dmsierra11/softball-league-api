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

  async createOne(playerStats: PlayerStats) {
    const query = `INSERT INTO player_stats (stat_id, player_id, team_id, game_id, value) VALUES ($1, $2, $3, $4, $5)`;
    await this.pool.query(query, [
      playerStats.stat_id,
      playerStats.player_id,
      playerStats.team_id,
      playerStats.game_id,
      playerStats.value,
    ]);
  }

  async create(playerStats: PlayerStats[]) {
    return Promise.all(
      playerStats.map((playerStat) => this.createOne(playerStat)),
    );
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

  async findByGameId(game_id: number) {
    // const query = `SELECT t.name as team_name, p.name as player_name, s.name as stat_name, ps.value as value
    //   FROM player_stats ps, teams t, players p, games g, stats s
    //   WHERE ps.game_id = $1 AND ps.team_id = t.id AND ps.player_id = p.id AND ps.stat_id = s.id AND ps.game_id = g.id`;
    const query = `SELECT t.name AS team_name, p.name AS player_name, jsonb_object_agg(s.name, ps.value) AS stats
      FROM player_stats ps
      JOIN 
          teams t ON ps.team_id = t.id
      JOIN 
          players p ON ps.player_id = p.id
      JOIN 
          stats s ON ps.stat_id = s.id
      JOIN 
          games g ON ps.game_id = g.id
      WHERE 
          ps.game_id = $1
      GROUP BY 
          t.name, p.name;
    `;
    const result = await this.pool.query(query, [game_id]);
    return result.rows;
  }
}
