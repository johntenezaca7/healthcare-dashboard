import { memo } from 'react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';

interface EmptyStateCardProps {
  hasActiveFilters: boolean;
}

export const EmptyStateCard = memo(({ hasActiveFilters }: EmptyStateCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No patients found</CardTitle>
        <CardDescription>
          {hasActiveFilters
            ? 'Try adjusting your filters to see more results.'
            : 'There are no patients in the system yet.'}
        </CardDescription>
      </CardHeader>
    </Card>
  );
});

EmptyStateCard.displayName = 'EmptyStateCard';
