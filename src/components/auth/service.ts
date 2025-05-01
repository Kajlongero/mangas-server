import {
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
} from "@hapi/boom";
import bcrypt from "bcrypt";

import { DBDependenciesInjector } from "../../lib/DBDependenciesInjector/definition";
import Queries from "../../db/querys.json";

import { DBEngine } from "../../lib/DBDependenciesInjector/types/engine.dto";
import {
  JwtPayloads,
  LoginCredentials,
  RegisterCredentials,
} from "./types/auth.dto";
import { genKeys } from "../../security/rsa.gen";
import { AuthInfo, Roles, Sessions } from "../../types/user.security.dto";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../lib/JwtFunctions/types/jwt.payloads.dto";
import { RegisterUser } from "../../db/types/user.model";
import { signAccessToken, signRefreshToken } from "../../lib/JwtFunctions/sign";
import { CommonService } from "../common/service";
import {
  getExpirationTime,
  getExpirationTimeInMilis,
} from "../../utils/time.functions";
import { Roles as RoleNames } from "./enums/roles.enum";
import { UserPasswordChange } from "./types/params.dto";

export class AuthService extends CommonService {
  private database: DBDependenciesInjector;

  private queries: (typeof Queries)[DBEngine];

  constructor(database: DBDependenciesInjector) {
    super(database);

    this.queries = database.dbQueries;
    this.database = database;
  }

  async register(data: RegisterCredentials) {
    const { username, email, password, remember } = data;

    const emailExists = await this.getUserByEmail(email);
    if (emailExists) throw conflict("Email already exists");

    const usernameExists = await this.getUserByUsername(username);
    if (usernameExists) throw conflict("Username already exists");

    const hash = await bcrypt.hash(password, 10);
    const keys = await genKeys("MEDIUM");

    const user = await this.database.queryOne<RegisterUser>(
      this.database.queries.user.createUser,
      [username, email, hash, RoleNames.READER]
    );
    if (!user) throw badRequest("Failed to create user");

    const time = !remember ? getExpirationTime("LONG_180D") : null;

    const session = await this.database.queryOne<Sessions>(
      this.database.queries.auth.sessions.createSession,
      [user.authId, keys.publicKey, time]
    );
    if (!session) throw badRequest("Failed to create session");

    const { atJti, rtJti } = session;

    const atPayload: AccessTokenPayload = {
      jti: atJti,
      sub: user.authId,
      uid: user.userId,
      roles: [user.roleName],
      exp: getExpirationTimeInMilis("MEDIUM_LONG_30D"),
    };

    const rtPayload: RefreshTokenPayload = {
      jti: rtJti,
      sub: user.authId,
      uid: user.userId,
      exp: remember
        ? getExpirationTimeInMilis("LONG_180D")
        : getExpirationTimeInMilis("LONG_180D") * 200,
    };

    const at = signAccessToken(atPayload);
    const rt = signRefreshToken(rtPayload);

    return {
      accessToken: at,
      refreshToken: rt,
      sessionId: session.id,
      privateKey: keys.privateKey,
    };
  }

  async login(data: LoginCredentials) {
    const { identifier, password, remember } = data;

    let isEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(identifier);

    let info: AuthInfo;

    switch (isEmail) {
      case true:
        info = await this.getUserByEmail(identifier);
        break;
      case false:
        info = await this.getInfoByUsername(identifier);
        break;
      default:
        throw badRequest("Invalid credentials");
    }
    if (!info) throw unauthorized("Invalid credentials");

    const user = await this.getUserByAuthId(info.authId);

    if (!user) throw unauthorized("Invalid credentials");
    if (user.deletedAt) throw notFound("User has been deleted");

    if (info.loginAttempts >= 5)
      throw unauthorized("Your account has been locked, change your password");

    const isPasswordValid = await bcrypt.compare(password, info.password);
    if (!isPasswordValid) throw unauthorized("Invalid credentials");

    const keys = await genKeys("MEDIUM");
    const time = remember ? getExpirationTime("LONG_180D") : null;

    const session = await this.database.queryOne<Sessions>(
      this.database.queries.auth.sessions.createSession,
      [info.authId, keys.publicKey, time]
    );
    if (!session) throw badRequest("Failed to create session");

    const roles = await this.database.query<Roles[]>(
      this.database.queries.auth.roles.getRolesByAuthId,
      [info.authId]
    );

    const { atJti, rtJti } = session;

    const atPayload: AccessTokenPayload = {
      jti: atJti,
      uid: user.id,
      sub: info.authId.toString(),
      roles: roles.map((role) => role.name),
      exp: getExpirationTimeInMilis("MEDIUM_LONG_30D"),
    };

    const rtPayload: RefreshTokenPayload = {
      jti: rtJti,
      uid: user.id,
      sub: info.authId.toString(),
      exp: remember
        ? getExpirationTimeInMilis("LONG_180D")
        : getExpirationTimeInMilis("LONG_180D") * 200,
    };

    const at = signAccessToken(atPayload);
    const rt = signRefreshToken(rtPayload);

    return {
      accessToken: at,
      refreshToken: rt,
      sessionId: session.id,
      privateKey: keys.privateKey,
    };
  }

  async refreshToken(payload: RefreshTokenPayload) {
    const user = await this.getUserById(payload.uid);
    if (!user) throw unauthorized("Invalid session token");

    const session = await this.database.queryOne<Sessions>(
      this.database.queries.auth.sessions.getSessionByRtJti,
      [payload.jti]
    );
    if (!session) throw unauthorized("Invalid session token");

    const time = !session.expiresAt ? getExpirationTime("LONG_180D") : null;

    const updateSession = await this.database.queryOne<Sessions>(
      this.database.queries.auth.sessions.refreshSession,
      [session.id, time]
    );
    if (!updateSession) throw unauthorized("Cannot refresh the session");

    const roles = await this.database.query<Roles[]>(
      this.database.queries.auth.roles.getRolesByAuthId,
      [session.authId]
    );
    if (!roles.length) throw forbidden("You cannot perform any actions");

    const atPayload: AccessTokenPayload = {
      jti: session.atJti,
      uid: user.id,
      sub: session.authId.toString(),
      roles: roles.map((role) => role.name),
      exp: getExpirationTimeInMilis("MEDIUM_LONG_30D"),
    };

    const rtPayload: RefreshTokenPayload = {
      jti: session.rtJti,
      uid: user.id,
      sub: session.authId.toString(),
      exp: time ? getExpirationTimeInMilis("LONG_180D") : 0,
    };

    if (time) delete rtPayload.exp;

    const at = signAccessToken(atPayload);
    const rt = signRefreshToken(rtPayload);

    return {
      accessToken: at,
      refreshToken: rt,
      sessionId: session.id,
    };
  }

  async closeSession(payloads: JwtPayloads, sessionId: string) {
    const existsSession = await this.database.queryOne<Sessions>(
      this.database.queries.auth.sessions.getSessionById,
      [sessionId]
    );
    if (!existsSession) throw unauthorized();

    const { user, session } = await this.validateSessionWithUser(
      payloads,
      "Access"
    );

    const close = await this.database.queryOne(
      this.database.queries.auth.sessions.deleteSession,
      [sessionId]
    );

    return true;
  }

  async closeAllOwnOtherSessions(payloads: JwtPayloads) {
    const { user, session } = await this.validateSessionWithUser(
      payloads,
      "Access"
    );

    const closed = await this.database.queryOne(
      this.database.queries.auth.sessions.deleteOtherSessions,
      [session.id, session.authId]
    );

    return true;
  }

  async passwordChange(payloads: JwtPayloads, passwords: UserPasswordChange) {
    const { oldPassword, newPassword } = passwords;

    const { user, session } = await this.validateSessionWithUser(
      payloads,
      "Access"
    );

    const info = await this.getInfoByAuthId(session.authId);
    if (!info) throw forbidden();

    const compare = await bcrypt.compare(oldPassword, info.password);
    if (!compare) throw unauthorized("Invalid password");

    const password = await bcrypt.hash(newPassword, 10);

    const updated = await this.database.queryOne(
      this.database.queries.auth.info.updatePassword,
      [info.id, password]
    );
    if (!updated) throw badRequest();

    if (passwords.closeSessions) {
      await this.database.queryOne(
        this.database.queries.auth.sessions.deleteOtherSessions,
        [session.id, session.authId]
      );
    }

    return "Password changed successfully";
  }

  async logout(payloads: JwtPayloads) {
    const { user, session } = await this.validateSessionWithUser(
      payloads,
      "Access"
    );

    const logout = await this.database.queryOne(
      this.database.queries.auth.sessions.deleteSession,
      [session.id]
    );

    return true;
  }
}
