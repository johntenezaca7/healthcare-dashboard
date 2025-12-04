import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useCreatePatient,
  useUpdatePatientPersonalInfo,
  useUpdatePatientEmergencyContact,
} from '../Patients';

vi.mock('../../utils', () => ({
  createAuthHeaders: vi.fn(() => ({ Authorization: 'Bearer test-token' })),
  handleApiError: vi.fn(async (response: Response) => {
    const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(errorData.detail || `Request failed: ${response.statusText}`);
  }),
}));

global.fetch = vi.fn();

describe('useCreatePatient', () => {
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

  it('should create patient successfully', async () => {
    const mockPatient = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPatient,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCreatePatient(), { wrapper });

    const patientData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      dateOfBirth: '1990-01-01',
      address: {
        street: '123 Main St',
        city: 'City',
        state: 'State',
        zipCode: '12345',
        country: 'USA',
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '123-456-7891',
      },
      insurance: {
        provider: 'Aetna',
        policyNumber: 'POL123',
        effectiveDate: '2024-01-01',
        copay: 25,
        deductible: 1000,
      },
    };

    await result.current.mutateAsync(patientData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/patients'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(patientData),
      })
    );
  });

  it('should handle creation error', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Validation error' }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCreatePatient(), { wrapper });

    const patientData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '123-456-7890',
      dateOfBirth: '1990-01-01',
      address: {
        street: '123 Main St',
        city: 'City',
        state: 'State',
        zipCode: '12345',
        country: 'USA',
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '123-456-7891',
      },
      insurance: {
        provider: 'Aetna',
        policyNumber: 'POL123',
        effectiveDate: '2024-01-01',
        copay: 25,
        deductible: 1000,
      },
    };

    await expect(result.current.mutateAsync(patientData)).rejects.toThrow();
  });
});

describe('useUpdatePatientPersonalInfo', () => {
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

  it('should update patient personal info successfully', async () => {
    const mockUpdatedPatient = {
      id: '1',
      firstName: 'John',
      lastName: 'Updated',
      email: 'john@example.com',
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUpdatedPatient,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdatePatientPersonalInfo(), { wrapper });

    const updateData = {
      firstName: 'John',
      lastName: 'Updated',
    };

    await result.current.mutateAsync({ id: '1', data: updateData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/patients/1/personal-info'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify(updateData),
      })
    );
  });
});

describe('useUpdatePatientEmergencyContact', () => {
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

  it('should update emergency contact successfully', async () => {
    const mockUpdatedPatient = {
      id: '1',
      emergencyContact: {
        name: 'Jane Updated',
        phone: '999-999-9999',
      },
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUpdatedPatient,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdatePatientEmergencyContact(), { wrapper });

    const updateData = {
      name: 'Jane Updated',
      phone: '999-999-9999',
    };

    await result.current.mutateAsync({ id: '1', data: updateData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
