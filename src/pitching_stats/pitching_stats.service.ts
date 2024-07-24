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
      SELECT p.name as player_name, t.name as team_name, p.positions, stats.*
      FROM pitching_stats stats, players p, games g, teams t
      WHERE stats.player_id = p.id AND stats.game_id = g.id AND stats.team_id = t.id`);

    const response = result.rows.map((row) => {
      return {
        name: row.player_name,
        team: row.team_name,
        position: row.positions.join(', '),
        stats: {
          'IP': row.innings_pitched,
          'H': row.hits,
          'R': row.runs,
          'ER': row.earned_runs,
          'BB': row.walks,
          'SO': row.strikeouts,
          'HR': row.home_runs,
          'ERA': row.era,
          'WHIP': row.whip,
          'SV': row.saves,
          'BSV': row.blown_saves,
        },
      };
    });

    return response;
  }
}
