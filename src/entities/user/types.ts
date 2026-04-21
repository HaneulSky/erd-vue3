export interface User {
  id: number;
  name: string;
}

export interface LoginDto {
  name: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
