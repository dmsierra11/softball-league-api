import { Injectable, Query } from '@nestjs/common';
import { Pool } from 'pg';
import { Player } from './players.types';

@Injectable()
export class PlayersService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM players');
    return result.rows;
  }

  async findOne(id: number, resultParams?: string) {
    const result = await this.pool.query(
      `SELECT ${resultParams || '*'} FROM players WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  }

  async findByName(name: string, resultParams?: string) {
    const result = await this.pool.query(
      `SELECT ${resultParams || '*'} FROM players WHERE LOWER(name) = LOWER($1)`,
      [name],
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  async createPlayer(player: Player) {
    const result = await this.pool.query(
      'INSERT INTO players (name, positions, nationality, number) VALUES ($1, $2, $3, $4) RETURNING id',
      [player.name, player.positions, player.nationality, player.number],
    );
    return result.rows[0];
  }

  async updatePlayer(id: number, player: Player) {
    if (player.name) {
      await this.pool.query('UPDATE players SET name = $2 WHERE id = $1', [
        id,
        player.name,
      ]);
    }

    if (player.number) {
      await this.pool.query('UPDATE players SET number = $2 WHERE id = $1', [
        id,
        player.number,
      ]);
    }

    if (player.positions && player.positions.length > 0) {
      await this.pool.query('UPDATE players SET positions = $2 WHERE id = $1', [
        id,
        player.positions,
      ]);
    }

    return player;
  }
}
