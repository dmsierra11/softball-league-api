const { createPool } = require('@vercel/postgres');
require('dotenv').config();

async function createTables() {
  const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
  });
  const client = await pool.connect();

  const createTeamsTableQuery = `
    CREATE TABLE IF NOT EXISTS ballparks (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      city VARCHAR(255),
      state VARCHAR(255),
      country VARCHAR(255)
    );
  `;

  try {
    await client.query(createTeamsTableQuery);
    console.log('Teams table created successfully');

    const ballparks = [
      {
        id: 1,
        name: 'Campo Softball',
      },
      {
        id: 2,
        name: 'Campo Beisbol',
      },
    ];

    // Insert teams into the database
    for (const ballpark of ballparks) {
      const insertTeamQuery = `
        INSERT INTO ballparks (id, name)
        VALUES ($1, $2)
      `;
      await client.query(insertTeamQuery, [ballpark.id, ballpark.name]);
    }
    console.log('Ballparks inserted successfully');
  } catch (err) {
    console.error(
      'Error creating ballparks table or inserting data:',
      err.message,
    );
  } finally {
    await client.release();
    await pool.end();
  }
}

createTables();
