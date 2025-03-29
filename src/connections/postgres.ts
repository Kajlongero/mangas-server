import pg from "pg";

const pool1 = new pg.Pool({
  connectionString: "",
});

export { pool1 as postgresBase };
