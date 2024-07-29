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
    const dataPath = path.join(__dirname, `../data/stats-pitching.json`);
    const data = fs.readFileSync(dataPath, 'utf8');
    const pitchingStats = JSON.parse(data);
    for (const stats of pitchingStats) {
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
