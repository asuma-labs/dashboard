import Cookies from 'js-cookie';

const TOKEN_KEY = 'asuma_token';

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, path: '/' });
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) return localToken;
  }
  return Cookies.get(TOKEN_KEY) || null;
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY, { path: '/' });
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};
