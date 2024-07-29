import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Pool } from 'pg';
import * as moment from 'moment-timezone';

@Injectable()
export class GamesService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }

  async findAll(type?: string, team?: string) {
    const now = moment().tz('Europe/Madrid'); // Use Spain timezone
    let query = `SELECT g.id, g.date, g.time, g.status, g.name as game_name, g.home_team_score, g.away_team_score, g.winner, home_team.name AS home_team, home_team.short_name AS home_team_short_name, home_team.id AS home_team_id,
        away_team.name AS away_team, away_team.short_name AS away_team_short_name, away_team.id AS away_team_id
        FROM games g, teams home_team, teams away_team
        WHERE g.home_team_id = home_team.id AND g.away_team_id = away_team.id`;
    if (type === 'upcoming') {
      query += ` AND g.date >= '${now.format('YYYY-MM-DD')}'`;
    } else if (type === 'results') {
      query += ` AND g.status = 'final'`;
    }
    if (team) {
      query += ` AND (home_team.id = '${team}' OR away_team.id = '${team}')`;
    }
    query += ` ORDER BY id DESC`;
    const { rows } = await this.pool.query(query);
    console.log(`${rows.length} games found`);

    let gameIndex = rows.length + 1;
    return rows.map((row) => {
      gameIndex--;
      return {
        id: row.id,
        date: moment(row.date).tz('Europe/Madrid').format('DD/MM'), // Convert to Spain timezone
        time: moment(row.time, 'HH:mm:ss').format('HH:mm'),
        status: row.status,
        name: row.game_name || `Juego ${gameIndex}`,
        home_team_score: row.home_team_score,
        away_team_score: row.away_team_score,
        home_team: {
          id: row.home_team_id,
          name: row.home_team.split(' ')[0],
          // short_name: row.home_team_short_name,
          // record: `0-0`,
          score: row.home_team_score,
        },
        away_team: {
          id: row.away_team_id,
          name: row.away_team.split(' ')[0],
          // short_name: row.away_team_short_name,
          // record: `0-0`,
          score: row.away_team_score,
        },
      };
    });
  }

  async findOne(id: number) {
    const query = `SELECT g.id, g.date, g.time, g.home_team_score, g.away_team_score, g.winner, g.home_team_id, g.away_team_id, home_team.name AS home_team, away_team.name AS away_team
      FROM games g, teams home_team, teams away_team
      WHERE g.id = $1 AND g.home_team_id = home_team.id AND g.away_team_id = away_team.id`;

    const { rows } = await this.pool.query(query, [id]);
    if (rows.length === 0) {
      throw new NotFoundException('Game not found');
    }
    const game = rows[0];
    game.date = moment(game.date).tz('Europe/Madrid').format(); // Convert to Spain timezone
    const { home_team_id, away_team_id, ...rest } = game;
    return {
      ...rest,
      home_team: {
        id: home_team_id,
        name: game.home_team,
        short_name: game.home_team_short_name,
      },
      away_team: {
        id: away_team_id,
        name: game.away_team,
        short_name: game.away_team_short_name,
      },
    };
  }

  async createGame(
    away_team_id: number,
    home_team_id: number,
    tournament_id: number,
    date?: string,
    time?: string,
    location_id?: number,
  ) {
    const querySelect = `SELECT id FROM games WHERE home_team_id = $1 AND away_team_id = $2
      AND tournament_id = $3 AND date = $4 AND time = $5`;
    const { rows: rowsSelect } = await this.pool.query(querySelect, [
      home_team_id,
      away_team_id,
      tournament_id | 1,
      date,
      time,
    ]);

    if (rowsSelect.length > 0) {
      throw new ConflictException('Game already exists');
    }

    const formattedDate = moment().tz('Europe/Madrid').format();
    const query = `INSERT INTO games (date, time, tournament_id, home_team_id, away_team_id, location_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    const { rows: rowsInsert } = await this.pool.query(query, [
      formattedDate,
      time,
      tournament_id | 1,
      home_team_id,
      away_team_id,
      location_id | 1,
    ]);
    console.log(rowsInsert);

    return rowsInsert;
  }

  async updateGame(
    id: number,
    date?: string,
    time?: string,
    location_id?: number,
    away_score?: number,
    home_score?: number,
    status?: string,
  ) {
    const querySelectGame = `SELECT * FROM games WHERE id = $1`;
    const { rows: rowsSelect } = await this.pool.query(querySelectGame, [id]);
    if (rowsSelect.length === 0) {
      throw new NotFoundException('Game not found');
    }
    const { home_team_id, away_team_id } = rowsSelect[0];
    console.log(
      `Updating game ${id} for team ${home_team_id} and ${away_team_id}`,
    );

    let updateQuery = `UPDATE games SET`;
    const params: any[] = [id];
    let index = 2;
    let separator = ' ';
    if (date) {
      updateQuery += ` date = $${index}`;
      index++;
      params.push(date);
      separator = ', ';
    }

    if (time) {
      updateQuery += `${separator}time = $${index}`;
      index++;
      params.push(time);
      separator = ', ';
    }

    if (location_id) {
      updateQuery += `${separator}location_id = $${index}`;
      index++;
      params.push(location_id);
      separator = ', ';
    }

    if (home_score !== undefined) {
      updateQuery += `${separator}home_team_score = $${index}`;
      index++;
      params.push(home_score);
      separator = ', ';
    }
    if (away_score !== undefined) {
      updateQuery += `${separator}away_team_score = $${index}`;
      index++;
      params.push(away_score);
      separator = ', ';
    }

    if (status) {
      updateQuery += `${separator}status = $${index}`;
      index++;
      params.push(status);
      separator = ', ';
    }

    if (home_score !== undefined && away_score !== undefined) {
      const winner = home_score > away_score ? home_team_id : away_team_id;
      updateQuery += `${separator}winner = $${index}`;
      index++;
      params.push(winner);
    }

    updateQuery += ` WHERE id = $1`;
    const { rows: rowsUpdate } = await this.pool.query(updateQuery, params);

    return rowsUpdate;
  }

  async deleteGame(id: number) {
    console.log(`Deleting game ${id}`);
    const { rows: rowsDelete } = await this.pool.query(
      'DELETE FROM games WHERE id = $1 RETURNING id',
      [id],
    );
    return rowsDelete;
  }
}
