import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../../lib/JwtFunctions/types/jwt.payloads.dto";

export interface LoginCredentials {
  identifier: string;
  password: string;
  remember: boolean;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  remember: boolean;
}

export interface JwtPayloads {
  accessTokenPayload: AccessTokenPayload;
  refreshTokenPayload: RefreshTokenPayload;
}
