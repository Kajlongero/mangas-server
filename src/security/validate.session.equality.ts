import { unauthorized } from "@hapi/boom";
import { verifyRefreshToken } from "../lib/JwtFunctions/verify";

import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../lib/JwtFunctions/types/jwt.payloads.dto";

export const validateSessionEquality = (
  user: AccessTokenPayload,
  token: string
) => {
  console.log(token);

  const refreshPayload = verifyRefreshToken(token) as RefreshTokenPayload;
  if (!refreshPayload) throw unauthorized();

  if (user.uid !== refreshPayload.uid) throw unauthorized("Invalid token");

  return refreshPayload;
};
