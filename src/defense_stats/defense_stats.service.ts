import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DefenseStats } from './defense_stats.types';

@Injectable()
export class DefenseStatsService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }

  async findAll(): Promise<DefenseStats[]> {
    const result = await this.pool.query('SELECT * FROM defense_stats');
    return result.rows;
  }
}
