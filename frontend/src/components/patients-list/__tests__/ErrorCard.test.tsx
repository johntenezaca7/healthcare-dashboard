import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { ErrorCard } from '../ErrorCard';

describe('ErrorCard', () => {
  it('renders error message when error is provided', () => {
    const error = new Error('Failed to fetch patients');
    render(<ErrorCard error={error} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch patients')).toBeInTheDocument();
  });

  it('returns null when error is null', () => {
    const { container } = render(<ErrorCard error={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('displays default message for non-Error objects', () => {
    const error = { message: 'Custom error' } as Error;
    render(<ErrorCard error={error} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch patients')).toBeInTheDocument();
  });

  it('renders Card component structure', () => {
    const error = new Error('Test error');
    const { container } = render(<ErrorCard error={error} />);

    // Card should be rendered
    const card = container.querySelector('[class*="rounded-lg"]');
    expect(card).toBeInTheDocument();
  });

  it('handles different error messages', () => {
    const error1 = new Error('Network error');
    const { rerender } = render(<ErrorCard error={error1} />);

    expect(screen.getByText('Network error')).toBeInTheDocument();

    const error2 = new Error('Server error');
    rerender(<ErrorCard error={error2} />);

    expect(screen.getByText('Server error')).toBeInTheDocument();
  });
});

