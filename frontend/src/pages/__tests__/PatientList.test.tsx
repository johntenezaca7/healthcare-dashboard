import type { Row } from '@tanstack/react-table';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/context/auth';
import { useGetAllPatients } from '@/hooks/queries';

import type { PatientListItem } from '@/types';

import { PatientList } from '../PatientList';

import { render } from '@/test/utils';

vi.mock('@/hooks/queries', () => ({
  useGetAllPatients: vi.fn(),
}));

vi.mock('@/context/auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/components/patients-page', async () => {
  const actual = await vi.importActual('@/components/patients-page');
  return {
    ...actual,
    createColumns: vi.fn(() => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }: { row: Row<PatientListItem> }) => {
          const patient = row.original;
          return (
            <a href={`/patients/${patient.id}`}>
              {patient.firstName} {patient.lastName}
            </a>
          );
        },
      },
      {
        accessorKey: 'age',
        header: 'Age',
        cell: () => '30 years',
      },
    ]),
  };
});

describe('PatientList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Test User', role: 'admin', email: 'test@example.com' },
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshCredentials: vi.fn(),
      isAuthenticated: true,
      sessionExpired: false,
      setSessionExpired: vi.fn(),
    });
  });

  it('renders patient list header', () => {
    vi.mocked(useGetAllPatients).mockReturnValue({
      data: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 25,
        totalPages: 0,
      },
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isRefetchError: false,
      refetch: vi.fn(),
      status: 'success',
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isStale: false,
      fetchStatus: 'idle',
    } as any);

    render(<PatientList />);
    // Check for the main "Patients" heading (h2)
    expect(screen.getByRole('heading', { level: 2, name: 'Patients' })).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    vi.mocked(useGetAllPatients).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isPending: true,
      isSuccess: false,
      isFetching: true,
      isRefetching: false,
      isLoadingError: false,
      isRefetchError: false,
      refetch: vi.fn(),
      status: 'pending',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isInitialLoading: true,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isStale: false,
      fetchStatus: 'fetching',
    } as any);

    render(<PatientList />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Insurance Provider')).toBeInTheDocument();
  });

  it('displays patient table when data is loaded', () => {
    const mockPatients = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1994-01-01',
        email: 'john@example.com',
        phone: '123-456-7890',
        status: 'active' as const,
        lastVisit: '2024-01-15',
        insuranceProvider: 'Aetna',
      },
    ];

    vi.mocked(useGetAllPatients).mockReturnValue({
      data: {
        items: mockPatients,
        total: 1,
        page: 1,
        pageSize: 25,
        totalPages: 1,
      },
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isRefetchError: false,
      refetch: vi.fn(),
      status: 'success',
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isStale: false,
      fetchStatus: 'idle',
    } as any);

    render(<PatientList />);
    // Check that table headers are present (indicating table is rendered)
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    // Verify table is rendered (not empty state or loading)
    expect(screen.queryByText('No patients found')).not.toBeInTheDocument();
  });

  it('displays empty state when no patients', () => {
    vi.mocked(useGetAllPatients).mockReturnValue({
      data: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 25,
        totalPages: 0,
      },
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isRefetchError: false,
      refetch: vi.fn(),
      status: 'success',
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isStale: false,
      fetchStatus: 'idle',
    } as any);

    render(<PatientList />);
    // When patients.length === 0 and hasActiveFilters is false, EmptyStateCard should render
    // Check for the empty state description text - searchInput is empty so hasActiveFilters is false
    // The description should be "There are no patients in the system yet."
    expect(screen.getByText('There are no patients in the system yet.')).toBeInTheDocument();
  });

  it('shows error message on error', () => {
    const error = new Error('Failed to fetch patients');
    vi.mocked(useGetAllPatients).mockReturnValue({
      data: {
        items: [
          {
            id: '1',
            firstName: 'Test',
            lastName: 'Patient',
            dateOfBirth: '2000-01-01',
            email: 'test@example.com',
            phone: '123',
            status: 'active' as const,
            insuranceProvider: 'Aetna',
          },
        ],
        total: 1,
        page: 1,
        pageSize: 25,
        totalPages: 1,
      }, // Provide data so empty state doesn't show
      isLoading: false,
      isError: true,
      error, // error must be truthy for ErrorCard to render it
      isPending: false,
      isSuccess: false,
      isFetching: false,
      isRefetching: false,
      isLoadingError: true,
      isRefetchError: false,
      refetch: vi.fn(),
      status: 'error',
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: Date.now(),
      failureCount: 1,
      failureReason: error,
      errorUpdateCount: 1,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isStale: false,
      fetchStatus: 'idle',
    } as any);

    render(<PatientList />);
    // ErrorCard should be rendered - check for error message text in CardDescription
    // The ErrorCard renders before the table/empty state check
    // ErrorCard renders error.message when error is Error instance
    // Check for the error message text directly
    expect(screen.getByText('Failed to fetch patients')).toBeInTheDocument();
  });

  it('renders search input', () => {
    vi.mocked(useGetAllPatients).mockReturnValue({
      data: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 25,
        totalPages: 0,
      },
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isRefetchError: false,
      refetch: vi.fn(),
      status: 'success',
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isStale: false,
      fetchStatus: 'idle',
    } as any);

    render(<PatientList />);
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
  });

  it('renders filters', () => {
    vi.mocked(useGetAllPatients).mockReturnValue({
      data: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 25,
        totalPages: 0,
      },
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isRefetchError: false,
      refetch: vi.fn(),
      status: 'success',
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isStale: false,
      fetchStatus: 'idle',
    } as any);

    render(<PatientList />);
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
  });
});
