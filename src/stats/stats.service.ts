import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Stats } from './stats.types';

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

  async findByName(name: string, resultParams?: string) {
    const query = `SELECT ${resultParams || '*'} FROM stats WHERE LOWER(name) = LOWER($1)`;
    const result = await this.pool.query(query, [name]);
    return result.rows[0];
  }

  async createOne(stat: Stats) {
    const query = `INSERT INTO stats (name, type) VALUES ($1, $2)`;
    const values = [stat.name, stat.type];
    return await this.pool.query(query, values);
  }
}
