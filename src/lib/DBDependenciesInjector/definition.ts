import { IDBDependenciesInjector } from "./interfaces/injector.dto";
import { DBEngine } from "./types/engine.dto";

import DbQueries from "../../db/querys.json";

export class DBDependenciesInjector {
  private instance: IDBDependenciesInjector;
  private engine: DBEngine;
  private queries;

  constructor(dependency: IDBDependenciesInjector, engine: DBEngine) {
    this.instance = dependency;
    this.engine = engine;
    this.queries = DbQueries[this.engine];
  }

  async query<T>(query: string, params: unknown[]): Promise<T> {
    const data = await this.instance.query(query, params ?? []);

    return data as T;
  }

  public get dbQueries() {
    return this.queries;
  }
}
