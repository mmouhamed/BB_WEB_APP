import { Pool } from "pg";

// Set up your database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function ExecuteQuery(query, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(query, params);
    return res.rows; // `res.rows` contains the rows returned by the query
  } catch (err) {
    console.error("Database query error:", err);
    throw new Error("Error executing query");
  } finally {
    client.release(); // Release the client back to the pool
  }
}

process.on("SIGINT", async () => {
  await pool.end();
  console.log("Database pool closed");
  process.exit(0);
});
