const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createTables() {
  const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
  });
  const client = await pool.connect();

  const createGamesTableQuery = `
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      home_team_id INT NOT NULL,
      away_team_id INT NOT NULL,
      tournament_id INT NOT NULL,
      date DATE,
      time TIME,
      location_id INT,
      FOREIGN KEY (home_team_id) REFERENCES teams(id),
      FOREIGN KEY (away_team_id) REFERENCES teams(id),
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY (location_id) REFERENCES ballparks(id)
    );
  `;

  try {
    await client.query(createGamesTableQuery);
    console.log('Games table created successfully');

    // Read games data from JSON file
    const dataPath = path.join(__dirname, '../data/games.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    const games = JSON.parse(data);

    // Insert games into the database
    for (const game of games) {
      const insertGameQuery = `
        INSERT INTO games (away_team_id, home_team_id, tournament_id, date, time, location_id)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      console.log(game);
      await client.query(insertGameQuery, [
        game.away_team_id,
        game.home_team_id,
        game.tournament_id,
        game.date,
        game.time,
        game.location_id,
      ]);
    }
    console.log('Games inserted successfully');
  } catch (err) {
    console.error('Error creating games table or inserting data:', err.message);
  } finally {
    await client.release();
    await pool.end();
  }
}

createTables();
