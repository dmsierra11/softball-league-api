import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Team } from '../teams/teams.entity';
import { PlayerStats } from '../player_stats/player_stats.entity';

@Entity()
@Unique(['name'])
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Team, (team) => team.players)
  teams: Team[];

  @OneToMany(() => PlayerStats, (playerStats) => playerStats.stat_id)
  stats: PlayerStats[];
}
