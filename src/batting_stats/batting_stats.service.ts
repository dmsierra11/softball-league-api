import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { BattingStats } from './batting_stats.types';

@Injectable()
export class BattingStatsService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }

  async findAll(): Promise<BattingStats[]> {
    const result = await this.pool.query(`SELECT p.name as player_name, t.name as team_name, p.positions, stats.* FROM batting_stats stats, players p, games g, teams t
      WHERE stats.player_id = p.id AND stats.game_id = g.id AND stats.team_id = t.id`);
    const response = result.rows.map((row) => {
      return {
        name: row.player_name,
        team: row.team_name,
        position: row.positions.join(', '),
        stats: {
          'AB': row.at_bats,
          'H': row.hits,
          '2B': row.doubles,
          '3B': row.triples,
          'HR': row.home_runs,
          'AVG': row.batting_average,
          'R': row.runs,
          'RBI': row.runs_batted_in,
          'BB': row.walks,
          'SO': row.strikeouts,
          'OBP': row.on_base_percentage,
          'SB': row.stolen_bases,
          'CS': row.caught_stealing,
        },
      };
    });
    return response;
  }
}
