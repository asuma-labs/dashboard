import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { getToken } from '../lib/auth';

export const useAuth = () => {
  const { user, token, isAuthenticated, loading, setUser, setToken, logout, reset, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken();
      if (storedToken) {
        setToken(storedToken);
      } else {
        reset(); // Clear store if no token found
      }
      setLoading(false);
    };

    initializeAuth();
  }, [setToken, reset, setLoading]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    setUser,
    setToken,
    logout,
  };
};
