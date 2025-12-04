import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { PatientList } from '../PatientList';
import { useGetAllPatients } from '@/hooks/queries';
import { useAuth } from '@/context/auth';
import type { Row } from '@tanstack/react-table';
import type { PatientListItem } from '@/types';

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
      user: { name: 'Test User', role: 'admin' },
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
    });

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
    });

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
        phone: '123-456-7890',
        status: 'active',
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
    });

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
    });

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
            phone: '123',
            status: 'active',
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
    });

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
    });

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
    });

    render(<PatientList />);
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
  });
});
