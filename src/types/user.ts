export type UserType = "admin" | "user";

export interface User {
  readonly id: string;
  name: string;
  email: string;
  type: UserType;
  passwordHash: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  type: UserType;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  type?: UserType;
  password?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  type: UserType;
}
