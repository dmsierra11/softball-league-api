import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TeamsService {
  private readonly teams = [];

  constructor() {
    const dataPath = path.join(__dirname, '../../data/teams.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    this.teams = JSON.parse(data);
  }

  findAll(type?: string) {
    if (type === 'standings') {
      let leaderWins = 0;
      let leaderLosses = 0;
      const standings = this.teams.map((team, index) => {
        const teamWins = Number(team.wins);
        const teamLosses = Number(team.losses);
        const gamesPlayed = teamWins + teamLosses;
        const winPercentage = (teamWins / gamesPlayed) * 100;
        let gamesBehind = 0;
        if (index === 0) {
          gamesBehind = 0;
          leaderWins = team.wins;
          leaderLosses = team.losses;
        } else {
          gamesBehind =
            (leaderWins - team.wins + (team.losses - leaderLosses)) / 2;
        }
        return {
          ...team,
          games_played: gamesPlayed,
          win_percentage: winPercentage,
          games_behind: gamesBehind,
        };
      });
      return standings.sort((a, b) => b.win_percentage - a.win_percentage);
    }
    return this.teams;
  }

  findOne(id: number) {
    return this.teams.find((team) => team.id === id);
  }
}
