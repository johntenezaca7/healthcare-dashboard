import { useState, useEffect, memo, useMemo } from 'react';
import { Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import type { InsuranceInfoFormData } from './types';
import { getFieldErrorFromForm as getFieldError, hasFieldErrorFromForm as hasFieldError, getFieldClassNameFromForm as getFieldClassName } from '@/utils/form';

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
      (): InsuranceInfoFormData => ({
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

    const form = useForm<InsuranceInfoFormData>({
      defaultValues,
      mode: 'onChange',
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

    const onSubmit = async (data: InsuranceInfoFormData) => {
      try {
        const updateData: InsuranceInfoUpdate = {
          provider: data.provider,
          policyNumber: data.policyNumber,
          groupNumber: data.groupNumber || undefined,
          effectiveDate: data.effectiveDate,
          expirationDate: data.expirationDate || undefined,
          copay: parseFloat(data.copay),
          deductible: parseFloat(data.deductible),
        };

        await updateMutation.mutateAsync({ id: patientId, data: updateData });
        setIsEditing(false);
        onUpdate({} as Patient);
      } catch (err) {
        // Error is handled by mutation
      }
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
              <Button
                size="sm"
                onClick={form.handleSubmit(onSubmit)}
                disabled={!form.formState.isValid || updateMutation.isPending || form.formState.isSubmitting}
              >
                Save
              </Button>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select
                  value={form.watch('provider') || ''}
                  onValueChange={value => form.setValue('provider', value)}
                >
                  <SelectTrigger
                    id="provider"
                    className={getFieldClassName(form, 'provider')}
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
                {hasFieldError(form, 'provider') && (
                  <p className="text-xs text-destructive">{getFieldError(form, 'provider')}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input
                    id="policyNumber"
                    {...form.register('policyNumber', { required: 'Policy number is required' })}
                    className={getFieldClassName(form, 'policyNumber')}
                  />
                  {hasFieldError(form, 'policyNumber') && (
                    <p className="text-xs text-destructive">{getFieldError(form, 'policyNumber')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupNumber">Group Number (Optional)</Label>
                  <Input
                    id="groupNumber"
                    {...form.register('groupNumber')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    {...form.register('effectiveDate', { required: 'Effective date is required' })}
                    className={getFieldClassName(form, 'effectiveDate')}
                  />
                  {hasFieldError(form, 'effectiveDate') && (
                    <p className="text-xs text-destructive">{getFieldError(form, 'effectiveDate')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    {...form.register('expirationDate')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="copay">Copay</Label>
                  <Input
                    id="copay"
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register('copay', {
                      required: 'Copay is required',
                      validate: (value: string) => {
                        const num = parseFloat(value);
                        if (isNaN(num) || num < 0) return 'Copay must be >= 0';
                        return true;
                      },
                    })}
                    className={getFieldClassName(form, 'copay')}
                  />
                  {hasFieldError(form, 'copay') && (
                    <p className="text-xs text-destructive">{getFieldError(form, 'copay')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deductible">Deductible</Label>
                  <Input
                    id="deductible"
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register('deductible', {
                      required: 'Deductible is required',
                      validate: (value: string) => {
                        const num = parseFloat(value);
                        if (isNaN(num) || num < 0) return 'Deductible must be >= 0';
                        return true;
                      },
                    })}
                    className={getFieldClassName(form, 'deductible')}
                  />
                  {hasFieldError(form, 'deductible') && (
                    <p className="text-xs text-destructive">{getFieldError(form, 'deductible')}</p>
                  )}
                </div>
              </div>

              {updateMutation.isPending && (
                <div className="text-sm text-muted-foreground">Saving...</div>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    );
  }
);

EditableInsuranceInfoCard.displayName = 'EditableInsuranceInfoCard';

export { EditableInsuranceInfoCard };
