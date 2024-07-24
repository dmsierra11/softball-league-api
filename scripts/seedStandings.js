const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createTables() {
  const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
  });
  const client = await pool.connect();

  const createStandingsTableQuery = `
    CREATE TABLE IF NOT EXISTS standings (
      team_id INT NOT NULL,
      tournament_id INT NOT NULL,
      wins INT,
      losses INT,
      games_behind FLOAT,
      win_percentage FLOAT,
      PRIMARY KEY (team_id, tournament_id),
      FOREIGN KEY (team_id) REFERENCES teams (id),
      FOREIGN KEY (tournament_id) REFERENCES tournaments (id)
    );
  `;

  try {
    await client.query(createStandingsTableQuery);
    console.log('Standings table created successfully');
    // Read standings data from JSON file
    const dataPath = path.join(__dirname, `../data/standings.json`);
    const data = fs.readFileSync(dataPath, 'utf8');
    const standings = JSON.parse(data);

    for (const standing of standings) {
      console.log('team_id', standing.team_id);
      console.log('tournament_id', standing.tournament_id);
      await client.query(
        `INSERT INTO standings (team_id, tournament_id, wins, losses) VALUES ($1, $2, $3, $4)`,
        [
          standing.team_id,
          standing.tournament_id,
          standing.wins,
          standing.losses,
        ],
      );
    }
  } catch (err) {
    console.error('Error creating standings table:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();
