import { useState, useEffect, memo, useMemo } from 'react';
import { Edit, Plus, Trash2, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { useForm } from '@tanstack/react-form';
import { useUpdatePatientMedications, type MedicationsUpdate } from '@/hooks';
import { Patient } from '@/types';
import { formatDate } from '@/utils/date';
import { extractDatePart } from '../patients-list/utils';
import type { FormField } from './types';

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
    const [validationErrors, setValidationErrors] = useState<Record<string, Record<string, string>>>({});
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

    type MedicationsFormData = {
      medications: Array<{
        id: string;
        name: string;
        dosage: string;
        frequency: string;
        prescribedBy: string;
        startDate: string;
        endDate: string;
        isActive: boolean;
      }>;
    };

    const form = useForm({
      defaultValues: {
        medications: normalizeMedications,
      },
      onSubmit: async ({ value }) => {
        // Validate all medications
        const errors: Record<string, Record<string, string>> = {};
        value.medications.forEach((medication, index) => {
          const medErrors: Record<string, string> = {};
          if (!medication.name.trim()) medErrors.name = 'Name is required';
          if (!medication.dosage.trim()) medErrors.dosage = 'Dosage is required';
          if (!medication.frequency.trim()) medErrors.frequency = 'Frequency is required';
          if (!medication.prescribedBy.trim()) medErrors.prescribedBy = 'Prescribed by is required';
          if (!medication.startDate) {
            medErrors.startDate = 'Start date is required';
          } else {
            const date = new Date(medication.startDate);
            if (isNaN(date.getTime())) medErrors.startDate = 'Invalid date';
          }
          if (medication.endDate) {
            const date = new Date(medication.endDate);
            if (isNaN(date.getTime())) medErrors.endDate = 'Invalid date';
          }
          if (Object.keys(medErrors).length > 0) {
            errors[index.toString()] = medErrors;
          }
        });

        if (Object.keys(errors).length > 0) {
          // Store validation errors in component state
          setValidationErrors(errors);
          return;
        }
        
        // Clear validation errors on successful validation
        setValidationErrors({});

        try {
          const activeMedications = value.medications.filter(med => med.isActive);

          const updateData: MedicationsUpdate = {
            medications: activeMedications.map(med => ({
              id: med.id.startsWith('temp-') ? undefined : med.id,
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
      },
    });

    // Reset form when initial values change and not editing
    useEffect(() => {
      if (!isEditing) {
        form.reset({ medications: normalizeMedications });
      }
    }, [normalizeMedications, isEditing, form]);

    const handleCancel = () => {
      form.reset({ medications: normalizeMedications });
      setValidationErrors({});
      setIsEditing(false);
    };

    const handleAddMedication = () => {
      const currentMedications = form.getFieldValue('medications') || [];
      const newMedication = {
        id: `temp-${Date.now()}`,
        name: '',
        dosage: '',
        frequency: '',
        prescribedBy: '',
        startDate: '',
        endDate: '',
        isActive: true,
      };
      form.setFieldValue('medications', [...currentMedications, newMedication]);
    };

    const handleRemoveMedication = (index: number) => {
      const currentMedications = form.getFieldValue('medications') || [];
      const filtered = currentMedications.filter((_, i: number) => i !== index);
      form.setFieldValue('medications', filtered);
      // Remove validation errors for this medication
      const newErrors = { ...validationErrors };
      delete newErrors[index.toString()];
      setValidationErrors(newErrors);
    };

    const handleMedicationChange = (
      index: number,
      field: keyof Medication,
      value: string | boolean | undefined
    ) => {
      const currentMedications = form.getFieldValue('medications') || [];
      const updated = currentMedications.map((med, i: number) => {
        if (i === index) {
          return { ...med, [field]: value };
        }
        return med;
      });
      form.setFieldValue('medications', updated);
      // Clear errors for this field
      if (validationErrors[index.toString()]) {
        const newErrors = { ...validationErrors };
        delete newErrors[index.toString()][field];
        if (Object.keys(newErrors[index.toString()]).length === 0) {
          delete newErrors[index.toString()];
        }
        setValidationErrors(newErrors);
      }
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
            <form.Field
              name="medications"
              children={(field) => {
                const typedField = field as unknown as FormField<Medication[]>;
                const medications = typedField.state.value || [];
                return (
                  <div className="space-y-6">
                    {medications.map((medication: Medication, index: number) => {
                      const getFieldError = (fieldName: string) => {
                        return validationErrors[index.toString()]?.[fieldName] || '';
                      };

                      return (
                        <div key={medication.id || index} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Medication {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveMedication(index)}
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
                                value={medication.name}
                                onChange={e => handleMedicationChange(index, 'name', e.target.value)}
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
                                value={medication.dosage}
                                onChange={e => handleMedicationChange(index, 'dosage', e.target.value)}
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
                                value={medication.frequency}
                                onChange={e =>
                                  handleMedicationChange(index, 'frequency', e.target.value)
                                }
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
                                value={medication.prescribedBy}
                                onChange={e =>
                                  handleMedicationChange(index, 'prescribedBy', e.target.value)
                                }
                                className={getFieldError('prescribedBy') ? 'border-destructive' : ''}
                              />
                              {getFieldError('prescribedBy') && (
                                <p className="text-xs text-destructive">
                                  {getFieldError('prescribedBy')}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`med-startDate-${index}`}>Start Date</Label>
                              <Input
                                id={`med-startDate-${index}`}
                                type="date"
                                value={extractDatePart(medication.startDate)}
                                onChange={e =>
                                  handleMedicationChange(index, 'startDate', e.target.value)
                                }
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
                                value={extractDatePart(medication.endDate)}
                                onChange={e =>
                                  handleMedicationChange(index, 'endDate', e.target.value || '')
                                }
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
                  </div>
                );
              }}
            />
          )}
        </CardContent>
      </Card>
    );
  }
);

EditableCurrentMedicationsCard.displayName = 'EditableCurrentMedicationsCard';

export { EditableCurrentMedicationsCard };
