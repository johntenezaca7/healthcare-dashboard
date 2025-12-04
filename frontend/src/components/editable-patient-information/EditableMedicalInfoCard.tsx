import { useState, useEffect, memo, useMemo } from 'react';
import { Edit, Plus, Heart, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
} from '@/components/ui';
import { useForm } from '@tanstack/react-form';
import { useUpdatePatientMedicalInfo, type MedicalInfoUpdate } from '@/hooks';
import { Patient } from '@/types';
import { formatDate } from '@/utils/date';
import { defaultNA } from '../constants';
import { extractDatePart } from '../patients-list/utils';
import type { FormField } from './types';

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
      () => ({
        allergies: initialAllergies || [],
        conditions: initialConditions || [],
        lastVisit: extractDatePart(initialLastVisit),
        newAllergy: '',
        newCondition: '',
      }),
      [initialAllergies, initialConditions, initialLastVisit]
    );

    const form = useForm({
      defaultValues,
      onSubmit: async ({ value }) => {
        try {
          const updateData: MedicalInfoUpdate = {
            allergies: value.allergies.length > 0 ? value.allergies : undefined,
            conditions: value.conditions.length > 0 ? value.conditions : undefined,
            lastVisit: value.lastVisit || undefined,
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

    const handleAddAllergy = () => {
      const newAllergy = form.getFieldValue('newAllergy')?.trim() || '';
      if (newAllergy) {
        const currentAllergies = form.getFieldValue('allergies') || [];
        if (!currentAllergies.includes(newAllergy)) {
          form.setFieldValue('allergies', [...currentAllergies, newAllergy]);
          form.setFieldValue('newAllergy', '');
        }
      }
    };

    const handleRemoveAllergy = (allergy: string) => {
      const currentAllergies = form.getFieldValue('allergies') || [];
      form.setFieldValue('allergies', currentAllergies.filter((a: string) => a !== allergy));
    };

    const handleAddCondition = () => {
      const newCondition = form.getFieldValue('newCondition')?.trim() || '';
      if (newCondition) {
        const currentConditions = form.getFieldValue('conditions') || [];
        if (!currentConditions.includes(newCondition)) {
          form.setFieldValue('conditions', [...currentConditions, newCondition]);
          form.setFieldValue('newCondition', '');
        }
      }
    };

    const handleRemoveCondition = (condition: string) => {
      const currentConditions = form.getFieldValue('conditions') || [];
      form.setFieldValue('conditions', currentConditions.filter((c: string) => c !== condition));
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
            <div className="space-y-4">
              <form.Field
                name="allergies"
                children={(field: FormField<string[]>) => {
                  const allergies = field.state.value || [];
                  return (
                    <div className="space-y-2">
                      <Label>Allergies</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {allergies.map((allergy: string, idx: number) => (
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
                      <form.Field
                        name="newAllergy"
                        children={(newAllergyField: FormField<string>) => (
                          <div className="flex gap-2">
                            <Input
                              value={newAllergyField.state.value || ''}
                              onChange={e => newAllergyField.handleChange(e.target.value)}
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
                              disabled={!newAllergyField.state.value?.trim()}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      />
                    </div>
                  );
                }}
              />

              <form.Field
                name="conditions"
                children={(field: FormField<string[]>) => {
                  const conditions = field.state.value || [];
                  return (
                    <div className="space-y-2">
                      <Label>Conditions</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {conditions.map((condition: string, idx: number) => (
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
                      <form.Field
                        name="newCondition"
                        children={(newConditionField: FormField<string>) => (
                          <div className="flex gap-2">
                            <Input
                              value={newConditionField.state.value || ''}
                              onChange={e => newConditionField.handleChange(e.target.value)}
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
                              disabled={!newConditionField.state.value?.trim()}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      />
                    </div>
                  );
                }}
              />

              <form.Field
                name="lastVisit"
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
                    <Label htmlFor={field.name}>Last Visit</Label>
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

EditableMedicalInfoCard.displayName = 'EditableMedicalInfoCard';

export { EditableMedicalInfoCard };
