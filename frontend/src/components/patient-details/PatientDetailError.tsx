import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui';
import { ROUTES } from '@/utils/constants';

interface PatientDetailErrorProps {
  error?: Error | null;
}

export const PatientDetailError = memo(({ error }: PatientDetailErrorProps) => {
  return (
    <div className="space-y-6">
      <Link to={ROUTES.PATIENTS}>
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            {error instanceof Error ? error.message : 'Patient not found'}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
});

PatientDetailError.displayName = 'PatientDetailError';
