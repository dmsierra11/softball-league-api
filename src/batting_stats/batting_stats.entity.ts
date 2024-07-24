import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from '../teams/teams.entity';
import { Player } from '../players/players.entity';
import { Game } from '../games/games.entity';

@Entity('batting_stats')
export class BattingStats {
  @PrimaryColumn()
  team_id: number;

  @PrimaryColumn()
  player_id: number;

  @PrimaryColumn()
  game_id: number;

  @Column({ type: 'int', nullable: true })
  games_played: number;

  @Column({ type: 'int', nullable: true })
  at_bats: number;

  @Column({ type: 'int', nullable: true })
  runs: number;

  @Column({ type: 'int', nullable: true })
  hits: number;

  @Column({ type: 'int', nullable: true })
  doubles: number;

  @Column({ type: 'int', nullable: true })
  triples: number;

  @Column({ type: 'int', nullable: true })
  home_runs: number;

  @Column({ type: 'int', nullable: true })
  runs_batted_in: number;

  @Column({ type: 'int', nullable: true })
  walks: number;

  @Column({ type: 'int', nullable: true })
  strikeouts: number;

  @Column({ type: 'int', nullable: true })
  sac_flies: number;

  @Column({ type: 'int', nullable: true })
  stolen_bases: number;

  @Column({ type: 'int', nullable: true })
  caught_stealing: number;

  @Column({ type: 'float', nullable: true })
  batting_average: number;

  @Column({ type: 'float', nullable: true })
  on_base_percentage: number;

  @Column({ type: 'float', nullable: true })
  slugging_percentage: number;

  @Column({ type: 'float', nullable: true })
  on_base_plus_slugging: number;

  @Column({ type: 'int', nullable: true })
  plate_appearances: number;

  @Column({ type: 'int', nullable: true })
  ground_into_double_plays: number;

  @Column({ type: 'int', nullable: true })
  extra_base_hits: number;

  @Column({ type: 'int', nullable: true })
  total_bases: number;

  @Column({ type: 'int', nullable: true })
  intentional_walks: number;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
