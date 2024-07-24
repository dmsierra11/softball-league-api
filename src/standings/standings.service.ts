import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Standings } from './standings.types';

@Injectable()
export class StandingsService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }

  async findAll(tournamentId?: number): Promise<Standings[]> {
    const result = await this.pool
      .query(`SELECT team.name as team_name, team.id as team_id, s.wins, s.losses, s.win_percentage, s.games_behind
              FROM standings s, tournaments tour, teams team
              WHERE s.team_id = team.id AND s.tournament_id = $1 AND tour.id = $1
              ORDER BY s.win_percentage DESC, s.games_behind ASC`, [tournamentId]);
    let leaderWins = 0;
    let leaderLosses = 0;
    const standings = result.rows.map((team, index) => {
      const teamWins = Number(team.wins);
      const teamLosses = Number(team.losses);
      const gamesPlayed = teamWins + teamLosses;
      const winPercentage = (teamWins / gamesPlayed) * 100;
      let gamesBehind = 0;
      if (index === 0) {
        gamesBehind = 0;
        leaderWins = teamWins;
        leaderLosses = teamLosses;
      } else {
        gamesBehind =
          (leaderWins - teamWins + (teamLosses - leaderLosses)) / 2;
      }
      return {
        name: team.team_name,
        wins: teamWins,
        losses: teamLosses,
        win_percentage: winPercentage | 0,
        games_behind: gamesBehind,
        games_played: gamesPlayed,
        tournament_id: Number(tournamentId),
        team_id: team.team_id,
      };
    });

    return standings;
  }

  async updateOne(standings: Standings): Promise<Standings> {
    const { team_id: teamId, tournament_id: tournamentId, wins, losses, games_behind: gamesBehind } = standings;

    const queryStandings = await this.pool.query(
      `SELECT * FROM standings WHERE team_id = $1 AND tournament_id = $2`,
      [teamId, tournamentId],
    );
    const team = queryStandings.rows[0];
    // TODO: calculate games behind
    const gamesPlayed = team.wins + team.losses;
    const winPercentage = gamesPlayed === 0 ? 0 : (team.wins / gamesPlayed) * 100;
    // console.log('gamesPlayed', gamesPlayed);
    // console.log('wins', team.wins);
    // console.log('losses', team.losses);
    // console.log('winPercentage', winPercentage);

    let updateQuery = `UPDATE standings SET wins = $1, losses = $2, win_percentage = $3
        WHERE team_id = $4 AND tournament_id = $5`;

    await this.pool.query(updateQuery, [wins, losses, winPercentage, teamId, tournamentId]);

    if (gamesBehind) {
      console.log('****gamesBehind', gamesBehind);
      const updateQuery = `UPDATE standings SET games_behind = $3 WHERE team_id = $1 AND tournament_id = $2`
      console.log('updateQuery', updateQuery);
      await this.pool.query(updateQuery, [teamId, tournamentId, gamesBehind]);
    }

    return {
      ...standings,
      team_id: teamId,
      tournament_id: tournamentId,
      wins,
      losses,
      win_percentage: winPercentage | 0,
    };
  }

  async update(standings: Standings[],
  ): Promise<Standings[]> {
    const result = await Promise.all(standings.map((standing) => this.updateOne(standing)));
    const orderedStandings = result.sort((a, b) => {
      return b.win_percentage - a.win_percentage;
    });
    const leaderWins = orderedStandings[0].wins;
    const leaderLosses = orderedStandings[0].losses;
    const leaaderWinPercentage = orderedStandings[0].win_percentage;
    orderedStandings.forEach((team, index) => {
      if (orderedStandings[index].win_percentage === leaaderWinPercentage) {
        team.games_behind = 0;
        // return orderedStandings;
      } else {
        team.games_behind = (leaderWins - team.wins + (team.losses - leaderLosses)) / 2;
        // return orderedStandings;
      }
    });
    console.log('orderedStandings', orderedStandings);
    return Promise.all(orderedStandings.map((standing) => this.updateOne(standing)));
  }
}
