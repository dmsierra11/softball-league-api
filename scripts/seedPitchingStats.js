const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createTables() {
  const pool = createPool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();

  const createPitchingStatsTableQuery = `
    CREATE TABLE IF NOT EXISTS pitching_stats (
        team_id INT NOT NULL,
        player_id INT NOT NULL,
        game_id INT NOT NULL,
        wins INT,
        losses INT,
        earned_runs INT,
        innings_pitched FLOAT,
        era FLOAT,
        strikeouts INT,
        hits INT,
        walks INT,
        home_runs INT,
        quality_starts INT,
        games_started INT,
        relief_appearances INT,
        complete_games INT,
        shutouts INT,
        saves INT,
        holds INT,
        whip FLOAT,
        PRIMARY KEY (team_id, player_id, game_id),
        FOREIGN KEY (team_id) REFERENCES teams(id),
        FOREIGN KEY (player_id) REFERENCES players(id),
        FOREIGN KEY (game_id) REFERENCES games(id)
    )
  `;

  try {
    await client.query(createPitchingStatsTableQuery);
    console.log('Pitching stats table created successfully');

    const team_id = 3;
    const game_id = 4;
    // Read games data from JSON file
    const dataPath = path.join(
      __dirname,
      `../data/pitching-${game_id}-${team_id}.json`,
    );
    const data = fs.readFileSync(dataPath, 'utf8');
    const pitchingStats = JSON.parse(data);
    let playersNotFound = [];
    // Insert rosters data into the database
    for (const stats of pitchingStats) {
      // get player id
      const result = await client.query(
        `SELECT id FROM players WHERE LOWER(name) = LOWER($1)`,
        [stats.name],
      );

      if (result.rows.length === 0) {
        playersNotFound.push(stats.name);
        continue;
      }
      const player_id = result.rows[0].id;
      console.log(player_id);

      const insertPitchingStatsQuery = `
        INSERT INTO pitching_stats
          (team_id, player_id, game_id, wins, losses, earned_runs, innings_pitched, era, strikeouts, hits, walks, home_runs, quality_starts,
            games_started, relief_appearances, complete_games, shutouts, saves, holds, whip
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      `;
      await client.query(insertPitchingStatsQuery, [
        team_id,
        player_id,
        game_id,
        stats.w || 0,
        stats.l || 0,
        stats.er || 0,
        stats.ip || 0,
        stats.era || 0,
        stats.so || 0,
        stats.h || 0,
        stats.bb || 0,
        stats.hr || 0,
        stats.qs || 0,
        stats.gs || 0,
        stats.ra || 0,
        stats.cg || 0,
        stats.sh || 0,
        stats.hold || 0,
        stats.sv || 0,
        stats.whip || 0,
      ]);
    }
    if (playersNotFound.length > 0) {
      console.log(`${playersNotFound.length} players not found: `);
      console.log(playersNotFound);
    } else {
      console.log('All players updated');
    }
  } catch (error) {
    console.error(
      'Error creating pitching stats table or inserting data:',
      error.message,
    );
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();
