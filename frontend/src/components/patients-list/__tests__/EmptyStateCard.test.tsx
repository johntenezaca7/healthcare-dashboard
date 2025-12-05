import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyStateCard } from '../EmptyStateCard';

import { render } from '@/test/utils';

describe('EmptyStateCard', () => {
  it('renders empty state message', () => {
    render(<EmptyStateCard hasActiveFilters={false} />);

    expect(screen.getByText('No patients found')).toBeInTheDocument();
  });

  it('displays filter message when filters are active', () => {
    render(<EmptyStateCard hasActiveFilters={true} />);

    expect(screen.getByText('No patients found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters to see more results.')).toBeInTheDocument();
  });

  it('displays default message when no filters are active', () => {
    render(<EmptyStateCard hasActiveFilters={false} />);

    expect(screen.getByText('No patients found')).toBeInTheDocument();
    expect(screen.getByText('There are no patients in the system yet.')).toBeInTheDocument();
  });

  it('renders Card component structure', () => {
    const { container } = render(<EmptyStateCard hasActiveFilters={false} />);

    // Card should be rendered
    const card = container.querySelector('[class*="rounded-lg"]');
    expect(card).toBeInTheDocument();
  });
});
