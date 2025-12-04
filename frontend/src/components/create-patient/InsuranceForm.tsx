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
import { insuranceProviders } from '@/components/constants';
import type { PatientCreateFormApi, FormField } from './types';
import { getFieldError, hasFieldError, getFieldClassName } from './utils';

interface InsuranceFormProps {
  form: PatientCreateFormApi;
}

const InsuranceForm = memo(({ form }: InsuranceFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form.Field
          name="insurance.provider"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'Insurance provider is required' : undefined,
            }}
            children={(field: FormField<string>) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Provider *</Label>
              <Select value={field.state.value} onValueChange={value => field.handleChange(value)}>
                <SelectTrigger
                  className={getFieldClassName(field)}
                >
                  <SelectValue placeholder="Select insurance provider" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceProviders.map(prov => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasFieldError(field) && (
                <p className="text-xs text-destructive">{getFieldError(field)}</p>
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field
            name="insurance.policyNumber"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'Policy number is required' : undefined,
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Policy Number *</Label>
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
            name="insurance.groupNumber"
            children={(field: FormField<string | undefined>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Group Number</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value || undefined)}
                />
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field
            name="insurance.effectiveDate"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value || value.length < 1 ? 'Effective date is required' : undefined,
            }}
            children={(field: FormField<string>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Effective Date *</Label>
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
            name="insurance.expirationDate"
            children={(field: FormField<string | undefined>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Expiration Date</Label>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field
            name="insurance.copay"
            validators={{
              onChange: ({ value }: { value: number }) => (value < 0 ? 'Copay must be >= 0' : undefined),
            }}
            children={(field: FormField<number>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Copay *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.state.value === 0 ? '' : field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                      field.handleChange(
                        val === '' ? 0 : isNaN(parseFloat(val)) ? 0 : parseFloat(val)
                      );
                    }
                  }}
                  onKeyDown={e => {
                    if (
                      !/[0-9.]/.test(e.key) &&
                      ![
                        'Backspace',
                        'Delete',
                        'ArrowLeft',
                        'ArrowRight',
                        'ArrowUp',
                        'ArrowDown',
                        'Tab',
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className={getFieldClassName(field)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />
          <form.Field
            name="insurance.deductible"
            validators={{
              onChange: ({ value }: { value: number }) => (value < 0 ? 'Deductible must be >= 0' : undefined),
            }}
            children={(field: FormField<number>) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Deductible *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.state.value === 0 ? '' : field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                      field.handleChange(
                        val === '' ? 0 : isNaN(parseFloat(val)) ? 0 : parseFloat(val)
                      );
                    }
                  }}
                  onKeyDown={e => {
                    if (
                      !/[0-9.]/.test(e.key) &&
                      ![
                        'Backspace',
                        'Delete',
                        'ArrowLeft',
                        'ArrowRight',
                        'ArrowUp',
                        'ArrowDown',
                        'Tab',
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className={getFieldClassName(field)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
});

InsuranceForm.displayName = 'InsuranceForm';

export { InsuranceForm };
