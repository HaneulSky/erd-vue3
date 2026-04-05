import { api } from '@/shared/api/client';
import type { LoginDto, RegisterDto, AuthResponse, User } from './types';

export const authApi = {
  login: (dto: LoginDto) => api.post<AuthResponse>('/auth/login', dto),

  register: (dto: RegisterDto) => api.post<AuthResponse>('/auth/register', dto),

  logout: () => api.post<User>('/auth/logout'),
};

export const usersApi = {
  me: () => api.get<User>('/users/me'),
};

