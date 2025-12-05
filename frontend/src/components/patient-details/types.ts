import type { Medication, Patient } from '@/types';
import type { components } from '@/types/api';

// API types (snake_case from backend)
export type ApiPatient = components['schemas']['Patient'];
export type ApiAddress = components['schemas']['Address'];
export type ApiEmergencyContact = components['schemas']['EmergencyContact'];
export type ApiInsuranceInfo = components['schemas']['InsuranceInfo'];
export type ApiMedication = components['schemas']['Medication'];

// Union type that accepts both API format (snake_case) and frontend format (camelCase)
export type PatientDataUnion =
  | Patient // Frontend format (camelCase)
  | ApiPatient // API format (snake_case)
  | (Patient & Partial<ApiPatient>) // Mixed format
  | (ApiPatient & Partial<Patient>); // Mixed format

// Type-safe patient data extractor
export interface NormalizedPatientData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: NormalizedAddress | null;
  emergencyContact: NormalizedEmergencyContact | null;
  insurance: NormalizedInsuranceInfo | null;
  medicalInfo: NormalizedMedicalInfo | null;
  documents: Patient['documents'];
}

// Type-safe address data extractor
export interface NormalizedAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

// Type-safe emergency contact data extractor
export interface NormalizedEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string | null;
}

// Type-safe insurance info data extractor
export interface NormalizedInsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string | null;
  effectiveDate: string;
  expirationDate?: string | null;
  copay: number;
  deductible: number;
}

// Type-safe medical info data extractor
export interface NormalizedMedicalInfo {
  allergies: string[];
  conditions: string[];
  currentMedications: Medication[];
  bloodType?: string | null;
  lastVisit?: string | null;
  status: 'active' | 'inactive' | 'critical';
}

export interface PatientHeaderCardProps {
  patient: PatientDataUnion;
  medicalInfo: NormalizedMedicalInfo | null;
  onRefetch?: () => void;
}
