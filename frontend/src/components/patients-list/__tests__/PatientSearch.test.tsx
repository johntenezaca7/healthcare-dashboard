import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PatientSearch } from '../PatientSearch';

import { render } from '@/test/utils';

describe('PatientSearch', () => {
  const mockOnSearch = vi.fn();
  const mockOnClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders search input', () => {
    render(<PatientSearch searchValue="" onSearch={mockOnSearch} onClear={mockOnClear} />);
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
  });

  it('displays initial search value', () => {
    render(
      <PatientSearch searchValue="test query" onSearch={mockOnSearch} onClear={mockOnClear} />
    );
    const input = screen.getByPlaceholderText(/search by name/i) as HTMLInputElement;
    expect(input.value).toBe('test query');
  });

  it('debounces search input', () => {
    render(<PatientSearch searchValue="" onSearch={mockOnSearch} onClear={mockOnClear} />);

    // Initial render with empty value calls onSearch('') immediately
    expect(mockOnSearch).toHaveBeenCalledWith('');
    vi.clearAllMocks();

    const input = screen.getByPlaceholderText(/search by name/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 't' } });
    expect(mockOnSearch).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'te' } });
    expect(mockOnSearch).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockOnSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(mockOnSearch).toHaveBeenCalledWith('test');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it('clears search immediately when input is empty', () => {
    render(<PatientSearch searchValue="test" onSearch={mockOnSearch} onClear={mockOnClear} />);

    const input = screen.getByPlaceholderText(/search by name/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('shows clear button when input has value', () => {
    render(<PatientSearch searchValue="test" onSearch={mockOnSearch} onClear={mockOnClear} />);
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
  });

  it('hides clear button when input is empty', () => {
    render(<PatientSearch searchValue="" onSearch={mockOnSearch} onClear={mockOnClear} />);
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    render(<PatientSearch searchValue="test" onSearch={mockOnSearch} onClear={mockOnClear} />);

    const clearButton = screen.getByLabelText(/clear search/i);
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('syncs input value when searchValue prop changes', () => {
    const { rerender } = render(
      <PatientSearch searchValue="" onSearch={mockOnSearch} onClear={mockOnClear} />
    );

    const input = screen.getByPlaceholderText(/search by name/i) as HTMLInputElement;
    expect(input.value).toBe('');

    rerender(
      <PatientSearch searchValue="new value" onSearch={mockOnSearch} onClear={mockOnClear} />
    );

    expect(input.value).toBe('new value');
  });
});
