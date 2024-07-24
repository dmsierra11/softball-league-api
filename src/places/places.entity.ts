import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Tournament } from '../tournaments/tournaments.entity';
import { Ballpark } from '../ballparks/ballparks.entity';

@Entity()
@Unique(['name', 'country', 'state', 'city', 'zip'])
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  zip: string;

  @ManyToMany(() => Tournament, (tournament) => tournament.places)
  @JoinTable({
    name: 'tournament_places',
    joinColumn: {
      name: 'place_id', // Corrected to reference the Place entity's ID
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tournament_id', // References the Tournament entity's ID
      referencedColumnName: 'id',
    },
  })
  tournaments: Tournament[];

  @OneToMany(() => Ballpark, (ballpark) => ballpark.place)
  ballparks: Ballpark[];
}
