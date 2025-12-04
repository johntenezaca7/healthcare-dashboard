import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

interface PatientListHeaderProps {
  total: number;
}

export const PatientListHeader = memo(
  ({ total }: PatientListHeaderProps) => {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Patients</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage patient records {total > 0 && `(${total} total)`}
          </p>
        </div>
        <Link to={ROUTES.PATIENT_CREATE} className="w-full sm:w-auto">
          <Button className="bg-[#D4C1FF] text-[#262626] hover:bg-[#D4C1FF]/90 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Patient
          </Button>
        </Link>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.total === nextProps.total;
  }
);

PatientListHeader.displayName = 'PatientListHeader';
