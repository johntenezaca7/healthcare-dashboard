import { memo, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, MapPin, Phone } from 'lucide-react';

import { Card, CardContent, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import { type PersonalInfoUpdate, useUpdatePatientPersonalInfo } from '@/hooks';
import { calculateAge, formatDate } from '@/utils/date';
import {
  getFieldClassNameFromForm as getFieldClassName,
  getFieldErrorFromForm as getFieldError,
  hasFieldErrorFromForm as hasFieldError,
} from '@/utils/form';

import { bloodTypes, defaultNA } from '../constants';
import { extractDatePart } from '../patients-list/utils';
import { EditableCardHeader, MutationErrorBanner } from './components';
import { useEditableCard } from './hooks';
import type { PersonalInfoFormData } from './types';

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
  onUpdate: () => void;
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
    const updateMutation = useUpdatePatientPersonalInfo();

    const defaultValues = useMemo(
      (): PersonalInfoFormData => ({
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

    const form = useForm<PersonalInfoFormData>({
      defaultValues,
      mode: 'onChange',
    });

    const { isEditing, handleCancel, handleEdit, handleSuccess } = useEditableCard(
      defaultValues,
      form,
      onUpdate
    );

    const onSubmit = async (data: PersonalInfoFormData) => {
      try {
        const updateData: PersonalInfoUpdate = {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          email: data.email,
          phone: data.phone,
          bloodType: data.bloodType,
          address: {
            street: data.address.street,
            city: data.address.city,
            state: data.address.state,
            zipCode: data.address.zipCode,
            country: data.address.country,
          },
        };

        await updateMutation.mutateAsync({ id: patientId, data: updateData });
        handleSuccess();
      } catch (err) {
        // Error is handled by mutation
      }
    };

    return (
      <Card>
        <EditableCardHeader
          title="Personal Information"
          isEditing={isEditing}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSubmit={form.handleSubmit(onSubmit)}
          isSubmitting={updateMutation.isPending}
          isValid={form.formState.isValid && !form.formState.isSubmitting}
        />
        <CardContent className="space-y-4">
          <MutationErrorBanner
            error={updateMutation.error}
            fallbackMessage="Failed to update patient information"
          />

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
                  <p className="font-medium">{initialBloodType || defaultNA}</p>
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
                    <p className="font-medium">{initialAddress.street || defaultNA}</p>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...form.register('firstName', { required: 'First name is required' })}
                    className={getFieldClassName(form, 'firstName')}
                  />
                  {hasFieldError(form, 'firstName') && (
                    <p className="text-xs text-destructive">{getFieldError(form, 'firstName')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...form.register('lastName', { required: 'Last name is required' })}
                    className={getFieldClassName(form, 'lastName')}
                  />
                  {hasFieldError(form, 'lastName') && (
                    <p className="text-xs text-destructive">{getFieldError(form, 'lastName')}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...form.register('dateOfBirth', { required: 'Date of birth is required' })}
                    className={getFieldClassName(form, 'dateOfBirth')}
                  />
                  {hasFieldError(form, 'dateOfBirth') && (
                    <p className="text-xs text-destructive">{getFieldError(form, 'dateOfBirth')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select
                    value={form.watch('bloodType') || 'none'}
                    onValueChange={value =>
                      form.setValue('bloodType', value === 'none' ? undefined : value)
                    }
                  >
                    <SelectTrigger id="bloodType">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email', {
                      required: 'Email is required',
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

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-semibold">Address</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.street">Street</Label>
                  <Input
                    id="address.street"
                    {...form.register('address.street')}
                    className={getFieldClassName(form, 'address.street')}
                  />
                  {hasFieldError(form, 'address.street') && (
                    <p className="text-xs text-destructive">
                      {getFieldError(form, 'address.street')}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.city">City</Label>
                    <Input
                      id="address.city"
                      {...form.register('address.city')}
                      className={getFieldClassName(form, 'address.city')}
                    />
                    {hasFieldError(form, 'address.city') && (
                      <p className="text-xs text-destructive">
                        {getFieldError(form, 'address.city')}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address.state">State</Label>
                    <Input
                      id="address.state"
                      {...form.register('address.state')}
                      className={getFieldClassName(form, 'address.state')}
                    />
                    {hasFieldError(form, 'address.state') && (
                      <p className="text-xs text-destructive">
                        {getFieldError(form, 'address.state')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.zipCode">Zip Code</Label>
                    <Input
                      id="address.zipCode"
                      {...form.register('address.zipCode')}
                      className={getFieldClassName(form, 'address.zipCode')}
                    />
                    {hasFieldError(form, 'address.zipCode') && (
                      <p className="text-xs text-destructive">
                        {getFieldError(form, 'address.zipCode')}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address.country">Country</Label>
                    <Input id="address.country" {...form.register('address.country')} />
                  </div>
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

EditablePersonalInfoCard.displayName = 'EditablePersonalInfoCard';

export { EditablePersonalInfoCard };
