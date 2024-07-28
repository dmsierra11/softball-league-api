export const createStatsQuery = `CREATE TABLE stats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(5) NOT NULL,
    type VARCHAR(10) NOT NULL,
    long_name VARCHAR(50),
    points FLOAT,
    UNIQUE (name, type)
  );`;

export const createBattingStats = `CREATE TABLE player_stats (
    stat_id INT NOT NULL,
    player_id INT NOT NULL,
    team_id INT NOT NULL,
    game_id INT NOT NULL,
    value FLOAT,
    FOREIGN KEY (stat_id) REFERENCES stats(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (game_id) REFERENCES games(id),
    UNIQUE (stat_id, player_id, team_id, game_id)
  );`;

// winner should be either 'home_team' or 'away_team'
export const createGamesQuery = `CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    tournament_id INT NOT NULL,
    location_id INT,
    date DATE,
    time TIME,
    status VARCHAR(10),
    progress INT,
    home_team_score INT,
    away_team_score INT,
    winner INT,
    UNIQUE (date, time, home_team_id, away_team_id, tournament_id),
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id),
    FOREIGN KEY (winner) REFERENCES teams(id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
    FOREIGN KEY (location_id) REFERENCES ballparks(id)
  );`;
