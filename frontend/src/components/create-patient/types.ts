import type { PatientCreateFormData } from './schemas';

// Type for the form API - we'll use the actual form instance type
// Using a more flexible type that works with TanStack Form
// Supports nested field paths like "emergencyContact.name"
export type PatientCreateFormApi = {
  Field: (props: {
    name: string;
    children: (field: any) => React.ReactNode;
    validators?: any;
  }) => React.ReactElement;
  handleSubmit: () => void;
  Subscribe: (props: {
    selector: (state: any) => any[];
    children: (value: any[]) => React.ReactNode;
  }) => React.ReactElement;
  getFieldValue: (name: string) => any;
  setFieldValue: (name: string, value: any) => void;
  reset: (values: Partial<PatientCreateFormData>) => void;
  [key: string]: unknown;
};

// Helper type that extracts the field structure we need
// This is compatible with FieldApi from TanStack Form
// Using a more flexible type that accepts FieldApi
export type FormField<TValue = unknown> = {
  name: string;
  state: {
    value: TValue;
    meta: {
      errors: string[];
      errorMap?: Record<string, string | undefined>;
      isTouched: boolean;
      isValidating: boolean;
    };
  };
  handleChange: (value: TValue) => void;
  handleBlur: () => void;
  [key: string]: unknown; // Allow additional properties from FieldApi
};

export interface FormComponentProps {
  form: PatientCreateFormApi;
}

