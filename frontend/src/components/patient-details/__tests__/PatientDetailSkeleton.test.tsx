import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PatientDetailSkeleton } from '../PatientDetailSkeleton';

import { render } from '@/test/utils';

describe('PatientDetailSkeleton', () => {
  it('renders skeleton loading state', () => {
    render(<PatientDetailSkeleton />);

    // Check for skeleton elements (they have data-testid or aria-busy attributes)
    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders multiple skeleton elements', () => {
    const { container } = render(<PatientDetailSkeleton />);

    // Skeleton components render as divs with specific classes
    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('has correct structure with Card components', () => {
    const { container } = render(<PatientDetailSkeleton />);

    // Should have card structure
    const cards = container.querySelectorAll('[class*="rounded-lg"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('renders without crashing', () => {
    const { container } = render(<PatientDetailSkeleton />);
    expect(container).toBeInTheDocument();
  });
});
