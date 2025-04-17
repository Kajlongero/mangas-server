export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  userId: string;
  birthDate: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
