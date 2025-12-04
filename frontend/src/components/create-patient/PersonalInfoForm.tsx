import { memo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { bloodTypes } from '@/components/constants';
import type { PatientCreateFormApi, FormField } from './types';
import { getFieldError, hasFieldError, getFieldClassName } from './utils';

interface PersonalInfoFormProps {
  form: PatientCreateFormApi;
}

const PersonalInfoForm = memo(({ form }: PersonalInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }: { value: string }) => {
                if (!value || value.length < 1) return 'First name is required';
                if (value.length < 2) return 'First name must be at least 2 characters';
                return undefined;
              },
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>First Name *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className={getFieldClassName(field)}
                  aria-required="true"
                  aria-invalid={hasFieldError(field)}
                  aria-describedby={hasFieldError(field) ? `${field.name}-error` : undefined}
                />
                {hasFieldError(field) && (
                  <p className="text-xs text-destructive">{getFieldError(field)}</p>
                )}
              </div>
            )}
          />
          <form.Field
            name="lastName"
            validators={{
              onChange: ({ value }: { value: string }) => {
                if (!value || value.length < 1) return 'Last name is required';
                if (value.length < 2) return 'Last name must be at least 2 characters';
                return undefined;
              },
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Last Name *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className={getFieldClassName(field)}
                  aria-required="true"
                  aria-invalid={hasFieldError(field)}
                  aria-describedby={hasFieldError(field) ? `${field.name}-error` : undefined}
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
            name="dateOfBirth"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'Date of birth is required' : undefined,
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Date of Birth *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="date"
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
            name="bloodType"
            children={(field: FormField<string | undefined>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Blood Type</Label>
                <Select
                  value={field.state.value || undefined}
                  onValueChange={value => field.handleChange(value === 'none' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }: { value: string }) => {
                if (!value || value.length < 1) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
                return undefined;
              },
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
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
            name="phone"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'Phone is required' : undefined,
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
        </div>

        <form.Field
          name="address.street"
          validators={{
            onChange: ({ value }: { value: string }) =>
              !value || value.length < 1 ? 'Street address is required' : undefined,
          }}
          children={(field: FormField<string>) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Street Address *</Label>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <form.Field
            name="address.city"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'City is required' : undefined,
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>City *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className={getFieldClassName(field)}
                  aria-required="true"
                  aria-invalid={hasFieldError(field)}
                  aria-describedby={hasFieldError(field) ? `${field.name}-error` : undefined}
                />
                {hasFieldError(field) && (
                  <p className="text-xs text-destructive">{getFieldError(field)}</p>
                )}
              </div>
            )}
          />
          <form.Field
            name="address.state"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'State is required' : undefined,
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>State *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className={getFieldClassName(field)}
                  aria-required="true"
                  aria-invalid={hasFieldError(field)}
                  aria-describedby={hasFieldError(field) ? `${field.name}-error` : undefined}
                />
                {hasFieldError(field) && (
                  <p className="text-xs text-destructive">{getFieldError(field)}</p>
                )}
              </div>
            )}
          />
          <form.Field
            name="address.zipCode"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'Zip code is required' : undefined,
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Zip Code *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className={getFieldClassName(field)}
                  aria-required="true"
                  aria-invalid={hasFieldError(field)}
                  aria-describedby={hasFieldError(field) ? `${field.name}-error` : undefined}
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

PersonalInfoForm.displayName = 'PersonalInfoForm';

export { PersonalInfoForm };
