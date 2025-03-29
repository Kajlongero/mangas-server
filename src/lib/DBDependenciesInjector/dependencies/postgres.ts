import type { Pool } from "pg";

import { IDBDependenciesInjector } from "../interfaces/injector.dto";

export class DBPostgres implements IDBDependenciesInjector {
  private database: Pool;

  constructor(db: Pool) {
    this.database = db;
  }

  async query<T>(query: string, params: unknown[]): Promise<T> {
    try {
      const q = await this.database.query(query, params);
      const res = q.rows as T;

      return res;
    } catch (error) {
      return [null] as T;
    }
  }
}
