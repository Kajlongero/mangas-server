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
