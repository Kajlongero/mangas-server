import type { Pool } from "pg";

import { IDBDependenciesInjector } from "../interfaces/injector.dto";
import { DBResponsesParser } from "../../DBResponsesParser";

export class DBPostgres implements IDBDependenciesInjector {
  private database: Pool;

  constructor(db: Pool) {
    this.database = db;
  }

  async query<T>(query: string, params: unknown[]): Promise<T> {
    try {
      const q = await this.database.query(query, params);
      const res = q.rows;

      const parsed = res.map((row) => {
        return DBResponsesParser.getInstance().parse(row);
      });

      return parsed as T;
    } catch (error) {
      return [null] as T;
    }
  }
}
