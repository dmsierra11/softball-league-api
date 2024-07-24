const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createTables() {
  const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
  });
  const client = await pool.connect();

  const createTeamsTableQuery = `
    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      logo VARCHAR(255),
      short_name VARCHAR(50)
    );
  `;

  try {
    await client.query(createTeamsTableQuery);
    console.log('Teams table created successfully');

    // Read teams data from JSON file
    const dataPath = path.join(__dirname, '../data/teams.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    const teams = JSON.parse(data);
    console.log(teams);

    // Insert teams into the database
    for (const team of teams) {
      const insertTeamQuery = `
        INSERT INTO teams (name, logo, short_name)
        VALUES ($1, $2, $3)
      `;
      await client.query(insertTeamQuery, [
        team.name,
        team.logo,
        team.short_name,
      ]);
    }
    console.log('Teams inserted successfully');
  } catch (err) {
    console.error('Error creating teams table or inserting data:', err.message);
  } finally {
    await client.release();
    await pool.end();
  }
}

createTables();
