import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class StatsService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }

  async findAll(type?: string, game_id?: number) {
    const query = `SELECT * FROM stats WHERE game_id = $1 AND type = $2`;
    const values = [game_id, type];
    return await this.pool.query(query, values);
  }
}
