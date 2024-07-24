import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

// CREATE TABLE IF NOT EXISTS defense_stats (
//   team_id INT NOT NULL,
//   player_id INT NOT NULL,
//   game_id INT NOT NULL,
//   total_chances INT,
//   putouts INT,
//   assists INT,
//   errors INT,
//   double_plays INT,
//   caught_stealing_catcher INT,
//   fielding_percentage FLOAT,
//   PRIMARY KEY (team_id, player_id, game_id),
//   FOREIGN KEY (team_id) REFERENCES teams(id),
//   FOREIGN KEY (player_id) REFERENCES players(id),
//   FOREIGN KEY (game_id) REFERENCES games(id)
// )

@Entity()
@Unique(['team_id', 'player_id', 'game_id'])
export class DefenseStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  team_id: number;

  @Column()
  player_id: number;

  @Column()
  game_id: number;

  @Column()
  total_chances: number;

  @Column()
  putouts: number;

  @Column()
  assists: number;

  @Column()
  errors: number;

  @Column()
  double_plays: number;

  @Column()
  caught_stealing_catcher: number;

  @Column()
  fielding_percentage: number;
}
