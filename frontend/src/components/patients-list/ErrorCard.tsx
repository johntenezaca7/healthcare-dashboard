import { memo } from 'react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';

import { ERROR_MESSAGES, getErrorMessage } from '@/utils/errorMessages';

interface ErrorCardProps {
  error: Error | null;
  fallbackMessage?: string;
}

export const ErrorCard = memo(({ error, fallbackMessage }: ErrorCardProps) => {
  if (!error) return null;

  return (
    <Card className="border-destructive" role="alert" aria-live="polite">
      <CardHeader>
        <CardTitle>Error</CardTitle>
        <CardDescription>
          {getErrorMessage(error, fallbackMessage || ERROR_MESSAGES.FAILED_TO_FETCH_PATIENTS)}
        </CardDescription>
      </CardHeader>
    </Card>
  );
});

ErrorCard.displayName = 'ErrorCard';
