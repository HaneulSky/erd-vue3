const KEY = 'access_token' as const;

export const tokenService = {
  get: () => localStorage.getItem(KEY),
  set: (token: string) => localStorage.setItem(KEY, token),
  remove: () => localStorage.removeItem(KEY),
};