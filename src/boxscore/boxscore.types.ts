import { Stats } from 'src/stats/stats.types';

type AtBatStats = {
  [key in keyof Stats]: number;
};

export type Boxscore = {
  [key: string]: {
    position: string;
    number: number;
    lineup_order: number;
    inning: number;
    stats: AtBatStats;
  };
};
