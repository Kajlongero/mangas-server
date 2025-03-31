import { DBEngine } from "../../lib/DBDependenciesInjector/types/engine.dto";
import { DBDependenciesInjector } from "../../lib/DBDependenciesInjector/definition";
import Queries from "../../db/querys.json";

export class AuthService {
  private database: DBDependenciesInjector;
  private engine: DBEngine;

  private queries: (typeof Queries)[DBEngine];

  constructor(database: DBDependenciesInjector, engine: DBEngine) {
    this.engine = engine;
    this.queries = database.dbQueries;
    this.database = database;
  }

  async register(data: RegisterCredentials) {
    const { username, email, password } = data;
  }
}
