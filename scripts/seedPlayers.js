const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const teamId = 2;

async function createTables() {
  const pool = createPool({
    connectionString: process.env.DATABASE_URL,
  });
  const client = await pool.connect();

  const createGamesTableQuery = `
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      number VARCHAR(3),
      positions TEXT[],
      gender VARCHAR(1),
      nationality VARCHAR(255),
      verified BOOLEAN DEFAULT FALSE
    );
  `;

  try {
    await client.query(createGamesTableQuery);
    console.log('Players table created successfully');

    // Read players from roster JSON file
    const dataPath = path.join(__dirname, `../data/roster-${teamId}.json`);
    const data = fs.readFileSync(dataPath, 'utf8');
    const players = JSON.parse(data);

    // Insert players into the database
    for (const player of players) {
      const insertPlayerQuery = `
        INSERT INTO players (name, number, positions, gender, nationality)
        VALUES ($1, $2, $3, $4, $5)
      `;
      console.log(player);
      await client.query(insertPlayerQuery, [
        player.name,
        player.number,
        player.positions,
        player.gender,
        player.nationality,
      ]);
    }

    console.log('Players inserted successfully');
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
