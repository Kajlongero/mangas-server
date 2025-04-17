import { JwtPayload } from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
  exp: number;
  uid: string;
  roles: string[];
}

export interface RefreshTokenPayload extends JwtPayload {
  uid: string;
  exp?: number;
}
