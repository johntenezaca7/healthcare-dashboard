import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PaginationDetails } from '../PaginationDetails';

import { render } from '@/test/utils';

describe('PaginationDetails', () => {
  it('renders pagination details with default item label', () => {
    render(<PaginationDetails page={1} pageSize={10} total={100} totalPages={10} />);

    expect(screen.getByText(/showing 1 to 10 of 100 items/i)).toBeInTheDocument();
    expect(screen.getByText(/page 1 of 10/i)).toBeInTheDocument();
  });

  it('renders pagination details with custom item label', () => {
    render(
      <PaginationDetails page={1} pageSize={10} total={100} totalPages={10} itemLabel="patients" />
    );

    expect(screen.getByText(/showing 1 to 10 of 100 patients/i)).toBeInTheDocument();
  });

  it('calculates correct range for first page', () => {
    render(<PaginationDetails page={1} pageSize={10} total={100} totalPages={10} />);

    expect(screen.getByText(/showing 1 to 10 of 100/i)).toBeInTheDocument();
  });

  it('calculates correct range for middle page', () => {
    render(<PaginationDetails page={5} pageSize={10} total={100} totalPages={10} />);

    expect(screen.getByText(/showing 41 to 50 of 100/i)).toBeInTheDocument();
    expect(screen.getByText(/page 5 of 10/i)).toBeInTheDocument();
  });

  it('calculates correct range for last page', () => {
    render(<PaginationDetails page={10} pageSize={10} total={95} totalPages={10} />);

    expect(screen.getByText(/showing 91 to 95 of 95/i)).toBeInTheDocument();
    expect(screen.getByText(/page 10 of 10/i)).toBeInTheDocument();
  });

  it('handles single page', () => {
    render(<PaginationDetails page={1} pageSize={10} total={5} totalPages={1} />);

    expect(screen.getByText(/showing 1 to 5 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
  });

  it('handles empty total', () => {
    render(<PaginationDetails page={1} pageSize={10} total={0} totalPages={0} />);

    // When total is 0: start = (1-1)*10 + 1 = 1, end = Math.min(1*10, 0) = 0
    expect(screen.getByText(/showing 1 to 0 of 0/i)).toBeInTheDocument();
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument(); // totalPages || 1
  });

  it('handles different page sizes', () => {
    render(<PaginationDetails page={2} pageSize={20} total={100} totalPages={5} />);

    expect(screen.getByText(/showing 21 to 40 of 100/i)).toBeInTheDocument();
    expect(screen.getByText(/page 2 of 5/i)).toBeInTheDocument();
  });

  it('renders responsive layout classes', () => {
    const { container } = render(
      <PaginationDetails page={1} pageSize={10} total={100} totalPages={10} />
    );

    // Check for responsive flex classes
    const detailsContainer = container.querySelector('.flex');
    expect(detailsContainer).toBeInTheDocument();
  });
});
