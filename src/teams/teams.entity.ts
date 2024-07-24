import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Game } from '../games/games.entity';
import { Ballpark } from '../ballparks/ballparks.entity';
import { Player } from '../players/players.entity';

@Entity('teams')
@Unique(['name'])
@Unique(['short_name'])
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  short_name?: string;

  @OneToMany(() => Game, (game) => game.homeTeam)
  home_games?: Game[];

  @OneToMany(() => Game, (game) => game.awayTeam)
  away_games?: Game[];

  @ManyToOne(() => Ballpark, (ballpark) => ballpark.homeFieldTeams)
  @JoinColumn({ name: 'home_field_id' })
  homeField?: Ballpark;

  // TODO: Create rosters entity that will intersect team_id, player_id, and tournament_id
  @ManyToMany(() => Player, (player) => player.teams)
  @JoinTable({
    name: 'team_players',
    joinColumn: { name: 'team_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'player_id', referencedColumnName: 'id' },
  })
  players?: Player[];
}
