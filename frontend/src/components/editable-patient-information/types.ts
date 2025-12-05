import type { FieldValues, UseFormReturn } from 'react-hook-form';

import type {
  EmergencyContactUpdate,
  InsuranceInfoUpdate,
  MedicalInfoUpdate,
  MedicationUpdate,
} from '@/hooks/mutations/Patients';

export type PersonalInfoFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  bloodType?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};

export type EmergencyContactFormData = Required<EmergencyContactUpdate>;

export type InsuranceInfoFormData = Omit<InsuranceInfoUpdate, 'copay' | 'deductible'> & {
  copay: string;
  deductible: string;
};

export type MedicalInfoFormData = MedicalInfoUpdate & {
  newAllergy: string;
  newCondition: string;
};

export type MedicationFormData = MedicationUpdate & {
  isActive?: boolean;
};

export type MedicationsFormData = {
  medications: MedicationFormData[];
};

// Generic type for editable patient form API - matches what useForm returns from react-hook-form
export type EditablePatientFormApi<TFormData extends FieldValues = FieldValues> =
  UseFormReturn<TFormData>;

export interface FormComponentProps<TFormData extends FieldValues = FieldValues> {
  form: EditablePatientFormApi<TFormData>;
}
