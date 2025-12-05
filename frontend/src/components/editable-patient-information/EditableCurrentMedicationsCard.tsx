import { useState, useEffect, memo, useMemo } from 'react';
import { Edit, Plus, Trash2, Pill } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { useUpdatePatientMedications, type MedicationsUpdate } from '@/hooks';
import { Patient } from '@/types';
import { formatDate } from '@/utils/date';
import { extractDatePart } from '../patients-list/utils';
import type { MedicationsFormData } from './types';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  prescribed_by?: string;
  startDate: string;
  start_date?: string;
  endDate?: string | null;
  end_date?: string | null;
  isActive: boolean;
  is_active?: boolean;
}

interface EditableCurrentMedicationsCardProps {
  patientId: string;
  medications: Medication[];
  onUpdate: (updatedPatient: Patient) => void;
}

const EditableCurrentMedicationsCard = memo(
  ({
    patientId,
    medications: initialMedications,
    onUpdate,
  }: EditableCurrentMedicationsCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const updateMutation = useUpdatePatientMedications();

    const normalizeMedications = useMemo(() => {
      return (initialMedications || []).map(med => ({
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        prescribedBy: med.prescribedBy || med.prescribed_by || '',
        startDate: extractDatePart(med.startDate || med.start_date),
        endDate: extractDatePart(med.endDate || med.end_date),
        isActive: med.isActive !== undefined ? med.isActive : med.is_active !== undefined ? med.is_active : true,
      }));
    }, [initialMedications]);

    const form = useForm<MedicationsFormData>({
      defaultValues: {
        medications: normalizeMedications,
      },
      mode: 'onChange',
    });

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: 'medications',
    });

    // Reset form when initial values change and not editing
    useEffect(() => {
      if (!isEditing) {
        form.reset({ medications: normalizeMedications });
      }
    }, [normalizeMedications, isEditing, form]);

    const handleCancel = () => {
      form.reset({ medications: normalizeMedications });
      setIsEditing(false);
    };

    const onSubmit = async (data: MedicationsFormData) => {
      try {
        const activeMedications = data.medications.filter(med => med.isActive);

        const updateData: MedicationsUpdate = {
          medications: activeMedications.map(med => ({
            id: med.id && med.id.startsWith('temp-') ? undefined : med.id,
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            prescribedBy: med.prescribedBy,
            startDate: med.startDate,
            endDate: med.endDate || undefined,
          })),
        };

        await updateMutation.mutateAsync({ id: patientId, data: updateData });
        setIsEditing(false);
        onUpdate({} as Patient);
      } catch (err) {
        // Error is handled by mutation
      }
    };

    const handleAddMedication = () => {
      append({
        id: `temp-${Date.now()}`,
        name: '',
        dosage: '',
        frequency: '',
        prescribedBy: '',
        startDate: '',
        endDate: '',
        isActive: true,
      });
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Current Medications
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
                : 'Failed to update medications'}
            </div>
          )}

          {!isEditing ? (
            <>
              {initialMedications && initialMedications.length > 0 ? (
                <div className="space-y-4">
                  {initialMedications.map((medication: Medication) => (
                    <div key={medication.id} className="border-l-2 border-primary pl-4">
                      <p className="font-medium">{medication.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {medication.dosage} - {medication.frequency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Prescribed by: {medication.prescribedBy || medication.prescribed_by}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Started: {formatDate(medication.startDate || medication.start_date || '')}
                        {(medication.endDate || medication.end_date) &&
                          ` - Ended: ${formatDate(medication.endDate || medication.end_date || '')}`}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No current medications</p>
              )}
            </>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field, index: number) => {
                const getFieldError = (fieldName: string) => {
                  const error = form.formState.errors.medications?.[index];
                  if (!error) return undefined;
                  const fieldError = (error as Record<string, { message?: string }>)[fieldName];
                  return fieldError?.message;
                };

                return (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`med-name-${index}`}>Name</Label>
                        <Input
                          id={`med-name-${index}`}
                          {...form.register(`medications.${index}.name` as const, {
                            required: 'Name is required',
                          })}
                          className={getFieldError('name') ? 'border-destructive' : ''}
                        />
                        {getFieldError('name') && (
                          <p className="text-xs text-destructive">{getFieldError('name')}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`med-dosage-${index}`}>Dosage</Label>
                        <Input
                          id={`med-dosage-${index}`}
                          {...form.register(`medications.${index}.dosage` as const, {
                            required: 'Dosage is required',
                          })}
                          className={getFieldError('dosage') ? 'border-destructive' : ''}
                        />
                        {getFieldError('dosage') && (
                          <p className="text-xs text-destructive">{getFieldError('dosage')}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`med-frequency-${index}`}>Frequency</Label>
                        <Input
                          id={`med-frequency-${index}`}
                          {...form.register(`medications.${index}.frequency` as const, {
                            required: 'Frequency is required',
                          })}
                          placeholder="e.g., Once daily, Twice daily"
                          className={getFieldError('frequency') ? 'border-destructive' : ''}
                        />
                        {getFieldError('frequency') && (
                          <p className="text-xs text-destructive">{getFieldError('frequency')}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`med-prescribedBy-${index}`}>Prescribed By</Label>
                        <Input
                          id={`med-prescribedBy-${index}`}
                          {...form.register(`medications.${index}.prescribedBy` as const, {
                            required: 'Prescribed by is required',
                          })}
                          className={getFieldError('prescribedBy') ? 'border-destructive' : ''}
                        />
                        {getFieldError('prescribedBy') && (
                          <p className="text-xs text-destructive">{getFieldError('prescribedBy')}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`med-startDate-${index}`}>Start Date</Label>
                        <Input
                          id={`med-startDate-${index}`}
                          type="date"
                          {...form.register(`medications.${index}.startDate` as const, {
                            required: 'Start date is required',
                            validate: (value: string) => {
                              if (!value) return 'Start date is required';
                              const date = new Date(value);
                              if (isNaN(date.getTime())) return 'Invalid date';
                              return true;
                            },
                          })}
                          className={getFieldError('startDate') ? 'border-destructive' : ''}
                        />
                        {getFieldError('startDate') && (
                          <p className="text-xs text-destructive">{getFieldError('startDate')}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`med-endDate-${index}`}>End Date (Optional)</Label>
                        <Input
                          id={`med-endDate-${index}`}
                          type="date"
                          {...form.register(`medications.${index}.endDate` as const, {
                            validate: (value: string | undefined) => {
                              if (value) {
                                const date = new Date(value);
                                if (isNaN(date.getTime())) return 'Invalid date';
                              }
                              return true;
                            },
                          })}
                          className={getFieldError('endDate') ? 'border-destructive' : ''}
                        />
                        {getFieldError('endDate') && (
                          <p className="text-xs text-destructive">{getFieldError('endDate')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddMedication}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>

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

EditableCurrentMedicationsCard.displayName = 'EditableCurrentMedicationsCard';

export { EditableCurrentMedicationsCard };
