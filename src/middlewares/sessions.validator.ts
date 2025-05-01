import { unauthorized } from "@hapi/boom";
import { NextFunction, Request, Response } from "express";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../lib/JwtFunctions/types/jwt.payloads.dto";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../lib/JwtFunctions/verify";
import { DBPostgresInstance } from "../lib/DBDependenciesInjector";
import { Session } from "inspector/promises";

export const validateAccessSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw unauthorized();

    const raw = token.split(" ")[1];
    if (!raw) throw unauthorized();

    const payload = verifyAccessToken(raw) as AccessTokenPayload;
    if (!payload) throw unauthorized();

    const session = await DBPostgresInstance.queryOne<Session>(
      DBPostgresInstance.queries.auth.sessions.getSessionByAtJti,
      [payload.jti]
    );
    if (!session) throw unauthorized();

    req.user = payload as AccessTokenPayload;

    next();
  } catch (error) {
    next(error);
  }
};

export const validateRefreshSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.body.refreshToken;
    if (!token) throw unauthorized();

    const payload = verifyRefreshToken(token) as RefreshTokenPayload;
    if (!payload) throw unauthorized();

    const session = await DBPostgresInstance.queryOne<Session>(
      DBPostgresInstance.queries.auth.sessions.getSessionByRtJti,
      [payload.jti]
    );
    if (!session) throw unauthorized();

    req.refresh = payload as RefreshTokenPayload;

    next();
  } catch (error) {
    next(error);
  }
};
