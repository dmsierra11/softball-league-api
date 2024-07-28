import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { Stats } from '../stats/stats.entity';
import { Player } from '../players/players.entity';
import { Team } from '../teams/teams.entity';
import { Game } from '../games/games.entity';

// export const createBattingStats = `CREATE TABLE player_stats (
//   stat_id INT NOT NULL,
//   player_id INT NOT NULL,
//   team_id INT NOT NULL,
//   game_id INT NOT NULL,
//   value FLOAT,
//   FOREIGN KEY (stat_id) REFERENCES stats(id),
//   FOREIGN KEY (player_id) REFERENCES players(id),
//   FOREIGN KEY (team_id) REFERENCES teams(id),
//   FOREIGN KEY (game_id) REFERENCES games(id),
//   UNIQUE (stat_id, player_id, team_id, game_id)
// );`;

@Unique(['stat_id', 'player_id', 'team_id', 'game_id'])
@Entity()
export class PlayerStats {
  @ManyToOne(() => Stats, (stat) => stat.players)
  stat_id: number;

  @ManyToOne(() => Player, (player) => player.stats)
  player_id: number;

  @ManyToOne(() => Team, (team) => team.player_stats)
  team_id: number;

  @ManyToOne(() => Game, (game) => game.player_stats)
  game_id: number;

  @Column()
  value: number;
}
