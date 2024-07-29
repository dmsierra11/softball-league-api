import { Stats } from 'src/stats/stats.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Boxscore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player_id: number;

  @Column()
  team_id: number;

  @Column()
  game_id: number;

  @Column()
  position: string;

  @Column()
  number: number;

  @Column()
  lineup_order: number;

  @Column()
  stats: Stats[];

  @Column()
  inning: number;
}
