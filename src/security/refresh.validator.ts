import { unauthorized } from "@hapi/boom";
import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken } from "../lib/JwtFunctions/verify";
import { RefreshTokenPayload } from "../lib/JwtFunctions/types/jwt.payloads.dto";

export const refreshTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.refreshToken as string;
  if (!token) next(unauthorized("Unauthorized"));

  const payload = verifyRefreshToken(token);
  if (!payload) next(unauthorized("Unauthorized"));

  req.refresh = payload as RefreshTokenPayload;

  delete req.body.refreshToken;

  next();
};
