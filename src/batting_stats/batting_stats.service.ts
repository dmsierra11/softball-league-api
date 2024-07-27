import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const result = await this.pool.query(
      `SELECT p.name as player_name, t.name as team_name, p.positions, stats.* FROM batting_stats stats, players p, games g, teams t
      WHERE stats.player_id = p.id AND stats.game_id = g.id AND stats.team_id = t.id`,
    );
    const response = result.rows.map((row) => {
      return {
        name: row.player_name,
        team: row.team_name,
        position: row.positions.join(', '),
        stats: {
          AB: row.at_bats,
          H: row.hits,
          '2B': row['2B'],
          '3B': row['3B'],
          HR: row.home_runs,
          AVG: row.batting_average,
          R: row.runs,
          RBI: row.runs_batted_in,
          BB: row.walks,
          SO: row.strikeouts,
          OBP: row.on_base_percentage,
          SB: row.stolen_bases,
          CS: row.caught_stealing,
          SF: row.sac_flies,
          SLUG: row.slugging_percentage,
          OPS: row.on_base_plus_slugging,
          PA: row.plate_appearances,
          GIDP: row.ground_into_double_plays,
          XBH: row.extra_base_hits,
          TB: row.total_bases,
          IBB: row.intentional_walks,
        },
      };
    });
    return response;
  }

  async findByGame(
    game_id: number,
    team_id?: number,
    player_id?: number,
  ): Promise<BattingStats[]> {
    let query = `SELECT p.name as player_name, t.name as team_name, p.positions, stats.* FROM batting_stats stats, players p, games g, teams t
    WHERE stats.player_id = p.id AND stats.game_id = g.id AND stats.team_id = t.id AND game_id = $1`;
    const params = [game_id];
    let index = 2;
    if (team_id) {
      query += ` AND team_id = $${index}`;
      params.push(team_id);
      index++;
    }
    if (player_id) {
      query += ` AND player_id = $${index}`;
      params.push(player_id);
      index++;
    }

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async findByTeam(
    team_id: number,
    player_id?: number,
  ): Promise<BattingStats[]> {
    let query = `
      SELECT 
        p.name as player_name, 
        t.name as team_name, 
        p.positions,
        SUM(stats.at_bats) as at_bats,
        SUM(stats.runs) as runs,
        SUM(stats.hits) as hits,
        SUM(stats.doubles) as doubles,
        SUM(stats.triples) as triples,
        SUM(stats.home_runs) as home_runs,
        SUM(stats.runs_batted_in) as runs_batted_in,
        SUM(stats.walks) as walks,
        SUM(stats.strikeouts) as strikeouts,
        SUM(stats.sac_flies) as sac_flies,
        SUM(stats.stolen_bases) as stolen_bases,
        SUM(stats.caught_stealing) as caught_stealing,
        AVG(stats.batting_average) as batting_average,
        AVG(stats.on_base_percentage) as on_base_percentage,
        AVG(stats.slugging_percentage) as slugging_percentage,
        AVG(stats.on_base_plus_slugging) as on_base_plus_slugging,
        SUM(stats.plate_appearances) as plate_appearances,
        SUM(stats.ground_into_double_plays) as ground_into_double_plays,
        SUM(stats.extra_base_hits) as extra_base_hits,
        SUM(stats.total_bases) as total_bases,
        SUM(stats.intentional_walks) as intentional_walks
      FROM batting_stats stats
      JOIN players p ON stats.player_id = p.id
      JOIN teams t ON stats.team_id = t.id
      WHERE t.id = $1
    `;
    const params = [team_id];

    if (player_id) {
      query += ` AND p.id = $2`;
      params.push(player_id);
    }

    query += ` GROUP BY p.id, p.name, t.name, p.positions`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async findByPlayer(player_id: number): Promise<BattingStats[]> {
    const result = await this.pool.query(
      `SELECT p.name as player_name, t.name as team_name, p.positions, stats.* FROM batting_stats stats, players p, games g, teams t
      WHERE stats.player_id = p.id AND stats.game_id = g.id AND stats.team_id = t.id AND player_id = $1`,
      [player_id],
    );
    return result.rows;
  }

  async updateOne(
    game_id: number,
    team_id: number,
    batting_stats: BattingStats,
  ): Promise<BattingStats> {
    // get player id form batting_stats
    const result = await this.pool.query(
      `SELECT id FROM players WHERE LOWER(name) = LOWER($1)`,
      [batting_stats.name],
    );
    if (result.rows.length === 0) {
      new ConflictException(`Player ${batting_stats.name} not found`);
    }
    const player_id = result.rows[0].id;
    console.log('PLAYER ID: ', player_id);
    console.log('PLAYER ID TYPE: ', typeof player_id);
    console.log('TEAM ID: ', team_id);
    console.log('GAME ID: ', game_id);
    console.log('HITS: ', batting_stats.stats.H);

    const updateQuery = `UPDATE batting_stats SET at_bats = $4, hits = $5, runs = $6, doubles = $7, triples = $8, home_runs = $9, runs_batted_in = $10,
      walks = $11, strikeouts = $12, sac_flies = $13, stolen_bases = $14, caught_stealing = $15
      WHERE game_id = $1 AND team_id = $2 AND player_id = $3
        RETURNING *`;

    const resultUpdate = await this.pool.query(updateQuery, [
      game_id,
      team_id,
      player_id,
      batting_stats.stats.AB,
      batting_stats.stats.H,
      batting_stats.stats.R,
      batting_stats.stats['2B'],
      batting_stats.stats['3B'],
      batting_stats.stats.HR,
      batting_stats.stats.RBI,
      batting_stats.stats.BB,
      batting_stats.stats.SO,
      batting_stats.stats.SF,
      batting_stats.stats.SB,
      batting_stats.stats.CS,
    ]);

    if (resultUpdate.rows.length === 0) {
      throw new NotFoundException(`Batting stats not found`);
    }

    const updatedBattingStats = resultUpdate.rows[0];

    return {
      name: batting_stats.name,
      team: batting_stats.team,
      position: batting_stats.position,
      stats: updatedBattingStats,
    };
  }

  async update(
    team_id: number,
    game_id: number,
    batting_stats?: BattingStats[],
  ): Promise<BattingStats[]> {
    if (batting_stats) {
      console.log('BATTTING STATS');
      return Promise.all(
        batting_stats?.map((stat) => this.updateOne(game_id, team_id, stat)),
      );
    }
  }

  async createOne(
    game_id: number,
    team_id: number,
    player: BattingStats,
  ): Promise<BattingStats> {
    // get player id form batting_stats
    const playerIds = await this.pool.query(
      `SELECT id FROM players WHERE LOWER(name) = LOWER($1)`,
      [player.name],
    );
    if (playerIds.rows.length === 0) {
      throw new NotFoundException(`Player ${player.name} not found`);
    }
    // find team
    const teamIds = await this.pool.query(
      `SELECT id FROM teams WHERE id = $1`,
      [team_id],
    );
    if (teamIds.rows.length === 0) {
      throw new NotFoundException(`Team ${team_id} not found`);
    }
    console.log('TEAM ID:', teamIds.rows[0].id);
    const resultUpdate = await this.pool.query(
      `INSERT INTO batting_stats (team_id, game_id, player_id) VALUES ($1, $2, $3) RETURNING *`,
      [team_id, game_id, playerIds.rows[0].id],
    );
    return resultUpdate.rows[0];
  }

  async createGameBattingStats(
    team_id: number,
    game_id: number,
    players: BattingStats[],
  ): Promise<BattingStats[]> {
    return Promise.all(
      players.map((player) => this.createOne(game_id, team_id, player)),
    );
  }
}
