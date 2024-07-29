const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createTables() {
  const pool = createPool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();

  try {
    const dataPath = path.join(__dirname, `../data/stats-batting.json`);
    const data = fs.readFileSync(dataPath, 'utf8');
    const battingStats = JSON.parse(data);
    for (const stats of battingStats) {
      const insertStatsQuery = `INSERT INTO stats (name, type, long_name, points) VALUES ($1, $2, $3, $4)`;

      await client.query(insertStatsQuery, [
        stats.name,
        stats.type,
        stats.long_name,
        stats.points,
      ]);
    }
  } catch (error) {
    console.error(
      'Error creating stats table or inserting data:',
      error.message,
    );
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();
