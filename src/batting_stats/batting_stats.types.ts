type Stats =
  | 'AB'
  | 'H'
  | '2B'
  | '3B'
  | 'HR'
  | 'AVG'
  | 'R'
  | 'RBI'
  | 'BB'
  | 'SO'
  | 'OBP'
  | 'SB'
  | 'CS'

export type BattingStats = {
  name: string;
  team?: string;
  position?: string;
  stats: {
    [key in Stats]: string | number;
  };
};
