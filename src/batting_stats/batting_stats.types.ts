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
  | 'IBB';

export type BattingStats = {
  id?: number;
  name: string;
  // team_id?: number;
  team?: string;
  position?: string;
  stats?: {
    [key in Stats]: string | number;
  };
};

// export type BattingStats = {
//   // "name": "Rita Di Bella",
//   // "positions": [
//   //   "IF"
//   // ],
//   // "team_id": 2,
//   // "player_id": 17,
//   // "game_id": 4,
//   games_played?: number;
//   at_bats?: number;
//   runs?: number;
//   hits?: number;
//   doubles?: 2,
//   triples?: number;
//   home_runs?: number;
//   runs_batted_in?: number;
//   walks?: number;
//   strikeouts?: number;
//   sac_flies?: number;
//   stolen_bases?: number;
//   caught_stealing?: number;
//   batting_average?: number;
//   on_base_percentage: number;
//   slugging_percentage: number;
//   on_base_plus_slugging: number;
//   plate_appearances: number;
//   ground_into_double_plays: number;
//   extra_base_hits: number;
//   total_bases: 0,
//   intentional_walks: 0
// }
