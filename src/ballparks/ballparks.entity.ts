import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Place } from '../places/places.entity';
import { Game } from '../games/games.entity';
import { Team } from '../teams/teams.entity';

@Entity()
export class Ballpark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Place, (place) => place.ballparks)
  @JoinColumn({ name: 'place_id' })
  place?: Place;

  @OneToMany(() => Game, (game) => game.ballpark)
  games?: Game[];

  @OneToMany(() => Team, (team) => team.homeField)
  homeFieldTeams?: Team[];
}
