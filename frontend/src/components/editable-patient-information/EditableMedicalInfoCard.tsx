import { memo, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Heart, Plus, X } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui';

import { type MedicalInfoUpdate, useUpdatePatientMedicalInfo } from '@/hooks';
import { formatDate } from '@/utils/date';

import { Patient } from '@/types';

import { defaultNA } from '../constants';
import { extractDatePart } from '../patients-list/utils';
import type { MedicalInfoFormData } from './types';

interface EditableMedicalInfoCardProps {
  patientId: string;
  allergies: string[];
  conditions: string[];
  lastVisit: string | null;
  onUpdate: (updatedPatient: Patient) => void;
}

const EditableMedicalInfoCard = memo(
  ({
    patientId,
    allergies: initialAllergies,
    conditions: initialConditions,
    lastVisit: initialLastVisit,
    onUpdate,
  }: EditableMedicalInfoCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const updateMutation = useUpdatePatientMedicalInfo();

    const defaultValues = useMemo(
      (): MedicalInfoFormData => ({
        allergies: initialAllergies || [],
        conditions: initialConditions || [],
        lastVisit: extractDatePart(initialLastVisit),
        newAllergy: '',
        newCondition: '',
      }),
      [initialAllergies, initialConditions, initialLastVisit]
    );

    const form = useForm<MedicalInfoFormData>({
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

    const onSubmit = async (data: MedicalInfoFormData) => {
      try {
        const updateData: MedicalInfoUpdate = {
          allergies: (data.allergies?.length ?? 0) > 0 ? data.allergies : undefined,
          conditions: (data.conditions?.length ?? 0) > 0 ? data.conditions : undefined,
          lastVisit: data.lastVisit || undefined,
        };

        await updateMutation.mutateAsync({ id: patientId, data: updateData });
        setIsEditing(false);
        onUpdate({} as Patient);
      } catch (err) {
        // Error is handled by mutation
      }
    };

    const handleAddAllergy = () => {
      const newAllergy = form.watch('newAllergy')?.trim() || '';
      if (newAllergy) {
        const currentAllergies = form.watch('allergies') || [];
        if (!currentAllergies.includes(newAllergy)) {
          form.setValue('allergies', [...currentAllergies, newAllergy]);
          form.setValue('newAllergy', '');
        }
      }
    };

    const handleRemoveAllergy = (allergy: string) => {
      const currentAllergies = form.watch('allergies') || [];
      form.setValue(
        'allergies',
        currentAllergies.filter((a: string) => a !== allergy)
      );
    };

    const handleAddCondition = () => {
      const newCondition = form.watch('newCondition')?.trim() || '';
      if (newCondition) {
        const currentConditions = form.watch('conditions') || [];
        if (!currentConditions.includes(newCondition)) {
          form.setValue('conditions', [...currentConditions, newCondition]);
          form.setValue('newCondition', '');
        }
      }
    };

    const handleRemoveCondition = (condition: string) => {
      const currentConditions = form.watch('conditions') || [];
      form.setValue(
        'conditions',
        currentConditions.filter((c: string) => c !== condition)
      );
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Medical Information
          </CardTitle>
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
                disabled={updateMutation.isPending || form.formState.isSubmitting}
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
                : 'Failed to update medical information'}
            </div>
          )}

          {!isEditing ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                {initialAllergies && initialAllergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {initialAllergies.map((allergy: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Conditions</p>
                {initialConditions && initialConditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {initialConditions.map((condition: string, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Visit</p>
                <p className="font-medium">
                  {initialLastVisit ? formatDate(initialLastVisit) : defaultNA}
                </p>
              </div>
            </>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Allergies</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(form.watch('allergies') || []).map((allergy: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {allergy}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(allergy)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    {...form.register('newAllergy')}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAllergy();
                      }
                    }}
                    placeholder="Add allergy"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddAllergy}
                    disabled={!form.watch('newAllergy')?.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Conditions</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(form.watch('conditions') || []).map((condition: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="flex items-center gap-1">
                      {condition}
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(condition)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    {...form.register('newCondition')}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCondition();
                      }
                    }}
                    placeholder="Add condition"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddCondition}
                    disabled={!form.watch('newCondition')?.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastVisit">Last Visit</Label>
                <Input
                  id="lastVisit"
                  type="date"
                  {...form.register('lastVisit', {
                    validate: (value: string | undefined) => {
                      if (value && value.length > 0) {
                        const date = new Date(value);
                        if (isNaN(date.getTime())) return 'Invalid date';
                      }
                      return true;
                    },
                  })}
                />
                {form.formState.errors.lastVisit && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.lastVisit.message}
                  </p>
                )}
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

EditableMedicalInfoCard.displayName = 'EditableMedicalInfoCard';

export { EditableMedicalInfoCard };
