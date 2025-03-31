export interface Auth {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface AuthInfo {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRecovery {
  id: string;
  code: number;
  changeToken: string;
  verificationToken: string;
  authId: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Roles {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permissions {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface JwtCredentials {
  refreshToken: string;
  accessToken: string;
}
