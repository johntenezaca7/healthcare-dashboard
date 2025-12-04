import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/utils';
import { PatientTablePagination } from '../PatientTablePagination';

describe('PatientTablePagination', () => {
  const mockOnPageChange = vi.fn();

  const defaultProps = {
    page: 1,
    pageSize: 10,
    total: 100,
    totalPages: 10,
    onPageChange: mockOnPageChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination details', () => {
    render(<PatientTablePagination {...defaultProps} />);

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByText(/page 1 of 10/i)).toBeInTheDocument();
  });

  it('renders pagination component when totalPages > 1', () => {
    render(<PatientTablePagination {...defaultProps} />);

    // Pagination component should be rendered with Previous/Next buttons
    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('does not render pagination when totalPages is 1', () => {
    render(<PatientTablePagination {...defaultProps} totalPages={1} />);

    // Pagination details should still be shown
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    // But pagination controls should not be shown
    const previousButton = screen.queryByRole('button', { name: /previous page/i });
    const nextButton = screen.queryByRole('button', { name: /next page/i });
    expect(previousButton).not.toBeInTheDocument();
    expect(nextButton).not.toBeInTheDocument();
  });

  it('returns null when total is 0', () => {
    const { container } = render(<PatientTablePagination {...defaultProps} total={0} />);

    expect(container.firstChild).toBeNull();
  });

  it('displays correct pagination details for first page', () => {
    render(<PatientTablePagination {...defaultProps} page={1} pageSize={10} total={100} />);

    expect(screen.getByText(/showing 1 to 10 of 100 patients/i)).toBeInTheDocument();
    expect(screen.getByText(/page 1 of 10/i)).toBeInTheDocument();
  });

  it('displays correct pagination details for middle page', () => {
    render(<PatientTablePagination {...defaultProps} page={5} pageSize={10} total={100} />);

    expect(screen.getByText(/showing 41 to 50 of 100 patients/i)).toBeInTheDocument();
    expect(screen.getByText(/page 5 of 10/i)).toBeInTheDocument();
  });

  it('displays correct pagination details for last page', () => {
    render(<PatientTablePagination {...defaultProps} page={10} pageSize={10} total={95} />);

    expect(screen.getByText(/showing 91 to 95 of 95 patients/i)).toBeInTheDocument();
    expect(screen.getByText(/page 10 of 10/i)).toBeInTheDocument();
  });

  it('handles page change', async () => {
    const user = userEvent.setup();
    render(<PatientTablePagination {...defaultProps} />);

    // Find and click next page button
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalled();
  });

  it('handles different page sizes', () => {
    render(<PatientTablePagination {...defaultProps} pageSize={20} total={100} />);

    expect(screen.getByText(/showing 1 to 20 of 100 patients/i)).toBeInTheDocument();
  });
});

