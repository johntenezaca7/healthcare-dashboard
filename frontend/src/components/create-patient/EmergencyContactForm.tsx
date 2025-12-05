import { memo } from 'react';
import type { Control } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle, ControlledInput } from '@/components/ui';

import type { PatientCreateFormData } from '@/schemas/patient';

interface EmergencyContactFormProps {
  control: Control<PatientCreateFormData>;
}

const EmergencyContactForm = memo(({ control }: EmergencyContactFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlledInput name="emergencyContact.name" control={control} label="Name" required />
          <ControlledInput
            name="emergencyContact.relationship"
            control={control}
            label="Relationship"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlledInput
            name="emergencyContact.phone"
            control={control}
            label="Phone"
            type="tel"
            required
          />
          <ControlledInput
            name="emergencyContact.email"
            control={control}
            label="Email"
            type="email"
          />
        </div>
      </CardContent>
    </Card>
  );
});

EmergencyContactForm.displayName = 'EmergencyContactForm';

export { EmergencyContactForm };
