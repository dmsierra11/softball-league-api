import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Team } from '../teams/teams.entity';
import { BattingStats } from '../batting_stats/batting_stats.entity';

@Entity()
@Unique(['name'])
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Team, (team) => team.players)
  teams: Team[];

  @OneToMany(() => BattingStats, (battingStats) => battingStats.player)
  batting_stats: BattingStats[];
}
