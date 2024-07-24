const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createTables() {
  const pool = createPool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();

  const createBattingStatsTableQuery = `
    CREATE TABLE IF NOT EXISTS defense_stats (
        team_id INT NOT NULL,
        player_id INT NOT NULL,
        game_id INT NOT NULL,
        total_chances INT,
        putouts INT,
        assists INT,
        errors INT,
        double_plays INT,
        caught_stealing_catcher INT,
        fielding_percentage FLOAT,
        PRIMARY KEY (team_id, player_id, game_id),
        FOREIGN KEY (team_id) REFERENCES teams(id),
        FOREIGN KEY (player_id) REFERENCES players(id),
        FOREIGN KEY (game_id) REFERENCES games(id)
    )
  `;

  try {
    await client.query(createBattingStatsTableQuery);
    console.log('Defense stats table created successfully');

    const team_id = 3;
    const game_id = 4;
    // Read games data from JSON file
    const dataPath = path.join(
      __dirname,
      `../data/defense-${game_id}-${team_id}.json`,
    );
    const data = fs.readFileSync(dataPath, 'utf8');
    const battingStats = JSON.parse(data);
    let playersNotFound = [];
    // Insert rosters data into the database
    for (const stats of battingStats) {
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

      const insertDefenseStatsQuery = `
        INSERT INTO defense_stats
          (team_id, player_id, game_id, total_chances, putouts, assists, errors, double_plays, caught_stealing_catcher, fielding_percentage)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      await client.query(insertDefenseStatsQuery, [
        team_id,
        player_id,
        game_id,
        stats.tc || 0,
        stats.po || 0,
        stats.a || 0,
        stats.e || 0,
        stats.dp || 0,
        stats.cs || 0,
        stats['fielding%'] || 0,
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
      'Error creating defense stats table or inserting data:',
      error.message,
    );
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();
