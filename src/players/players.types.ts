export interface PlayerStats {
  name: string;
  team: string;
  position?: string;
  stats: {
    [key: string]: string | number;
  };
}
