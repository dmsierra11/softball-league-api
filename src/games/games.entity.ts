import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Team } from '../teams/teams.entity';
import { Tournament } from '../tournaments/tournaments.entity';
import { Ballpark } from '../ballparks/ballparks.entity';
import { PlayerStats } from '../player_stats/player_stats.entity';

@Entity()
@Unique(['home_team', 'away_team', 'date', 'time'])
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, (team) => team.home_games)
  @JoinColumn({ name: 'home_team_id' })
  homeTeam: Team;

  @Column({ type: 'date', nullable: true })
  date: string;

  @Column({ type: 'time', nullable: true })
  time: string;

  @Column({ type: 'integer', nullable: true })
  away_score: number;

  @Column({ type: 'integer', nullable: true })
  home_score: number;

  @Column({ type: 'integer', nullable: true })
  progress: number;

  @Column({ type: 'string', nullable: true })
  status:
    | 'not_started'
    | 'in_progress'
    | 'finished'
    | 'postponed'
    | 'cancelled'
    | 'delayed';

  @ManyToOne(() => Team, (team) => team.away_games)
  @JoinColumn({ name: 'away_team_id' })
  awayTeam: Team;

  @ManyToOne(() => Tournament, (tournament) => tournament.games)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @ManyToOne(() => Ballpark, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  ballpark: Ballpark;

  @OneToMany(() => PlayerStats, (playerStats) => playerStats.game_id)
  player_stats: PlayerStats[];
}
