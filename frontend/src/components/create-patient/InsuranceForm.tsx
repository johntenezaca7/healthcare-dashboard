import { memo } from 'react';
import type { Control } from 'react-hook-form';
import { useController } from 'react-hook-form';

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
import { ControlledInput } from '@/components/ui';

import type { PatientCreateFormData } from '@/schemas/patient';

import { insuranceProviders } from '@/components/constants';

interface InsuranceFormProps {
  control: Control<PatientCreateFormData>;
}

const InsuranceForm = memo(({ control }: InsuranceFormProps) => {
  // Use useController for the Select component (provider)
  const {
    field: providerField,
    fieldState: { error: providerError },
  } = useController({
    name: 'insurance.provider',
    control,
  });

  // Use useController for number inputs to handle valueAsNumber
  const {
    field: copayField,
    fieldState: { error: copayError },
  } = useController({
    name: 'insurance.copay',
    control,
    defaultValue: undefined,
  });

  const {
    field: deductibleField,
    fieldState: { error: deductibleError },
  } = useController({
    name: 'insurance.deductible',
    control,
    defaultValue: undefined,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="insurance.provider" className="text-sm font-medium">
            Provider *
          </label>
          <Select
            value={providerField.value || ''}
            onValueChange={value => {
              providerField.onChange(value);
            }}
            onOpenChange={open => {
              if (!open) {
                providerField.onBlur();
              }
            }}
          >
            <SelectTrigger className={providerError ? 'border-destructive' : ''}>
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
          {providerError && <p className="text-xs text-destructive">{providerError.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlledInput
            name="insurance.policyNumber"
            control={control}
            label="Policy Number"
            required
          />
          <ControlledInput name="insurance.groupNumber" control={control} label="Group Number" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlledInput
            name="insurance.effectiveDate"
            control={control}
            label="Effective Date"
            type="date"
            required
          />
          <ControlledInput
            name="insurance.expirationDate"
            control={control}
            label="Expiration Date"
            type="date"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insurance.copay">Copay *</Label>
            <Input
              id="insurance.copay"
              type="number"
              step="0.01"
              min="0"
              {...copayField}
              value={copayField.value ?? ''}
              onChange={e => {
                const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                copayField.onChange(isNaN(value as number) ? undefined : value);
              }}
              className={copayError ? 'border-destructive' : ''}
            />
            {copayError && <p className="text-xs text-destructive">{copayError.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="insurance.deductible">Deductible *</Label>
            <Input
              id="insurance.deductible"
              type="number"
              step="0.01"
              min="0"
              {...deductibleField}
              value={deductibleField.value == null ? '' : deductibleField.value}
              onChange={e => {
                const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                deductibleField.onChange(isNaN(value as number) ? undefined : value);
              }}
              className={deductibleError ? 'border-destructive' : ''}
            />
            {deductibleError && (
              <p className="text-xs text-destructive">{deductibleError.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

InsuranceForm.displayName = 'InsuranceForm';

export { InsuranceForm };
