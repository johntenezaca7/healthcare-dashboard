import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useLogin } from '../useAuth';

// Hoist mock functions using vi.hoisted
const {
  mockSetAuthToken,
  mockRemoveAuthToken,
  mockGetAuthToken,
  mockCreateAuthHeaders,
  mockHandleApiError,
} = vi.hoisted(() => ({
  mockSetAuthToken: vi.fn(),
  mockRemoveAuthToken: vi.fn(),
  mockGetAuthToken: vi.fn(() => 'test-token'),
  mockCreateAuthHeaders: vi.fn(() => ({ Authorization: 'Bearer test-token' })),
  mockHandleApiError: vi.fn(),
}));

// Mock the auth utils
vi.mock('../utils', () => ({
  setAuthToken: mockSetAuthToken,
  removeAuthToken: mockRemoveAuthToken,
  getAuthToken: mockGetAuthToken,
  createAuthHeaders: mockCreateAuthHeaders,
  handleApiError: mockHandleApiError,
}));

// Mock fetch
global.fetch = vi.fn();

describe('useLogin', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
    mockGetAuthToken.mockReturnValue('test-token');
  });

  it('should return mutation functions', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
    expect(result.current.isPending).toBeDefined();
  });

  it('should call fetch with correct credentials and return response', async () => {
    const mockToken = 'test-access-token-123';
    const mockResponse = { access_token: mockToken };
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockJson = vi.fn().mockResolvedValue(mockResponse);
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: mockJson,
    } as unknown as Response);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    const response = await result.current.mutateAsync(credentials);

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(credentials),
      })
    );

    // Verify response was returned correctly
    expect(response).toEqual(mockResponse);
    expect(response.access_token).toBe(mockToken);
  });

  it('should throw error when login fails', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    const errorData = { detail: 'Invalid credentials' };
    const mockJson = vi.fn().mockResolvedValue(errorData);
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: mockJson,
    } as unknown as Response);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    // Verify that the mutation throws an error
    await expect(result.current.mutateAsync(credentials)).rejects.toThrow('Invalid credentials');

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalled();
  });
});
