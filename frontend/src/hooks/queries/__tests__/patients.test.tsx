import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAllPatients, useGetPatient } from '../Patients';

type ResponseType = 'basic' | 'cors' | 'error' | 'opaque' | 'opaqueredirect';

vi.mock('../../utils', () => ({
  createAuthHeaders: vi.fn(() => ({ Authorization: 'Bearer test-token' })),
  handleApiError: vi.fn(async (response: Response) => {
    const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(errorData.detail || `Request failed: ${response.statusText}`);
  }),
}));

global.fetch = vi.fn();

describe('useGetAllPatients', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('should fetch patients successfully', async () => {
    const mockResponse = {
      items: [
        { id: '1', firstName: 'John', lastName: 'Doe', status: 'active' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', status: 'active' },
      ],
      total: 2,
      page: 1,
      pageSize: 25,
      totalPages: 1,
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockResponse,
      headers: new Headers(),
      redirected: false,
      type: 'default' as ResponseType,
      url: '',
      clone: vi.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: vi.fn(),
      blob: vi.fn(),
      formData: vi.fn(),
      text: vi.fn(),
      bytes: vi.fn(),
    } as unknown as Response);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetAllPatients({ page: 1, pageSize: 25 }), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });

  it('should handle fetch error', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ detail: 'Server error' }),
      headers: new Headers(),
      redirected: false,
      type: 'default' as ResponseType,
      url: '',
      clone: vi.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: vi.fn(),
      blob: vi.fn(),
      formData: vi.fn(),
      text: vi.fn(),
      bytes: vi.fn(),
    } as unknown as Response);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetAllPatients({ page: 1 }), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('should build query params correctly', async () => {
    const mockResponse = {
      items: [],
      total: 0,
      page: 1,
      pageSize: 25,
      totalPages: 0,
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockResponse,
      headers: new Headers(),
      redirected: false,
      type: 'default' as ResponseType,
      url: '',
      clone: vi.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: vi.fn(),
      blob: vi.fn(),
      formData: vi.fn(),
      text: vi.fn(),
      bytes: vi.fn(),
    } as unknown as Response);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(
      () =>
        useGetAllPatients({
          page: 2,
          pageSize: 50,
          search: 'test',
          status: 'active',
          sortBy: 'firstName',
          sortOrder: 'asc',
        }),
      { wrapper }
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const callUrl = vi.mocked(global.fetch).mock.calls[0]?.[0] as string;
      expect(callUrl).toContain('page=2');
      expect(callUrl).toContain('page_size=50');
      expect(callUrl).toContain('search=test');
      expect(callUrl).toContain('status=active');
      expect(callUrl).toContain('sort_by=firstName');
      expect(callUrl).toContain('sort_order=asc');
    });
  });
});

describe('useGetPatient', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('should fetch single patient successfully', async () => {
    const mockPatient = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      status: 'active',
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockPatient,
      headers: new Headers(),
      redirected: false,
      type: 'default' as ResponseType,
      url: '',
      clone: vi.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: vi.fn(),
      blob: vi.fn(),
      formData: vi.fn(),
      text: vi.fn(),
      bytes: vi.fn(),
    } as unknown as Response);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetPatient('1'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPatient);
  });

  it('should not fetch when id is empty', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useGetPatient(''), { wrapper });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle 404 error', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ detail: 'Patient not found' }),
      headers: new Headers(),
      redirected: false,
      type: 'default' as ResponseType,
      url: '',
      clone: vi.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: vi.fn(),
      blob: vi.fn(),
      formData: vi.fn(),
      text: vi.fn(),
      bytes: vi.fn(),
    } as unknown as Response);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetPatient('999'), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
