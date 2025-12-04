import { useState, useEffect, memo, useMemo } from 'react';
import { Edit, Mail, Phone, MapPin } from 'lucide-react';
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
import { useForm } from '@tanstack/react-form';
import { useUpdatePatientPersonalInfo, type PersonalInfoUpdate } from '@/hooks';
import { Patient } from '@/types';
import { formatDate, calculateAge } from '@/utils/date';
import { bloodTypes, defaultNA } from '../constants';
import { extractDatePart } from '../patients-list/utils';
import type { FormField } from './types';
import { getFieldError, hasFieldError, getFieldClassName } from './utils';

interface EditablePersonalInfoCardProps {
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  bloodType?: string | null;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    zip_code?: string;
    country?: string;
  };
  onUpdate: (updatedPatient: Patient) => void;
}

const EditablePersonalInfoCard = memo(
  ({
    patientId,
    firstName: initialFirstName,
    lastName: initialLastName,
    dateOfBirth: initialDateOfBirth,
    email: initialEmail,
    phone: initialPhone,
    bloodType: initialBloodType,
    address: initialAddress,
    onUpdate,
  }: EditablePersonalInfoCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const updateMutation = useUpdatePatientPersonalInfo();

    const defaultValues = useMemo(
      () => ({
        firstName: initialFirstName,
        lastName: initialLastName,
        dateOfBirth: extractDatePart(initialDateOfBirth),
        email: initialEmail,
        phone: initialPhone,
        bloodType: initialBloodType || undefined,
        address: {
          street: initialAddress?.street || '',
          city: initialAddress?.city || '',
          state: initialAddress?.state || '',
          zipCode: initialAddress?.zipCode || initialAddress?.zip_code || '',
          country: initialAddress?.country || 'USA',
        },
      }),
      [
        initialFirstName,
        initialLastName,
        initialDateOfBirth,
        initialEmail,
        initialPhone,
        initialBloodType,
        initialAddress,
      ]
    );

    const form = useForm({
      defaultValues,
      onSubmit: async ({ value }) => {
        try {
          const updateData: PersonalInfoUpdate = {
            firstName: value.firstName,
            lastName: value.lastName,
            dateOfBirth: value.dateOfBirth,
            email: value.email,
            phone: value.phone,
            bloodType: value.bloodType,
            address: {
              street: value.address.street,
              city: value.address.city,
              state: value.address.state,
              zipCode: value.address.zipCode,
              country: value.address.country,
            },
          };

          await updateMutation.mutateAsync({ id: patientId, data: updateData });
          onUpdate({} as Patient);
          setIsEditing(false);
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
          <CardTitle>Personal Information</CardTitle>
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
                : 'Failed to update patient information'}
            </div>
          )}

          {!isEditing ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{formatDate(initialDateOfBirth)}</p>
                  <p className="text-sm text-muted-foreground">
                    ({calculateAge(initialDateOfBirth)} years old)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="font-medium">{initialBloodType || defaultNA }</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{initialEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{initialPhone}</span>
              </div>
              {initialAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{initialAddress.street || defaultNA }</p>
                    <p className="text-sm text-muted-foreground">
                      {initialAddress.city || ''}, {initialAddress.state || ''}{' '}
                      {initialAddress.zipCode || initialAddress.zip_code || ''}
                    </p>
                    {initialAddress.country && (
                      <p className="text-sm text-muted-foreground">{initialAddress.country}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field
                  name="firstName"
                  validators={{
                    onChange: ({ value }: { value: string }) => {
                      if (!value || value.trim().length < 1) return 'First name is required';
                      return undefined;
                    },
                  }}
                  children={(field) => {
                    const typedField = field as FormField<string>;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor={typedField.name}>First Name</Label>
                        <Input
                          id={typedField.name}
                          name={typedField.name}
                          value={typedField.state.value}
                          onBlur={typedField.handleBlur}
                          onChange={e => typedField.handleChange(e.target.value)}
                          className={getFieldClassName(typedField)}
                        />
                        {hasFieldError(typedField) && (
                          <p className="text-xs text-destructive">{getFieldError(typedField)}</p>
                        )}
                      </div>
                    );
                  }}
                />
                <form.Field
                  name="lastName"
                  validators={{
                    onChange: ({ value }: { value: string }) => {
                      if (!value || value.trim().length < 1) return 'Last name is required';
                      return undefined;
                    },
                  }}
                  children={(field) => {
                    const typedField = field as FormField<string>;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor={typedField.name}>Last Name</Label>
                        <Input
                          id={typedField.name}
                          name={typedField.name}
                          value={typedField.state.value}
                          onBlur={typedField.handleBlur}
                          onChange={e => typedField.handleChange(e.target.value)}
                          className={getFieldClassName(typedField)}
                        />
                        {hasFieldError(typedField) && (
                          <p className="text-xs text-destructive">{getFieldError(typedField)}</p>
                        )}
                      </div>
                    );
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field
                  name="dateOfBirth"
                  validators={{
                    onChange: ({ value }: { value: string }) => {
                      if (!value || value.length < 1) return 'Date of birth is required';
                      const date = new Date(value);
                      if (isNaN(date.getTime())) return 'Invalid date';
                      return undefined;
                    },
                  }}
                  children={(field) => {
                    const typedField = field as FormField<string>;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor={typedField.name}>Date of Birth</Label>
                        <Input
                          id={typedField.name}
                          name={typedField.name}
                          type="date"
                          value={typedField.state.value}
                          onBlur={typedField.handleBlur}
                          onChange={e => typedField.handleChange(e.target.value)}
                          className={getFieldClassName(typedField)}
                        />
                        {hasFieldError(typedField) && (
                          <p className="text-xs text-destructive">{getFieldError(typedField)}</p>
                        )}
                      </div>
                    );
                  }}
                />
                <form.Field
                  name="bloodType"
                  children={(field) => {
                    const typedField = field as FormField<string | undefined>;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor={typedField.name}>Blood Type</Label>
                        <Select
                          value={typedField.state.value || 'none'}
                          onValueChange={value => typedField.handleChange(value === 'none' ? undefined : value)}
                        >
                          <SelectTrigger id={typedField.name}>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {bloodTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  }}
                />
              </div>

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }: { value: string }) => {
                    if (!value || value.trim().length < 1) return 'Email is required';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
                    return undefined;
                  },
                }}
                children={(field: FormField<string>) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        className={getFieldClassName(field)}
                      />
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }: { value: string }) => {
                    if (!value || value.trim().length < 1) return 'Phone is required';
                    return undefined;
                  },
                }}
                children={(field: FormField<string>) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        className={getFieldClassName(field)}
                      />
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              />

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-semibold">Address</Label>
                </div>

                <form.Field
                  name="address.street"
                  validators={{
                    onChange: () => {
                      return undefined;
                    },
                  }}
                  children={(field: FormField<string>) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Street</Label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <form.Field
                    name="address.city"
                    validators={{
                      onChange: () => {
                        return undefined;
                      },
                    }}
                    children={(field: FormField<string>) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>City</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          className={getFieldClassName(field)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="address.state"
                    validators={{
                      onChange: () => {
                        return undefined;
                      },
                    }}
                    children={(field: FormField<string>) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>State</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          className={getFieldClassName(field)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <form.Field
                    name="address.zipCode"
                    validators={{
                      onChange: () => {
                        return undefined;
                      },
                    }}
                    children={(field: FormField<string>) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Zip Code</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          className={getFieldClassName(field)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="address.country"
                    children={(field: FormField<string>) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Country</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                        />
                      </div>
                    )}
                  />
                </div>
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

EditablePersonalInfoCard.displayName = 'EditablePersonalInfoCard';

export { EditablePersonalInfoCard };
