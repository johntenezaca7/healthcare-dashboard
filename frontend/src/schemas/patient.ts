import * as yup from 'yup';

const bloodTypeSchema = yup
  .string()
  .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Invalid blood type')
  .optional();

const addressSchema = yup.object({
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('Zip code is required'),
  country: yup.string().default('USA'),
});

const emergencyContactSchema = yup.object({
  name: yup.string().required('Emergency contact name is required'),
  relationship: yup.string().required('Relationship is required'),
  phone: yup.string().required('Emergency contact phone is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
});

const medicationSchema = yup.object({
  name: yup.string().required('Medication name is required'),
  dosage: yup.string().required('Dosage is required'),
  frequency: yup.string().required('Frequency is required'),
  prescribedBy: yup.string().required('Prescribed by is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
});

const insuranceSchema = yup.object({
  provider: yup.string().required('Insurance provider is required'),
  policyNumber: yup.string().required('Policy number is required'),
  groupNumber: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
  effectiveDate: yup.string().required('Effective date is required'),
  expirationDate: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
  copay: yup
    .number()
    .transform((value) => (value === '' || value == null ? undefined : value))
    .min(0, 'Copay must be >= 0')
    .required('Copay is required'),
  deductible: yup
    .number()
    .transform((value) => (value === '' || value == null ? undefined : value))
    .min(0, 'Deductible must be >= 0')
    .required('Deductible is required'),
});

export const patientCreateSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  phone: yup.string().required('Phone is required'),
  bloodType: bloodTypeSchema,
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  insurance: insuranceSchema,
  allergies: yup.array().of(yup.string()).default([]),
  conditions: yup.array().of(yup.string()).default([]),
  lastVisit: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
  status: yup.string().oneOf(['active', 'inactive', 'critical']).default('active'),
  medications: yup.array().of(medicationSchema).default([]),
});

export type PatientCreateFormData = yup.InferType<typeof patientCreateSchema>;
