import pg from "pg";

import { dbOptions } from "../configs";

const pool1 = new pg.Pool({
  connectionString: dbOptions.DB_CONNECTION_STRING,
});

export { pool1 as postgresBase };
