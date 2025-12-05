import { memo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { bloodTypes } from '@/components/constants';
import { useController } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { PatientCreateFormData } from '@/schemas/patient';
import { ControlledInput } from '@/components/ui';

interface PersonalInfoFormProps {
  control: Control<PatientCreateFormData>;
}

const PersonalInfoForm = memo(({ control }: PersonalInfoFormProps) => {
  const {
    field: bloodTypeField,
    fieldState: { error: bloodTypeError },
  } = useController({
    name: 'bloodType',
    control,
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlledInput
            name="firstName"
            control={control}
            label="First Name"
            required
          />
          <ControlledInput
            name="lastName"
            control={control}
            label="Last Name"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlledInput
            name="dateOfBirth"
            control={control}
            label="Date of Birth"
            type="date"
            required
          />
          <div className="space-y-2">
            <label htmlFor="bloodType" className="text-sm font-medium">
              Blood Type
            </label>
            <Select
              value={bloodTypeField.value || 'none'}
              onValueChange={value => {
                bloodTypeField.onChange(value === 'none' ? undefined : value);
              }}
              onOpenChange={open => {
                // Notify on blur when select closes
                if (!open) {
                  bloodTypeField.onBlur();
                }
              }}
            >
              <SelectTrigger className={bloodTypeError ? 'border-destructive' : ''}>
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
            {bloodTypeError && (
              <p className="text-xs text-destructive">{bloodTypeError.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlledInput
            name="email"
            control={control}
            label="Email"
            type="email"
            required
          />
          <ControlledInput
            name="phone"
            control={control}
            label="Phone"
            type="tel"
            required
          />
        </div>

        <ControlledInput
          name="address.street"
          control={control}
          label="Street Address"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ControlledInput
            name="address.city"
            control={control}
            label="City"
            required
          />
          <ControlledInput
            name="address.state"
            control={control}
            label="State"
            required
          />
          <ControlledInput
            name="address.zipCode"
            control={control}
            label="Zip Code"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
});

PersonalInfoForm.displayName = 'PersonalInfoForm';

export { PersonalInfoForm };
