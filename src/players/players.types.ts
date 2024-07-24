export interface PlayerStats {
  name: string;
  team_id?: string;
  position?: string;
  stats: {
    [key: string]: string | number;
  };
}

export type StatsType = {
  [key: string]: string | number;
};
