import { API_BASE_URL } from '../config/env';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
  }
}

export async function request<T>(endpoint: string, config: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...config,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data?.message || 'Request failed', data);
  }

  return data as T;
}

export const api = {
  get: <T>(url: string, init?: RequestInit) => request<T>(url, { method: 'GET', ...init }),
  post: <T>(url: string, body?: unknown, init?: RequestInit) =>
    request<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined, ...init }),
  put: <T>(url: string, body?: unknown, init?: RequestInit) =>
    request<T>(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, ...init }),
  delete: <T>(url: string, init?: RequestInit) => request<T>(url, { method: 'DELETE', ...init }),
};
