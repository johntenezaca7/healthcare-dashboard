import type { UseFormReturn } from 'react-hook-form';

import type { PatientCreateFormData } from './schemas';

// Type for the form API - matches what useForm returns from react-hook-form
export type PatientCreateFormApi = UseFormReturn<PatientCreateFormData>;

export interface FormComponentProps {
  form: PatientCreateFormApi;
}
