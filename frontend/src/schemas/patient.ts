import { z } from 'zod';

const bloodTypeSchema = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional();

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().default('USA'),
});

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(1, 'Emergency contact phone is required'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
});

const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  prescribedBy: z.string().min(1, 'Prescribed by is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.union([z.string(), z.literal('')]).optional(),
});

const insuranceSchema = z.object({
  provider: z.string().min(1, 'Insurance provider is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  groupNumber: z.union([z.string(), z.literal('')]).optional(),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expirationDate: z.union([z.string(), z.literal('')]).optional(),
  copay: z.number().min(0, 'Copay must be >= 0'),
  deductible: z.number().min(0, 'Deductible must be >= 0'),
});

export const patientCreateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  bloodType: bloodTypeSchema,
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  insurance: insuranceSchema,
  allergies: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
  lastVisit: z.union([z.string(), z.literal('')]).optional(),
  status: z.enum(['active', 'inactive', 'critical']).default('active'),
  medications: z.array(medicationSchema).default([]),
});

export type PatientCreateFormData = z.infer<typeof patientCreateSchema>;
