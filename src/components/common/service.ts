import { forbidden, unauthorized } from "@hapi/boom";
import { DBDependenciesInjector } from "../../lib/DBDependenciesInjector/definition";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../lib/JwtFunctions/types/jwt.payloads.dto";

import { User } from "../../types/user.dto";
import { AuthInfo, Auth, Sessions } from "../../types/user.security.dto";
import { SessionIdentifier } from "./types/session";
import { JwtPayloads } from "../auth/types/auth.dto";

export class CommonService {
  private _database: DBDependenciesInjector;

  constructor(database: DBDependenciesInjector) {
    this._database = database;
  }

  protected async getUserById(id: string) {
    const user = await this._database.queryOne<User>(
      this._database.queries.user.getUserById,
      [id]
    );
    return user;
  }

  protected async getUserByAuthId(authId: number) {
    const user = await this._database.queryOne<User>(
      this._database.queries.user.getUserByAuthId,
      [authId]
    );
    return user;
  }

  protected async getUserByUsername(username: string) {
    const user = await this._database.queryOne<User>(
      this._database.queries.user.getUserByUsername,
      [username]
    );
    return user;
  }

  protected async getUserByEmail(email: string) {
    const user = await this._database.queryOne<AuthInfo>(
      this._database.queries.auth.info.getInfoByEmail,
      [email]
    );
    return user;
  }

  protected async getAuthById(id: string) {
    const auth = await this._database.queryOne<Auth>(
      this._database.queries.auth.getById,
      [id]
    );
    return auth;
  }

  protected async getAuthByUserId(userId: string) {
    const auth = await this._database.queryOne<Auth>(
      this._database.queries.auth.getByUserId,
      [userId]
    );
    return auth;
  }

  protected async getInfoByUsername(username: string) {
    const info = await this._database.queryOne<AuthInfo>(
      this._database.queries.auth.info.getInfoByUsername,
      [username]
    );
    return info;
  }

  protected async getInfoByAuthId(authId: number) {
    const info = await this._database.queryOne<AuthInfo>(
      this._database.queries.auth.info.getInfoByAuthId,
      [authId]
    );
    return info;
  }

  private async validateSession(
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

  private validateTokenWithSessionEquality(
    payloads: JwtPayloads,
    session: Sessions
  ) {
    const { accessTokenPayload, refreshTokenPayload } = payloads;

    if (accessTokenPayload.uid !== refreshTokenPayload.uid) throw forbidden();

    if (accessTokenPayload.sub !== refreshTokenPayload.sub) throw forbidden();

    if (session.atJti !== accessTokenPayload.jti) throw unauthorized();

    if (session.authId.toString() !== accessTokenPayload.sub?.toString())
      throw unauthorized();

    if (session.rtJti !== refreshTokenPayload.jti) throw unauthorized();

    if (session.authId.toString() !== refreshTokenPayload.sub?.toString())
      throw unauthorized();

    return true;
  }

  protected async validateSessionWithUser(
    payloads: JwtPayloads,
    type: "Access" | "Refresh"
  ) {
    const { accessTokenPayload, refreshTokenPayload } = payloads;

    const session = await this.validateSession(accessTokenPayload, type);
    if (!session) throw unauthorized();

    const user = await this.getUserById(accessTokenPayload.uid);
    if (!user) throw unauthorized();

    this.validateTokenWithSessionEquality(payloads, session);

    return {
      session,
      user,
    };
  }
}
