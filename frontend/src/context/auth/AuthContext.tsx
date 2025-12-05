import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { getAuthToken, removeAuthToken, useGetCurrentUser, useLogout } from '@/hooks';
import { setSessionExpiredCallback } from '@/utils/apiErrorHandler';

import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshCredentials: () => Promise<void>;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const {
    data: user,
    isLoading: loading,
    refetch: refetchUser,
    error: userError,
  } = useGetCurrentUser(false);
  const logoutMutation = useLogout();

  useEffect(() => {
    if (userError && getAuthToken()) {
      const errorMessage = (userError as Error).message || '';
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        setSessionExpired(true);
      }
    }
  }, [userError]);

  useEffect(() => {
    setSessionExpiredCallback(setSessionExpired);
    return () => {
      setSessionExpiredCallback(() => {});
    };
  }, []);

  const login = async (_token: string) => {
    await refetchUser();
  };

  const logout = () => {
    logoutMutation.mutate();
    setSessionExpired(false);
  };

  const refreshCredentials = async () => {
    try {
      await refetchUser();
      setSessionExpired(false);
    } catch (error) {
      removeAuthToken();
      setSessionExpired(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        loading,
        login,
        logout,
        refreshCredentials,
        isAuthenticated: !!user,
        sessionExpired,
        setSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
