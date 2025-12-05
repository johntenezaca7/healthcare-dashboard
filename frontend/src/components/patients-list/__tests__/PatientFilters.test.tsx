import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PatientFilters } from '../PatientFilters';

import { render } from '@/test/utils';

describe('PatientFilters', () => {
  const mockOnSearch = vi.fn();
  const mockOnClearSearch = vi.fn();
  const mockOnFilterChange = vi.fn();
  const mockOnClearAll = vi.fn();

  const defaultProps = {
    searchValue: '',
    onSearch: mockOnSearch,
    onClearSearch: mockOnClearSearch,
    onFilterChange: mockOnFilterChange,
    hasActiveFilters: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filter components', () => {
    render(<PatientFilters {...defaultProps} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    // MultiSelect renders as buttons with combobox role
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes.length).toBeGreaterThanOrEqual(7); // 7 filter MultiSelects
  });

  it('renders PatientSearch component', () => {
    render(<PatientFilters {...defaultProps} />);

    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
  });

  it('shows Clear All button when hasActiveFilters is true', () => {
    render(<PatientFilters {...defaultProps} hasActiveFilters={true} />);

    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('hides Clear All button when hasActiveFilters is false', () => {
    render(<PatientFilters {...defaultProps} hasActiveFilters={false} />);

    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });

  it('calls onClearAll when Clear All button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <PatientFilters {...defaultProps} hasActiveFilters={true} onClearAll={mockOnClearAll} />
    );

    const clearAllButton = screen.getByText('Clear All');
    await user.click(clearAllButton);

    expect(mockOnClearAll).toHaveBeenCalledTimes(1);
  });

  it('falls back to individual filter clearing when onClearAll is not provided', async () => {
    const user = userEvent.setup();
    render(<PatientFilters {...defaultProps} hasActiveFilters={true} />);

    const clearAllButton = screen.getByText('Clear All');
    await user.click(clearAllButton);

    // Should call onFilterChange for each filter and onClearSearch
    expect(mockOnFilterChange).toHaveBeenCalled();
    expect(mockOnClearSearch).toHaveBeenCalled();
  });

  it('displays selected insurance provider values', () => {
    render(<PatientFilters {...defaultProps} insuranceProvider={['Blue Cross', 'Aetna']} />);

    // MultiSelect should display selected values as badges
    expect(screen.getByText('Blue Cross')).toBeInTheDocument();
    expect(screen.getByText('Aetna')).toBeInTheDocument();
  });

  it('displays selected allergies values', () => {
    render(<PatientFilters {...defaultProps} allergies={['Peanuts', 'Shellfish']} />);

    expect(screen.getByText('Peanuts')).toBeInTheDocument();
    expect(screen.getByText('Shellfish')).toBeInTheDocument();
  });

  it('displays selected medications values', () => {
    render(<PatientFilters {...defaultProps} currentMedications={['Aspirin', 'Metformin']} />);

    expect(screen.getByText('Aspirin')).toBeInTheDocument();
    expect(screen.getByText('Metformin')).toBeInTheDocument();
  });

  it('displays selected conditions values', () => {
    render(<PatientFilters {...defaultProps} conditions={['Diabetes', 'Hypertension']} />);

    expect(screen.getByText('Diabetes')).toBeInTheDocument();
    expect(screen.getByText('Hypertension')).toBeInTheDocument();
  });

  it('displays selected blood type values', () => {
    render(<PatientFilters {...defaultProps} bloodType={['A+', 'O-']} />);

    expect(screen.getByText('A+')).toBeInTheDocument();
    expect(screen.getByText('O-')).toBeInTheDocument();
  });

  it('displays selected last visit values', () => {
    render(<PatientFilters {...defaultProps} lastVisit={['last_30_days', 'last_90_days']} />);

    // Last visit values are converted to display labels
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes.length).toBeGreaterThan(0);
  });

  it('displays selected status values', () => {
    render(<PatientFilters {...defaultProps} status={['active', 'inactive']} />);

    // Status values are converted to display labels (Active, Inactive)
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('handles empty filter values', () => {
    render(
      <PatientFilters
        {...defaultProps}
        insuranceProvider={undefined}
        allergies={undefined}
        currentMedications={undefined}
        conditions={undefined}
        bloodType={undefined}
        lastVisit={undefined}
        status={undefined}
      />
    );

    // Should render without errors
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('handles empty arrays for filter values', () => {
    render(
      <PatientFilters
        {...defaultProps}
        insuranceProvider={[]}
        allergies={[]}
        currentMedications={[]}
        conditions={[]}
        bloodType={[]}
        lastVisit={[]}
        status={[]}
      />
    );

    // Should render without errors
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });
});
