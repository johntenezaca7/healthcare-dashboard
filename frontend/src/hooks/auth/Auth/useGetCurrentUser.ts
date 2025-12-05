import { useQuery } from '@tanstack/react-query';

import { checkResponseForAuthError } from '@/utils/apiErrorHandler';

import { API_BASE_URL } from '../../constants';
import { createAuthHeaders, getAuthToken, handleApiError, removeAuthToken } from '../../utils';
import { authKeys } from './QueryKey';
import type { User } from './types';

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

export const useGetCurrentUser = (removeTokenOnError: boolean = false) => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => getCurrentUser(removeTokenOnError),
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !!getAuthToken(),
  });
};
