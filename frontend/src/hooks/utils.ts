import { AUTH_TOKEN_KEY } from './constants';
import { checkResponseForAuthError } from '@/utils/apiErrorHandler';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const createAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const handleApiError = async (response: Response): Promise<never> => {
  if (checkResponseForAuthError(response)) {
    throw new Error('Unauthorized - Please login again');
  }

  const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
  throw new Error(errorData.detail || `Request failed: ${response.statusText}`);
};
