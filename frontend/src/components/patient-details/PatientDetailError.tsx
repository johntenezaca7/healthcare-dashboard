import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { getErrorMessage, ERROR_MESSAGES } from '@/utils/errorMessages';

interface PatientDetailErrorProps {
  error?: Error | null;
}

export const PatientDetailError = memo(({ error }: PatientDetailErrorProps) => {
  return (
    <div className="space-y-6" role="alert" aria-live="polite">
      <Link to={ROUTES.PATIENTS}>
        <Button variant="ghost" className="gap-2" aria-label="Navigate back to patient list">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Patients
        </Button>
      </Link>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            {getErrorMessage(error, ERROR_MESSAGES.PATIENT_NOT_FOUND)}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
});

PatientDetailError.displayName = 'PatientDetailError';
