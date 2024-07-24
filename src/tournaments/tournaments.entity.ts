import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Place } from '../places/places.entity';
import { Game } from '../games/games.entity';

@Entity()
@Unique(['name', 'year'])
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  startDate?: Date;

  @Column()
  endDate?: Date;

  @ManyToMany(() => Place, (place) => place.tournaments)
  places: Place[];

  @OneToMany(() => Game, (game) => game.tournament)
  @JoinColumn({ name: 'tournament_id' })
  games: Game[];
}
