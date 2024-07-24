export type Standings = {
  team_id: number;
  tournament_id: number;
  name: string;
  wins?: number;
  losses?: number;
  games_behind?: number;
  win_percentage?: number;
};
