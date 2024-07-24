type Stats = 'tc' | 'p' | 'a' | 'e' | 'dp' | 'cs' | 'fp';

export type BattingStats = {
  name: string;
  team: string;
  position?: string;
  stats: {
    [key in Stats]: string | number;
  };
};

export type DefenseStats = {
  name: string;
  team?: string;
  position?: string;
  stats: {
    [key in Stats]: string | number;
  };
};
