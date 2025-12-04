import { useState, useEffect, memo, useMemo } from 'react';
import { Edit, Mail, Phone } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { useUpdatePatientEmergencyContact, type EmergencyContactUpdate } from '@/hooks';
import { Patient } from '@/types';
import { defaultNA } from '../constants';
import type { FormField } from './types';

interface EditableEmergencyContactCardProps {
  patientId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string | null;
  onUpdate: (updatedPatient: Patient) => void;
}

const EditableEmergencyContactCard = memo(
  ({
    patientId,
    name: initialName,
    relationship: initialRelationship,
    phone: initialPhone,
    email: initialEmail,
    onUpdate,
  }: EditableEmergencyContactCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const updateMutation = useUpdatePatientEmergencyContact();

    const defaultValues = useMemo(
      () => ({
        name: initialName,
        relationship: initialRelationship,
        phone: initialPhone,
        email: initialEmail || '',
      }),
      [initialName, initialRelationship, initialPhone, initialEmail]
    );

    const form = useForm({
      defaultValues,
      onSubmit: async ({ value }) => {
        try {
          const updateData: EmergencyContactUpdate = {
            name: value.name,
            relationship: value.relationship,
            phone: value.phone,
            email: value.email || undefined,
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
          <CardTitle>Emergency Contact</CardTitle>
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
                : 'Failed to update emergency contact'}
            </div>
          )}

          {!isEditing ? (
            <>
              {initialName || initialRelationship || initialPhone ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{initialName || defaultNA }</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship</p>
                    <p className="font-medium">{initialRelationship || defaultNA }</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{initialPhone || defaultNA }</span>
                  </div>
                  {initialEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{initialEmail}</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No emergency contact information available
                </p>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }: { value: string }) => {
                    if (!value || value.trim().length < 1) return 'Name is required';
                    return undefined;
                  },
                }}
                children={(field) => {
                  const typedField = field as unknown as FormField<string>;
                  return (
                  <div className="space-y-2">
                    <Label htmlFor={typedField.name}>Name</Label>
                    <Input
                      id={typedField.name}
                      name={typedField.name}
                      value={typedField.state.value}
                      onBlur={typedField.handleBlur}
                      onChange={e => typedField.handleChange(e.target.value)}
                      className={typedField.state.meta.errors.length > 0 ? 'border-destructive' : ''}
                    />
                    {typedField.state.meta.errors.length > 0 && (
                      <p className="text-xs text-destructive">{typedField.state.meta.errors[0]}</p>
                    )}
                  </div>
                  );
                }}
              />

              <form.Field
                name="relationship"
                validators={{
                  onChange: ({ value }: { value: string }) => {
                    if (!value || value.trim().length < 1) return 'Relationship is required';
                    return undefined;
                  },
                }}
                children={(field) => {
                  const typedField = field as unknown as FormField<string>;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={typedField.name}>Relationship</Label>
                      <Input
                        id={typedField.name}
                        name={typedField.name}
                        value={typedField.state.value}
                        onBlur={typedField.handleBlur}
                        onChange={e => typedField.handleChange(e.target.value)}
                        className={typedField.state.meta.errors.length > 0 ? 'border-destructive' : ''}
                      />
                      {typedField.state.meta.errors.length > 0 && (
                        <p className="text-xs text-destructive">{typedField.state.meta.errors[0]}</p>
                      )}
                    </div>
                  );
                }}
              />

              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }: { value: string }) => {
                    if (!value || value.trim().length < 1) return 'Phone is required';
                    return undefined;
                  },
                }}
                children={(field) => {
                  const typedField = field as unknown as FormField<string>;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={typedField.name}>Phone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id={typedField.name}
                          name={typedField.name}
                          type="tel"
                          value={typedField.state.value}
                          onBlur={typedField.handleBlur}
                          onChange={e => typedField.handleChange(e.target.value)}
                          className={typedField.state.meta.errors.length > 0 ? 'border-destructive' : ''}
                        />
                      </div>
                      {typedField.state.meta.errors.length > 0 && (
                        <p className="text-xs text-destructive">{typedField.state.meta.errors[0]}</p>
                      )}
                    </div>
                  );
                }}
              />

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }: { value: string }) => {
                    if (value && value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                      return 'Invalid email format';
                    }
                    return undefined;
                  },
                }}
                children={(field) => {
                  const typedField = field as unknown as FormField<string | undefined>;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={typedField.name}>Email (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id={typedField.name}
                          name={typedField.name}
                          type="email"
                          value={typedField.state.value || ''}
                          onBlur={typedField.handleBlur}
                          onChange={e => typedField.handleChange(e.target.value || '')}
                          className={typedField.state.meta.errors.length > 0 ? 'border-destructive' : ''}
                        />
                      </div>
                      {typedField.state.meta.errors.length > 0 && (
                        <p className="text-xs text-destructive">{typedField.state.meta.errors[0]}</p>
                      )}
                    </div>
                  );
                }}
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

EditableEmergencyContactCard.displayName = 'EditableEmergencyContactCard';

export { EditableEmergencyContactCard };
