import { memo } from 'react';
import type { Control } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle, ControlledInput } from '@/components/ui';

import type { PatientCreateFormData } from '@/schemas/patient';

interface MedicalInfoFormProps {
  control: Control<PatientCreateFormData>;
}

const MedicalInfoForm = memo(({ control }: MedicalInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ControlledInput name="lastVisit" control={control} label="Last Visit" type="date" />
      </CardContent>
    </Card>
  );
});

MedicalInfoForm.displayName = 'MedicalInfoForm';

export { MedicalInfoForm };
