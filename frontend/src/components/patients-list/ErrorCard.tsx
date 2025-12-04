import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui';

interface ErrorCardProps {
  error: Error | null;
}

export const ErrorCard = memo(({ error }: ErrorCardProps) => {
  if (!error) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error</CardTitle>
        <CardDescription>
          {error instanceof Error ? error.message : 'Failed to fetch patients'}
        </CardDescription>
      </CardHeader>
    </Card>
  );
});

ErrorCard.displayName = 'ErrorCard';
