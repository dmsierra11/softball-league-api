import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Pool } from 'pg';
import * as moment from 'moment-timezone';
import { BattingStats } from 'src/batting_stats/batting_stats.types';
import { PitchingStats } from 'src/pitching_stats/pitching_stats.types';
import { DefenseStats } from 'src/defense_stats/defense_stats.types';

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
    let query = `SELECT g.id, g.date, g.time, home_team.name AS home_team, home_team.short_name AS home_team_short_name, home_team.id AS home_team_id,
        away_team.name AS away_team, away_team.short_name AS away_team_short_name, away_team.id AS away_team_id, bp.name
        FROM games g, teams home_team, teams away_team, ballparks bp
        WHERE g.home_team_id = home_team.id AND g.away_team_id = away_team.id AND g.location_id = bp.id`;
    if (type === 'upcoming') {
      query += ` AND g.date >= '${now.format('YYYY-MM-DD')}'`;
    } else if (type === 'results') {
      query += ` AND g.date < '${now.format('YYYY-MM-DD')}'`;
    }
    if (team) {
      query += ` AND (home_team.id = '${team}' OR away_team.id = '${team}')`;
    }
    const { rows } = await this.pool.query(query);
    console.log(`${rows.length} games found`);
    return rows.map((row) => ({
      ...row,
      date: moment(row.date).tz('Europe/Madrid').format('DD/MM'), // Convert to Spain timezone
      time: moment(row.time, 'HH:mm:ss').format('HH:mm'),
      home_team: {
        id: row.home_team_id,
        name: row.home_team,
        short_name: row.home_team_short_name,
        record: `0-0`,
      },
      away_team: {
        id: row.away_team_id,
        name: row.away_team,
        short_name: row.away_team_short_name,
        record: `0-0`,
      },
    }));
  }

  async findOne(id: number, boxscore?: boolean) {
    console.log(id);
    console.log(boxscore);
    const query = `SELECT g.id, g.date, g.time, g.home_team_id, g.away_team_id, home_team.name AS home_team, away_team.name AS away_team
      FROM games g, teams home_team, teams away_team
      WHERE g.id = $1 AND g.home_team_id = home_team.id AND g.away_team_id = away_team.id`;

    const { rows } = await this.pool.query(query, [id]);

    if (rows.length === 0) {
      throw new Error('Game not found');
    }
    const game = rows[0];
    game.date = moment(game.date).tz('Europe/Madrid').format(); // Convert to Spain timezone
    const { home_team_id, away_team_id, ...rest } = game;
    let homeBatting = [];
    let awayBatting = [];
    let homePitching = [];
    let awayPitching = [];
    let homeDefense = [];
    let awayDefense = [];
    if (boxscore) {
      const queryHomeBatting = `SELECT player.name, player.positions, stats.* FROM batting_stats as stats, players as player WHERE game_id = $1 AND team_id = ${home_team_id} AND stats.player_id = player.id`;
      const { rows: homeBattingStats } = await this.pool.query(
        queryHomeBatting,
        [id],
      );
      homeBatting = homeBattingStats;
      const queryAwayBatting = `SELECT player.name, player.positions, stats.* FROM batting_stats as stats, players as player WHERE game_id = $1 AND team_id = ${away_team_id} AND stats.player_id = player.id`;
      const { rows: awayBattingStats } = await this.pool.query(
        queryAwayBatting,
        [id],
      );
      awayBatting = awayBattingStats;

      const queryHomePitching = `SELECT player.name, player.positions, stats.* FROM pitching_stats as stats, players as player WHERE game_id = $1 AND team_id = ${home_team_id} AND stats.player_id = player.id`;
      const { rows: homePitchingStats } = await this.pool.query(
        queryHomePitching,
        [id],
      );
      homePitching = homePitchingStats;

      const queryAwayPitching = `SELECT player.name, player.positions, stats.* FROM pitching_stats as stats, players as player WHERE game_id = $1 AND team_id = ${away_team_id} AND stats.player_id = player.id`;
      const { rows: awayPitchingStats } = await this.pool.query(
        queryAwayPitching,
        [id],
      );
      awayPitching = awayPitchingStats;

      const queryHomeDefense = `SELECT player.name, player.positions, stats.* 
        FROM defense_stats as stats, players as player WHERE game_id = $1 AND team_id = ${home_team_id} AND stats.player_id = player.id`;
      const { rows: homeDefenseStats } = await this.pool.query(
        queryHomeDefense,
        [id],
      );
      homeDefense = homeDefenseStats;

      const queryAwayDefense = `SELECT player.name, player.positions, stats.* 
        FROM defense_stats as stats, players as player WHERE game_id = $1 AND team_id = ${away_team_id} AND stats.player_id = player.id`;
      const { rows: awayDefenseStats } = await this.pool.query(
        queryAwayDefense,
        [id],
      );
      awayDefense = awayDefenseStats;
    }
    return {
      ...rest,
      home_team: {
        id: home_team_id,
        name: game.home_team,
        short_name: game.home_team_short_name,
        batting_stats: boxscore ? homeBatting : undefined,
        pitching_stats: boxscore ? homePitching : undefined,
        defense_stats: boxscore ? homeDefense : undefined,
      },
      away_team: {
        id: away_team_id,
        name: game.away_team,
        short_name: game.away_team_short_name,
        batting_stats: boxscore ? awayBatting : undefined,
        pitching_stats: boxscore ? awayPitching : undefined,
        defense_stats: boxscore ? awayDefense : undefined,
      },
    };
  }

  async createGame(
    away_team_id: number,
    home_team_id: number,
    boxscore?: boolean,
  ) {
    console.log(`Creating game for teams ${home_team_id} and ${away_team_id}`);
    const querySelect = `SELECT id FROM games WHERE home_team_id = $1 AND away_team_id = $2`;
    const { rows: rowsSelect } = await this.pool.query(querySelect, [
      home_team_id,
      away_team_id,
    ]);

    if (rowsSelect.length > 0) {
      throw new ConflictException('Game already exists');
    }

    const date = moment().tz('Europe/Madrid').format();
    const query = `INSERT INTO games (date, home_team_id, away_team_id, location_id) VALUES ($1, $2, $3, $4)`;
    const { rows: rowsInsert } = await this.pool.query(query, [
      date,
      home_team_id,
      away_team_id,
      1,
    ]);

    if (boxscore) {
      console.log('Creating boxscore');
    }
    return { id: rowsInsert[0].id };
  }

  async updateGame(
    team: 'home' | 'away',
    id: number,
    date?: string,
    time?: string,
    location_id?: number,
    battingStats?: BattingStats[],
    pitchingStats?: PitchingStats[],
    defenseStats?: DefenseStats[],
  ) {
    const querySelectGame = `SELECT * FROM games WHERE id = $1`;
    const { rows: rowsSelect } = await this.pool.query(querySelectGame, [id]);
    if (rowsSelect.length === 0) {
      throw new NotFoundException('Game not found');
    }
    const { home_team_id, away_team_id } = rowsSelect[0];
    const team_id = team === 'home' ? home_team_id : away_team_id;
    console.log(`Updating game ${id} for team ${team_id}`);

    let response = {};
    if (date) {
      console.log('Updating date');
      const queryUpdate = `UPDATE games SET date = $1 WHERE id = $2 returning date`;
      const { rows: rowsDate } = await this.pool.query(queryUpdate, [date, id]);
      response = { ...response, date: rowsDate[0].date };
    }

    if (time) {
      console.log('Updating time');
      const queryUpdate = `UPDATE games SET time = $1 WHERE id = $2 returning time`;
      const { rows: rowsTime } = await this.pool.query(queryUpdate, [time, id]);
      response = { ...response, time: rowsTime[0].time };
    }

    if (location_id) {
      const queryUpdate = `UPDATE games SET location_id = $1 WHERE id = $2 returning location_id`;
      const { rows: rowsLocation } = await this.pool.query(queryUpdate, [
        location_id,
        id,
      ]);
      response = { ...response, location_id: rowsLocation[0].location_id };
    }

    if (battingStats) {

      const queryBattingStats = `SELECT * FROM batting_stats WHERE game_id = $1 AND team_id = $2`;
      const { rows: rowsBatting } = await this.pool.query(queryBattingStats, [id, team_id]);
      console.log('Querying batting stats: ', rowsBatting);

      if (rowsBatting.length > 0) {
        console.log('Update existing batting stats');
        rowsBatting.forEach(async (battingStat) => {
          console.log('Updating batting stats for player ', battingStat.player_id);
          const resultUpdate = await this.pool.query(`
            UPDATE batting_stats SET at_bats = $2, runs = $3, hits = $4, doubles = $5, triples = $6, 
            home_runs = $7, runs_batted_in = $8, walks = $9, strikeouts = $10, sac_flies = $11, stoles_bases = $12,
            caught_stealing = $13, batting_average = $14, on_base_percentage = $15, slugging_percentage = $16,
            on_base_plus_slugging = $17, plate_appearances = $18, ground_into_double_plays = $19, extra_base_hits = $20,
            total_bases = $21, intentional_walks = $22 WHERE team_id = $23, AND player_id = $24 AND game_id = $1`, [
            id,
            Number(battingStat.stats.at_bats || ''),
            Number(battingStat.stats.runs || ''),
            Number(battingStat.stats.H || ''),
            Number(battingStat.stats["2B"] || ''),
            Number(battingStat.stats["3B"] || ''),
            Number(battingStat.stats.HR || ''),
            Number(battingStat.stats.RBI || ''),
            Number(battingStat.stats.BB || ''),
            Number(battingStat.stats.SO || ''),
            Number(battingStat.stats.SF || ''),
            Number(battingStat.stats.SB || ''),
            Number(battingStat.stats.CS || ''),
            Number(battingStat.stats.AVG || ''),
            Number(battingStat.stats.OBP || ''),
            Number(battingStat.stats.SLUG || ''),
            Number(battingStat.stats.OPS || ''),
            Number(battingStat.stats.PA || ''),
            Number(battingStat.stats.GIDP || ''),
            Number(battingStat.stats.XBH || ''),
            Number(battingStat.stats.TB || ''),
            Number(battingStat.stats.IBB || ''),
          ]);
          console.log(resultUpdate);
        });
      } else {
        console.log('Insert new batting stats');
      }


      //   for (const battingStat of battingStats) {
      //     const resultPlayers = await this.pool.query(
      //       `SELECT id FROM players WHERE LOWER(name) = LOWER($1)`,
      //       [battingStat.name],
      //     );

      //     if (resultPlayers.rows.length === 0) {
      //       throw new NotFoundException('Player not found');
      //     }
      //     console.log('Player found: ', resultPlayers.rows);

      //     const resultBattingStats = await this.pool.query(
      //       `SELECT * FROM batting_stats WHERE game_id = $1 AND player_id = $2 AND team_id = $3`,
      //       [id, battingStat.id, team_id]);

      //     if (resultBattingStats.rows.length === 0) {
      //       try {
      //         console.log(`Inserting new batting stats for player ${battingStat.id} ${battingStat.name}`);
      //         console.log(`Team id: ${team_id}`);
      //         await this.pool.query(
      //           `INSERT INTO batting_stats (game_id, player_id, team_id, at_bats, runs, hits, doubles, triples, home_runs, runs_batted_in, walks,
      //           strikeouts, sac_flies, stolen_bases, caught_stealing, batting_average, on_base_percentage, slugging_percentage, on_base_plus_slugging,
      //           plate_appearances, ground_into_double_plays, extra_base_hits, total_bases, intentional_walks)
      //           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)`,
      //           [id, battingStat.id, team_id,
      //             Number(battingStat.stats?.AB || ''),
      //             Number(battingStat.stats?.R || ''),
      //             Number(battingStat.stats?.H || ''),
      //             Number(battingStat.stats ? battingStat.stats["2B"] : ''),
      //             Number(battingStat.stats ? battingStat.stats["3B"] : ''),
      //             Number(battingStat.stats?.HR || ''),
      //             Number(battingStat.stats?.RBI || ''),
      //             Number(battingStat.stats?.BB || ''),
      //             Number(battingStat.stats?.SO || ''),
      //             Number(battingStat.stats?.SF || ''),
      //             Number(battingStat.stats?.SB || ''),
      //             Number(battingStat.stats?.CS || ''),
      //             Number(battingStat.stats?.AVG || ''),
      //             Number(battingStat.stats?.OBP || ''),
      //             Number(battingStat.stats?.SLUG || ''),
      //             Number(battingStat.stats?.OPS || ''),
      //             Number(battingStat.stats?.PA || ''),
      //             Number(battingStat.stats?.GIDP || ''),
      //             Number(battingStat.stats?.XBH || ''),
      //             Number(battingStat.stats?.TB || ''),
      //             Number(battingStat.stats?.IBB || ''),
      //           ]
      //         );
      //         // return resultInsert.rows;
      //         console.log(`Created new batting stats for player ${battingStat.id} ${battingStat.name}`);
      //       } catch (error) {
      //         console.error('Error inserting ', error.message)
      //       }
      //     } else {
      //       const resultUpdate = await this.pool.query(`
      //         UPDATE batting_stats SET at_bats = $2, runs = $3, hits = $4, doubles = $5, triples = $6, 
      //         home_runs = $7, runs_batted_in = $8, walks = $9, strikeouts = $10, sac_flies = $11, stoles_bases = $12,
      //         caught_stealing = $13, batting_average = $14, on_base_percentage = $15, slugging_percentage = $16,
      //         on_base_plus_slugging = $17, plate_appearances = $18, ground_into_double_plays = $19, extra_base_hits = $20,
      //         total_bases = $21, intentional_walks = $22 WHERE team_id = $23, AND player_id = $24 AND game_id = $1`, [
      //         id,
      //         Number(battingStat.stats.AB || ''),
      //         Number(battingStat.stats.R || ''),
      //         Number(battingStat.stats.H || ''),
      //         Number(battingStat.stats["2B"] || ''),
      //         Number(battingStat.stats["3B"] || ''),
      //         Number(battingStat.stats.HR || ''),
      //         Number(battingStat.stats.RBI || ''),
      //         Number(battingStat.stats.BB || ''),
      //         Number(battingStat.stats.SO || ''),
      //         Number(battingStat.stats.SF || ''),
      //         Number(battingStat.stats.SB || ''),
      //         Number(battingStat.stats.CS || ''),
      //         Number(battingStat.stats.AVG || ''),
      //         Number(battingStat.stats.OBP || ''),
      //         Number(battingStat.stats.SLUG || ''),
      //         Number(battingStat.stats.OPS || ''),
      //         Number(battingStat.stats.PA || ''),
      //         Number(battingStat.stats.GIDP || ''),
      //         Number(battingStat.stats.XBH || ''),
      //         Number(battingStat.stats.TB || ''),
      //         Number(battingStat.stats.IBB || ''),
      //       ])
      //       console.log(`Overwrote previously uploaded stats for team ${battingStat.name}`);
      //       // return resultUpdate.rows;
      //     }
      //   }
      //   return battingStats;
    }

    // if (pitchingStats) {
    //   console.log('Updating pitching stats');
    // }

    // if (defenseStats) {
    //   console.log('Updating defense stats');
    // }

    return response;
  }
}
