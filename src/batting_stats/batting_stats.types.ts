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
  | 'SF'
  | 'SLUG'
  | 'OPS'
  | 'PA'
  | 'GIDP'
  | 'XBH'
  | 'TB'
  | 'IBB'

export type BattingStats = {
  player_id?: number;
  // player_id: number;
  name: string;
  // team_id?: number;
  team?: string;
  position?: string;
  stats: {
    [key in Stats]: string | number;
  };
};
