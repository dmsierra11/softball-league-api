import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BattingStats, PitchingStats, DefenseStats } from './stats.types';
import { PlayerStats } from '../player_stats/player_stats.entity';

@Entity()
export class Stats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5 })
  name: BattingStats | PitchingStats | DefenseStats;

  @Column({ type: 'varchar', length: 10 })
  type: 'batting' | 'pitching' | 'defense';

  @Column({ type: 'varchar', length: 50 })
  long_name?: string;

  @Column({ type: 'float', nullable: true })
  points?: number;

  @OneToMany(() => PlayerStats, (player_stats) => player_stats.stat_id)
  players: PlayerStats[];
}
