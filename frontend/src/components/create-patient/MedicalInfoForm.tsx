import { memo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { ControlledInput } from '@/components/ui';
import type { Control } from 'react-hook-form';
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
        <ControlledInput
          name="lastVisit"
          control={control}
          label="Last Visit"
          type="date"
        />
      </CardContent>
    </Card>
  );
});

MedicalInfoForm.displayName = 'MedicalInfoForm';

export { MedicalInfoForm };
