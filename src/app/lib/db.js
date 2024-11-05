import sql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: 1433,
  options: {
    trustedconnection: true,
    trustServerCertificate: true,
  },
};

export default async function connectToDB(query, params) {
  let pool;

  try {
    pool = await sql.connect(config);
    const request = pool.request();
    if (params) {
      Object.keys(params).forEach((key) => {
        request.input(key, sql.VarChar, params[key]);
      });
    }
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database query error:", error.message);
    throw new Error("Database query failed:" + error.message);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}
