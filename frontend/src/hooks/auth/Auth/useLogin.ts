import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API_BASE_URL } from '../../constants';
import { setAuthToken } from '../../utils';
import { authKeys } from './QueryKey';
import type { LoginRequest, LoginResponse } from './types';

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

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: data => {
      setAuthToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
  });
};
