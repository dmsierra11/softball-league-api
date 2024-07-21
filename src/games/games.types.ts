import { Team, TeamScore } from '../teams/teams.types';
import { PlayerStats } from '../players/players.types';

export type BoxScore = Team & {
  lineScore: TeamScore[];
  totalRuns?: number;
  totalHits?: number;
  totalErrors?: number;
  battingStats?: PlayerStats[];
  pitchingStats?: PlayerStats[];
  defenseStats?: PlayerStats[];
};

export type Game = {
  id?: number;
  date?: string;
  time?: string;
  location?: string;
  homeTeam: BoxScore;
  awayTeam: BoxScore;
};
