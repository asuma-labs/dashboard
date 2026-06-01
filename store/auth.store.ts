import { create } from 'zustand';
import { User } from '../types/auth';
import { removeToken, setToken as setLocalToken } from '../lib/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  reset: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => {
    setLocalToken(token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },
  reset: () => {
    removeToken();
    set({ user: null, token: null, isAuthenticated: false, loading: false });
  },
  setLoading: (loading) => set({ loading }),
}));

// Listen for unauthorized events to clear store
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().reset();
  });
}
