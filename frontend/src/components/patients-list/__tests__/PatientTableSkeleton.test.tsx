import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { PatientTableSkeleton } from '../PatientTableSkeleton';

describe('PatientTableSkeleton', () => {
  it('renders skeleton loading state', () => {
    render(<PatientTableSkeleton />);

    // Check for skeleton elements
    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders table structure', () => {
    const { container } = render(<PatientTableSkeleton />);

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<PatientTableSkeleton />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders multiple skeleton rows', () => {
    const { container } = render(<PatientTableSkeleton />);

    const skeletonRows = container.querySelectorAll('tbody tr');
    expect(skeletonRows.length).toBe(10); // Should render 10 skeleton rows
  });

  it('renders skeleton elements in cells', () => {
    const { container } = render(<PatientTableSkeleton />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('has responsive classes for mobile', () => {
    const { container } = render(<PatientTableSkeleton />);

    const tableContainer = container.querySelector('.overflow-x-auto');
    expect(tableContainer).toBeInTheDocument();
  });
});

