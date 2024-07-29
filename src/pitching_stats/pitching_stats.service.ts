import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PitchingStats } from './pitching_stats.types';

@Injectable()
export class PitchingStatsService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }

  async findAll(): Promise<PitchingStats[]> {
    const result = await this.pool.query(`
      SELECT t.name AS team_name, p.name AS player_name, p.positions, jsonb_object_agg(s.name, ps.value) AS stats
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
            g.tournament_id = 1 AND s.type = 'pitching'
        GROUP BY 
            t.name, p.name, p.positions;
      `);

    const queryFields = `SELECT name FROM stats WHERE type = 'pitching'`;
    const resultFields = await this.pool.query(queryFields);
    const fields = resultFields.rows.map((row) => row.name);

    return result.rows.map((row) => {
      return {
        name: row.player_name,
        team: row.team_name,
        position: row.positions.join(', '),
        stats: row.stats,
        categories: fields,
      };
    });
  }
}
