export interface Sessions {
  id: number;
  atJti: string;
  rtJti: string;
  active: boolean;
  authId: number;
  publicKey: string;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface Auth {
  id: number;
  userId: string;
  passwordRecoveryUntil: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface AuthRecovery {
  id: string;
  authId: string;
  code: number;
  changeToken: string;
  verificationToken: string;
  attempts: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface AuthInfo {
  id: string;
  email: string;
  password: string;
  authId: number;
  loginUntil: string;
  loginAttempts: number;
  passwordRecoveryUntil: string;
  passwordRecoveryAttempts: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Roles {
  id: number;
  name: string;
  description: string;
  isSpecial: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface RolesCategories {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface RolesWithCategories {
  roleId: number;
  roleName: string;
  rolesCategoriesId: number;
  rolesCategoriesName: string;
  roleDescription: string;
  roleIsSpecial: boolean;
  roleCreatedAt: string;
  roleUpdatedAt: string;
  roleDeletedAt: string;
}

export interface Permissions {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
