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
import { getFieldError, hasFieldError, getFieldClassName } from './utils';

interface EmergencyContactFormProps {
  form: PatientCreateFormApi;
}

const EmergencyContactForm = memo(({ form }: EmergencyContactFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field
            name="emergencyContact.name"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'Emergency contact name is required' : undefined,
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className={getFieldClassName(field)}
                />
                {hasFieldError(field) && (
                  <p className="text-xs text-destructive">{getFieldError(field)}</p>
                )}
              </div>
            )}
          />
          <form.Field
            name="emergencyContact.relationship"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'Relationship is required' : undefined,
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Relationship *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className={getFieldClassName(field)}
                />
                {hasFieldError(field) && (
                  <p className="text-xs text-destructive">{getFieldError(field)}</p>
                )}
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field
            name="emergencyContact.phone"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'Emergency contact phone is required' : undefined,
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Phone *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className={getFieldClassName(field)}
                />
                {hasFieldError(field) && (
                  <p className="text-xs text-destructive">{getFieldError(field)}</p>
                )}
              </div>
            )}
          />
          <form.Field
            name="emergencyContact.email"
            validators={{
              onChange: ({ value }: { value: string | undefined }) => {
                if (value && value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                  return 'Invalid email format';
                }
                return undefined;
              },
            }}
            children={(field: FormField<string | undefined>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value || undefined)}
                  className={getFieldClassName(field)}
                />
                {hasFieldError(field) && (
                  <p className="text-xs text-destructive">{getFieldError(field)}</p>
                )}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
});

EmergencyContactForm.displayName = 'EmergencyContactForm';

export { EmergencyContactForm };
