import { unauthorized } from "@hapi/boom";
import { DBDependenciesInjector } from "../../lib/DBDependenciesInjector/definition";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../lib/JwtFunctions/types/jwt.payloads.dto";

import { User } from "../../types/user.dto";
import { AuthInfo, Auth, Sessions } from "../../types/user.security.dto";
import { SessionIdentifier } from "./types/session";

export class CommonService {
  private _database: DBDependenciesInjector;

  constructor(database: DBDependenciesInjector) {
    this._database = database;
  }

  async getUserById(id: string) {
    const user = await this._database.queryOne<User>(
      this._database.queries.user.getUserById,
      [id]
    );
    return user;
  }

  async getUserByAuthId(authId: number) {
    const user = await this._database.queryOne<User>(
      this._database.queries.user.getUserByAuthId,
      [authId]
    );
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this._database.queryOne<User>(
      this._database.queries.user.getUserByUsername,
      [username]
    );
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this._database.queryOne<AuthInfo>(
      this._database.queries.auth.info.getInfoByEmail,
      [email]
    );
    return user;
  }

  async getAuthById(id: string) {
    const auth = await this._database.queryOne<Auth>(
      this._database.queries.auth.getById,
      [id]
    );
    return auth;
  }

  async getAuthByUserId(userId: string) {
    const auth = await this._database.queryOne<Auth>(
      this._database.queries.auth.getByUserId,
      [userId]
    );
    return auth;
  }

  async getInfoByUsername(username: string) {
    const info = await this._database.queryOne<AuthInfo>(
      this._database.queries.auth.info.getInfoByUsername,
      [username]
    );
    return info;
  }

  async validateSession(
    payload: AccessTokenPayload | RefreshTokenPayload,
    type: SessionIdentifier
  ) {
    let session: Sessions;

    switch (type) {
      case "Access": {
        session = await this._database.queryOne(
          this._database.queries.auth.sessions.getSessionByAtJti,
          [payload.jti]
        );

        break;
      }

      case "Refresh": {
        session = await this._database.queryOne(
          this._database.queries.auth.sessions.getSessionByRtJti,
          [payload.jti]
        );

        break;
      }

      default:
        throw unauthorized("Invalid token");
    }
    return session;
  }
}
