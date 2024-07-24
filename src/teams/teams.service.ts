import { Injectable, OnModuleDestroy, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TeamsService implements OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }

  async findAll(type?: string) {
    if (type === 'standings') {
      const query = `SELECT team.id, team.name, s.wins, s.losses, s.games_behind, s.win_percentage
        FROM teams team, standings s, tournaments tour
        WHERE team.id = s.team_id AND tour.id = s.tournament_id`;
      const result = await this.pool.query(query);

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
          ...team,
          games_played: gamesPlayed,
          win_percentage: winPercentage,
          games_behind: gamesBehind,
        };
      });

      return standings;
    }

    const query = `SELECT * FROM teams`;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `SELECT * FROM teams WHERE id = $1`;
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException('Team not found');
    }
    return result.rows[0];
  }

  async findRoster(id: number, tournament_id: number) {
    const query = `SELECT team.name as team_name, team.logo, team.short_name, p.name as player_name, p.positions, p.number, p.nationality
      FROM rosters r, players p, tournaments tour, teams team 
      WHERE r.player_id = p.id AND tour.id = r.tournament_id AND team.id = r.team_id AND r.team_id = $1 AND tour.id = $2`;
    const result = await this.pool.query(query, [id, tournament_id]);
    if (result.rows.length === 0) {
      throw new NotFoundException('Team not found');
    }
    const name = result.rows[0].team_name;
    const logo = result.rows[0].logo;
    const short_name = result.rows[0].short_name;
    const roster = result.rows;

    return {
      name,
      logo,
      short_name,
      roster,
    };
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
