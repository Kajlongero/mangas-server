import { verify } from "jsonwebtoken";

import { authOptions } from "../../configs";

export const verifyAccessToken = (token: string) => {
  const { JWT_AT_SECRET } = authOptions;

  return verify(token, JWT_AT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  const { JWT_RT_SECRET } = authOptions;

  return verify(token, JWT_RT_SECRET);
};
