import { memo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui';
import type { PatientCreateFormApi, FormField } from './types';

interface MedicalInfoFormProps {
  form: PatientCreateFormApi;
}

const MedicalInfoForm = memo(({ form }: MedicalInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form.Field
          name="lastVisit"
          children={(field: FormField<string | undefined>) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Last Visit</Label>
              <Input
                id={field.name}
                name={field.name}
                type="date"
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value || undefined)}
              />
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
});

MedicalInfoForm.displayName = 'MedicalInfoForm';

export { MedicalInfoForm };
