import { useState, useEffect, memo, useMemo } from 'react';
import { Edit } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import type { FormField } from './types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

import { useUpdatePatientInsuranceInfo, type InsuranceInfoUpdate } from '@/hooks';
import { Patient } from '@/types';
import { formatDate } from '@/utils/date';
import { insuranceProviders, defaultNA } from '../constants';
import { extractDatePart } from '../patients-list/utils';

interface EditableInsuranceInfoCardProps {
  patientId: string;
  provider: string;
  policyNumber: string;
  groupNumber?: string | null;
  effectiveDate: string;
  expirationDate?: string | null;
  copay: number;
  deductible: number;
  onUpdate: (updatedPatient: Patient) => void;
}

const EditableInsuranceInfoCard = memo(
  ({
    patientId,
    provider: initialProvider,
    policyNumber: initialPolicyNumber,
    groupNumber: initialGroupNumber,
    effectiveDate: initialEffectiveDate,
    expirationDate: initialExpirationDate,
    copay: initialCopay,
    deductible: initialDeductible,
    onUpdate,
  }: EditableInsuranceInfoCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const updateMutation = useUpdatePatientInsuranceInfo();

    const defaultValues = useMemo(
      () => ({
        provider: initialProvider,
        policyNumber: initialPolicyNumber,
        groupNumber: initialGroupNumber || '',
        effectiveDate: extractDatePart(initialEffectiveDate),
        expirationDate: extractDatePart(initialExpirationDate),
        copay: initialCopay.toString(),
        deductible: initialDeductible.toString(),
      }),
      [
        initialProvider,
        initialPolicyNumber,
        initialGroupNumber,
        initialEffectiveDate,
        initialExpirationDate,
        initialCopay,
        initialDeductible,
      ]
    );

    const form = useForm({
      defaultValues,
      onSubmit: async ({ value }) => {
        try {
          const updateData: InsuranceInfoUpdate = {
            provider: value.provider,
            policyNumber: value.policyNumber,
            groupNumber: value.groupNumber || undefined,
            effectiveDate: value.effectiveDate,
            expirationDate: value.expirationDate || undefined,
            copay: parseFloat(value.copay),
            deductible: parseFloat(value.deductible),
          };

          await updateMutation.mutateAsync({ id: patientId, data: updateData });
          setIsEditing(false);
          onUpdate({} as Patient);
        } catch (err) {
          // Error is handled by mutation
        }
      },
    });

    // Reset form when initial values change and not editing
    useEffect(() => {
      if (!isEditing) {
        form.reset(defaultValues);
      }
    }, [defaultValues, isEditing, form]);

    const handleCancel = () => {
      form.reset(defaultValues);
      setIsEditing(false);
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Insurance Information</CardTitle>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={state => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    size="sm"
                    onClick={e => {
                      e.preventDefault();
                      form.handleSubmit();
                    }}
                    disabled={!canSubmit || updateMutation.isPending || isSubmitting}
                  >
                    Save
                  </Button>
                )}
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {updateMutation.isError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : 'Failed to update insurance information'}
            </div>
          )}

          {!isEditing ? (
            <>
              {initialProvider || initialPolicyNumber ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-medium">{initialProvider || defaultNA}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Policy Number</p>
                      <p className="font-medium">{initialPolicyNumber || defaultNA}</p>
                    </div>
                    {initialGroupNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Group Number</p>
                        <p className="font-medium">{initialGroupNumber}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Copay</p>
                      <p className="font-medium">
                        ${initialCopay ? initialCopay.toFixed(2) : defaultNA}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deductible</p>
                      <p className="font-medium">
                        ${initialDeductible ? initialDeductible.toFixed(2) : defaultNA}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Effective Date</p>
                    <p className="font-medium">
                      {initialEffectiveDate ? formatDate(initialEffectiveDate) : defaultNA}
                    </p>
                  </div>
                  {initialExpirationDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Expiration Date</p>
                      <p className="font-medium">{formatDate(initialExpirationDate)}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No insurance information available</p>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <form.Field
                name="provider"
                validators={{
                  onChange: ({ value }: { value: string }) => {
                    if (!value || value.trim().length < 1) return 'Provider is required';
                    return undefined;
                  },
                }}
                children={(field: FormField<string>) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Provider</Label>
                    <Select value={field.state.value} onValueChange={field.handleChange}>
                      <SelectTrigger
                        id={field.name}
                        className={field.state.meta.errors.length > 0 ? 'border-destructive' : ''}
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
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="policyNumber"
                  validators={{
                    onChange: ({ value }: { value: string }) => {
                      if (!value || value.trim().length < 1) return 'Policy number is required';
                      return undefined;
                    },
                  }}
                  children={(field: FormField<string>) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Policy Number</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        className={field.state.meta.errors.length > 0 ? 'border-destructive' : ''}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                  )}
                />
                <form.Field
                  name="groupNumber"
                  children={(field: FormField<string | undefined>) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Group Number (Optional)</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="effectiveDate"
                  validators={{
                    onChange: ({ value }: { value: string }) => {
                      if (!value || value.length < 1) return 'Effective date is required';
                      const date = new Date(value);
                      if (isNaN(date.getTime())) return 'Invalid date';
                      return undefined;
                    },
                  }}
                  children={(field: FormField<string>) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Effective Date</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        className={field.state.meta.errors.length > 0 ? 'border-destructive' : ''}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                  )}
                />
                <form.Field
                  name="expirationDate"
                  validators={{
                    onChange: ({ value }: { value: string }) => {
                      if (value && value.length > 0) {
                        const date = new Date(value);
                        if (isNaN(date.getTime())) return 'Invalid date';
                      }
                      return undefined;
                    },
                  }}
                  children={(field: FormField<string | undefined>) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Expiration Date (Optional)</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value || '')}
                        className={field.state.meta.errors.length > 0 ? 'border-destructive' : ''}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="copay"
                  validators={{
                    onChange: ({ value }: { value: string }) => {
                      if (!value || value.trim().length < 1) return 'Copay is required';
                      const num = parseFloat(value);
                      if (isNaN(num) || num < 0) return 'Copay must be a valid number >= 0';
                      return undefined;
                    },
                  }}
                  children={(field: FormField<string>) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Copay</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        className={field.state.meta.errors.length > 0 ? 'border-destructive' : ''}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                  )}
                />
                <form.Field
                  name="deductible"
                  validators={{
                    onChange: ({ value }: { value: string }) => {
                      if (!value || value.trim().length < 1) return 'Deductible is required';
                      const num = parseFloat(value);
                      if (isNaN(num) || num < 0) return 'Deductible must be a valid number >= 0';
                      return undefined;
                    },
                  }}
                  children={(field: FormField<string>) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Deductible</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        className={field.state.meta.errors.length > 0 ? 'border-destructive' : ''}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {updateMutation.isPending && (
                <div className="text-sm text-muted-foreground">Saving...</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

EditableInsuranceInfoCard.displayName = 'EditableInsuranceInfoCard';

export { EditableInsuranceInfoCard };
