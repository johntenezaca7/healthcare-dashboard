import { memo } from 'react';

interface MutationErrorBannerProps {
  error: Error | null;
  fallbackMessage: string;
}

export const MutationErrorBanner = memo(({ error, fallbackMessage }: MutationErrorBannerProps) => {
  if (!error) return null;

  return (
    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert" aria-live="polite">
      {error instanceof Error ? error.message : fallbackMessage}
    </div>
  );
});

MutationErrorBanner.displayName = 'MutationErrorBanner';

