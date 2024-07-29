export type BattingStats =
  | 'R'
  | 'H'
  | '2B'
  | '3B'
  | 'HR'
  | 'RBI'
  | 'SO'
  | 'BB'
  | 'SB'
  | 'SF'
  | 'TB'
  | 'AVG'
  | 'OBP'
  | 'OPS'
  | 'SLG';

export type PitchingStats =
  | 'W'
  | 'L'
  | 'IP'
  | 'SO'
  | 'BBA'
  | 'ER'
  | 'HRA'
  | 'QS'
  | 'QR'
  | 'ERA';

export type DefenseStats = 'PO' | 'E' | 'CS' | 'DP' | 'A';

export type StatsName =
  | 'Put Out'
  | 'Error'
  | 'Caught Stealing'
  | 'Double Play'
  | 'Assist'
  | 'Strike Out'
  | 'Walks Allowed'
  | 'Wins'
  | 'Losses'
  | 'Earned Runs'
  | 'Innings Pitched'
  | 'Home Runs Allowed'
  | 'Quality Start'
  | 'Quality Relief'
  | 'Runs'
  | 'Hits'
  | 'Doubles'
  | 'Triples'
  | 'Home Runs'
  | 'Runs Batted In'
  | 'Strike Outs'
  | 'Walks'
  | 'Stolen Bases'
  | 'Sacrifice Flies'
  | 'Total Bases'
  | 'Earned Run Average'
  | 'Batting Average'
  | 'Slugging Percentage'
  | 'On Base Percentage'
  | 'On Base Plus Slugging';

export type Stats = {
  id: number;
  name: BattingStats | PitchingStats | DefenseStats;
  type: 'batting' | 'pitching' | 'defense';
  long_name?: StatsName;
  points?: number;
};
