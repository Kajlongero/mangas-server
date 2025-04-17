import { IDBDependenciesInjector } from "./interfaces/injector.dto";
import { DBEngine } from "./types/engine.dto";

import DbQueries from "../../db/querys.json";

export class DBDependenciesInjector {
  public readonly queries;
  private instance: IDBDependenciesInjector;
  private engine: DBEngine;

  constructor(dependency: IDBDependenciesInjector, engine: DBEngine) {
    this.instance = dependency;
    this.engine = engine;
    this.queries = DbQueries[this.engine];
  }

  async query<T>(query: string, params: unknown[]): Promise<T> {
    const data = await this.instance.query(query, params ?? []);

    return data as T;
  }

  async queryOne<T>(query: string, params: unknown[]): Promise<T> {
    try {
      const data = await this.query<T[]>(query, params ?? []);

      return data.length ? (data[0] as T) : (null as T);
    } catch (error) {
      console.log(error);

      return null as T;
    }
  }

  public get dbQueries() {
    return this.queries;
  }
}
