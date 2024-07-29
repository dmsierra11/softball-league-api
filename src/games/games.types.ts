import { TeamScore } from '../teams/teams.types';
import { BattingStats } from 'src/batting_stats/batting_stats.types';
import { PitchingStats } from 'src/pitching_stats/pitching_stats.types';
import { DefenseStats } from 'src/defense_stats/defense_stats.types';

export type BoxScore = {
  team_id?: number;
  linescore?: TeamScore[];
  total_runs?: number;
  total_hits?: number;
  total_errors?: number;
  batting_stats?: BattingStats[];
  pitching_stats?: PitchingStats[];
  defense_stats?: DefenseStats[];
};

export type GameStatus = 'not_started' | 'in_progress' | 'final' | 'postponed' | 'delayed' | 'cancelled';

export type Game = {
  id?: number;
  date?: string;
  time?: string;
  location?: string;
  home_team: BoxScore;
  away_team: BoxScore;
  status?: GameStatus;
  progress?: number | string;
};
