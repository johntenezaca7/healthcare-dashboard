import { useState, useEffect, memo, useMemo } from 'react';
import { Edit, Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { useUpdatePatientEmergencyContact, type EmergencyContactUpdate } from '@/hooks';
import { Patient } from '@/types';
import { defaultNA } from '../constants';
import type { EmergencyContactFormData } from './types';
import { getFieldErrorFromForm as getFieldError, hasFieldErrorFromForm as hasFieldError, getFieldClassNameFromForm as getFieldClassName } from '@/utils/form';

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
      (): EmergencyContactFormData => ({
        name: initialName,
        relationship: initialRelationship,
        phone: initialPhone,
        email: initialEmail || '',
      }),
      [initialName, initialRelationship, initialPhone, initialEmail]
    );

    const form = useForm<EmergencyContactFormData>({
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

    const onSubmit = async (data: EmergencyContactFormData) => {
      try {
        const updateData: EmergencyContactUpdate = {
          name: data.name,
          relationship: data.relationship,
          phone: data.phone,
          email: data.email || undefined,
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
                : 'Failed to update emergency contact'}
            </div>
          )}

          {!isEditing ? (
            <>
              {initialName || initialRelationship || initialPhone ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{initialName || defaultNA}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship</p>
                    <p className="font-medium">{initialRelationship || defaultNA}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{initialPhone || defaultNA}</span>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...form.register('name', { required: 'Name is required' })}
                  className={getFieldClassName(form, 'name')}
                />
                {hasFieldError(form, 'name') && (
                  <p className="text-xs text-destructive">{getFieldError(form, 'name')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  {...form.register('relationship', { required: 'Relationship is required' })}
                  className={getFieldClassName(form, 'relationship')}
                />
                {hasFieldError(form, 'relationship') && (
                  <p className="text-xs text-destructive">{getFieldError(form, 'relationship')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register('phone', { required: 'Phone is required' })}
                    className={getFieldClassName(form, 'phone')}
                  />
                </div>
                {hasFieldError(form, 'phone') && (
                  <p className="text-xs text-destructive">{getFieldError(form, 'phone')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email', {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format',
                      },
                    })}
                    className={getFieldClassName(form, 'email')}
                  />
                </div>
                {hasFieldError(form, 'email') && (
                  <p className="text-xs text-destructive">{getFieldError(form, 'email')}</p>
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

EditableEmergencyContactCard.displayName = 'EditableEmergencyContactCard';

export { EditableEmergencyContactCard };
