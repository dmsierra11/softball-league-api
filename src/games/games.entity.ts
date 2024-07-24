import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Team } from '../teams/teams.entity';
import { Tournament } from '../tournaments/tournaments.entity';
import { Ballpark } from '../ballparks/ballparks.entity';

@Entity()
@Unique(['home_team', 'away_team', 'date', 'time'])
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, (team) => team.home_games)
  @JoinColumn({ name: 'home_team_id' })
  homeTeam: Team;

  @ManyToOne(() => Team, (team) => team.away_games)
  @JoinColumn({ name: 'away_team_id' })
  awayTeam: Team;

  @ManyToOne(() => Tournament, (tournament) => tournament.games)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column({ type: 'date', nullable: true })
  date: string;

  @Column({ type: 'time', nullable: true })
  time: string;

  @ManyToOne(() => Ballpark, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  ballpark: Ballpark;
}
