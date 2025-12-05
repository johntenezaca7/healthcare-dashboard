import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { PatientTable } from '../PatientTable';
import { createPatientsColumns } from '@/components/columns-bucket';
import type { PatientListItem } from '@/types';

describe('PatientTable', () => {
  const mockPatients: PatientListItem[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      email: 'john.doe@example.com',
      phone: '555-1234',
      status: 'active',
      lastVisit: '2024-01-15',
      bloodType: 'O+',
      insuranceProvider: 'Blue Cross',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1985-05-20',
      email: 'jane.smith@example.com',
      phone: '555-5678',
      status: 'inactive',
      lastVisit: '2023-12-10',
      bloodType: 'A-',
      insuranceProvider: 'Aetna',
    },
  ];

  const columns = createPatientsColumns({
    onSortChange: () => {},
    currentSortBy: undefined,
    currentSortOrder: undefined,
  });

  it('renders table with data', () => {
    render(<PatientTable data={mockPatients} columns={columns} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<PatientTable data={[]} columns={columns} />);

    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('renders all table headers', () => {
    render(<PatientTable data={mockPatients} columns={columns} />);

    // Check for common column headers
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/age/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
  });

  it('displays patient information correctly', () => {
    render(<PatientTable data={mockPatients} columns={columns} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('handles single patient', () => {
    const singlePatient = [mockPatients[0]];
    render(<PatientTable data={singlePatient} columns={columns} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('renders table structure correctly', () => {
    const { container } = render(<PatientTable data={mockPatients} columns={columns} />);

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();

    const tableRows = container.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(mockPatients.length);
  });

  it('applies responsive classes for mobile', () => {
    const { container } = render(<PatientTable data={mockPatients} columns={columns} />);

    // Check for responsive classes
    const table = container.querySelector('.overflow-x-auto');
    expect(table).toBeInTheDocument();
  });
});

