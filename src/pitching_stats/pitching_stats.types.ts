type Stats =
  | 'IP'
  | 'H'
  | 'R'
  | 'ER'
  | 'BB'
  | 'SO'
  | 'HR'
  | 'ERA'
  | 'WHIP'
  | 'SV'
  | 'BSV'

export type PitchingStats = {
  name: string;
  team: string;
  position?: string;
  stats: {
    [key in Stats]: string | number;
  };
};
