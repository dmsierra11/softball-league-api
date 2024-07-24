const { createPool } = require('@vercel/postgres');
require('dotenv').config();

async function createTables() {
  const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
  });
  const client = await pool.connect();

  const createGamesTableQuery = `
    CREATE TABLE IF NOT EXISTS tournaments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      start_date DATE,
      end_date DATE
    );
  `;

  try {
    await client.query(createGamesTableQuery);
    console.log('Games table created successfully');

    const tournaments = [
      {
        name: 'Softball Summer Camp 2024',
        start_date: '2024-07-28',
        end_date: '2024-07-28',
      },
    ];

    // Insert games into the database
    for (const tournament of tournaments) {
      const insertGameQuery = `
        INSERT INTO tournaments (name, start_date, end_date)
        VALUES ($1, $2, $3)
      `;
      console.log(tournament);
      await client.query(insertGameQuery, [
        tournament.name,
        tournament.start_date,
        tournament.end_date,
      ]);
    }
    console.log('Tournaments inserted successfully');
  } catch (err) {
    console.error(
      'Error creating tournaments table or inserting data:',
      err.message,
    );
  } finally {
    await client.release();
    await pool.end();
  }
}

createTables();
