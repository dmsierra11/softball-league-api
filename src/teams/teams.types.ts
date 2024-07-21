export type Team = {
  id?: number;
  name: string;
  logoUrl?: string;
  shortName?: string;
  record?: string;
};

export type TeamScore = {
  runs: number;
  hits: number;
  errors: number;
};

export type TeamStandings = {
  wins: number;
  losses: number;
  gamesPlayed?: number;
  winPercentage?: string;
  gamesBehind?: string;
  runsScored?: number;
  runsAllowed?: number;
};
