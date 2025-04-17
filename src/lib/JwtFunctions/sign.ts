import { sign } from "jsonwebtoken";

import { authOptions } from "../../configs";
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "./types/jwt.payloads.dto";

export const signAccessToken = (payload: AccessTokenPayload) => {
  return sign(payload, authOptions.JWT_AT_SECRET);
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
  return sign(payload, authOptions.JWT_RT_SECRET);
};
