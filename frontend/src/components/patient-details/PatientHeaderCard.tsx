import { memo } from 'react';
import { User, Calendar, Clipboard } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { formatDate, calculateAge } from '@/utils/date';
import { formatStatus } from '@/utils/format';
import type { PatientHeaderCardProps } from './types';
import { usePatientHeaderData } from './utils';

export const PatientHeaderCard = memo(({ patient, medicalInfo }: PatientHeaderCardProps) => {
  const {
    firstName,
    lastName,
    initials,
    dateOfBirth,
    createdAt,
    updatedAt,
    email,
    phone,
    patientId,
    status,
    statusVariant,
  } = usePatientHeaderData(patient, medicalInfo);

  return (
    <Card>
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4 sm:gap-6 flex-1">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10 text-xl sm:text-2xl font-semibold text-primary shrink-0">
              {initials || <User className="h-8 w-8 sm:h-10 sm:w-10" />}
            </div>

            <div className="flex-1 flex flex-col gap-3 sm:gap-0 sm:justify-between min-h-[120px]">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                    {firstName} {lastName}
                  </h1>
                  <Badge variant={statusVariant} className="text-sm">
                    {formatStatus(status)}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
                  <span>{calculateAge(dateOfBirth)} years old</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="break-all">{email}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-md border bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-muted-foreground">
                  Patient ID: {patientId}
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2 shrink-0">
                  <Clipboard className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end justify-end sm:min-h-[118px] pt-2 sm:pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Created: {formatDate(createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Updated: {formatDate(updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PatientHeaderCard.displayName = 'PatientHeaderCard';
