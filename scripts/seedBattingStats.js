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
    const team_id = 3;
    const game_id = 4;
    // Read games data from JSON file
    const dataPath = path.join(
      __dirname,
      `../data/batting-${game_id}-${team_id}.json`,
    );
    const data = fs.readFileSync(dataPath, 'utf8');
    const battingStats = JSON.parse(data);
    let playersNotFound = [];
    // Insert rosters data into the database
    for (const stats of battingStats) {
      // get player id
      const result = await client.query(
        `SELECT id FROM players WHERE LOWER(name) = LOWER($1)`,
        [stats.name],
      );

      if (result.rows.length === 0) {
        playersNotFound.push(stats.name);
        continue;
      }
      const player_id = result.rows[0].id;
      console.log(player_id);

      const insertBattingStatsQuery = `
        INSERT INTO batting_stats
          (team_id, player_id, game_id, games_played, at_bats, runs, hits, doubles, triples, home_runs, runs_batted_in, walks, strikeouts, sac_flies, stolen_bases,
            caught_stealing, batting_average, on_base_percentage, slugging_percentage, on_base_plus_slugging, plate_appearances, ground_into_double_plays, extra_base_hits,
            total_bases, intentional_walks)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
      `;
      await client.query(insertBattingStatsQuery, [
        team_id,
        player_id,
        game_id,
        stats.g,
        stats.ab,
        stats.r,
        stats.h,
        stats['2b'],
        stats['3b'],
        stats.hr,
        stats.rbi,
        stats.bb,
        stats.so,
        stats.sf,
        stats.sb,
        stats.cs,
        stats.avg,
        stats.obp,
        stats.slg,
        stats.ops,
        stats.pa,
        stats.gidp,
        stats.xbh,
        stats.tb,
        stats.ibb,
      ]);
    }
    if (playersNotFound.length > 0) {
      console.log(`${playersNotFound.length} players not found: `);
      console.log(playersNotFound);
    } else {
      console.log('All players updated');
    }
  } catch (error) {
    console.error(
      'Error creating batting stats table or inserting data:',
      error.message,
    );
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();
