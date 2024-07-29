const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function populateTable() {
  const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
  });
  const client = await pool.connect();

  try {
    // Read games data from JSON file
    const dataPath = path.join(__dirname, '../data/games-final.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    const games = JSON.parse(data);

    let index = 1;
    // Insert games into the database
    for (const game of games) {
      const insertGameQuery = `
        INSERT INTO games (away_team_id, home_team_id, tournament_id, name, date, time, away_team_score, home_team_score, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      console.log(game);
      await client.query(insertGameQuery, [
        game.away_team_id,
        game.home_team_id,
        game.tournament_id,
        game.name || `Juego ${index}`,
        game.date,
        game.time,
        game.away_score,
        game.home_score,
        game.status,
      ]);
      index++;
    }
    console.log('Games inserted successfully');
  } catch (err) {
    console.error('Error creating games table or inserting data:', err.message);
  } finally {
    await client.release();
    await pool.end();
  }
}

populateTable();
