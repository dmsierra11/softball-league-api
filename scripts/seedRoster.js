const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createTables() {
  const pool = createPool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();

  const createRostersTableQuery = `
    CREATE TABLE IF NOT EXISTS rosters (
        team_id INT NOT NULL,
        player_id INT NOT NULL,
        tournament_id INT NOT NULL,
        number VARCHAR(3),
        PRIMARY KEY (team_id, player_id, tournament_id),
        FOREIGN KEY (team_id) REFERENCES teams(id),
        FOREIGN KEY (player_id) REFERENCES players(id),
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
    )
  `;

  try {
    await client.query(createRostersTableQuery);
    console.log('Rosters table created successfully');

    const team_id = 2;
    const tournament_id = 1;
    // Read games data from JSON file
    const dataPath = path.join(__dirname, `../data/roster-${team_id}.json`);
    const data = fs.readFileSync(dataPath, 'utf8');
    const rosters = JSON.parse(data);
    const playersNotFound = [];

    // Insert rosters data into the database
    for (const roster of rosters) {
      const result = await client.query(
        `SELECT id FROM players WHERE LOWER(name) = LOWER($1)`,
        [roster.name],
      );

      if (result.rows.length === 0) {
        playersNotFound.push(roster.name);
        continue;
      }
      const player_id = result.rows[0].id;
      const insertRosterQuery = `
        INSERT INTO rosters (team_id, player_id, tournament_id, number)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(insertRosterQuery, [
        team_id,
        player_id,
        tournament_id,
        roster.number,
      ]);
    }
    console.log(`${rosters.length} players added to roster of team ${team_id}`);
    if (playersNotFound.length > 0) {
      console.log(`Players not found: ${playersNotFound.join(', ')}`);
    }
  } catch (error) {
    console.error(
      'Error creating rosters table or inserting data:',
      error.message,
    );
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();
