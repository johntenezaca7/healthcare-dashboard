import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginRequest, LoginResponse, User } from '@/types/auth';
import { API_BASE_URL } from '../constants';
import {
  setAuthToken,
  removeAuthToken,
  createAuthHeaders,
  handleApiError,
  getAuthToken,
} from '../utils';
import { checkResponseForAuthError } from '@/utils/apiErrorHandler';

const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
};

const getCurrentUser = async (removeTokenOnError: boolean = false): Promise<User> => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token');
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      checkResponseForAuthError(response);

      if (removeTokenOnError) {
        removeAuthToken();
      }
      throw new Error('Unauthorized');
    }
    throw await handleApiError(response);
  }

  return response.json();
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: data => {
      setAuthToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useCurrentUser = (removeTokenOnError: boolean = false) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser(removeTokenOnError),
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !!getAuthToken(),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      removeAuthToken();
    },
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear();
    },
  });
};
