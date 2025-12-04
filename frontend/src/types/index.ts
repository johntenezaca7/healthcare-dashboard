export type { components, paths } from './api';
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string | null;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string | null;
  effectiveDate: string;
  expirationDate?: string | null;
  copay: number;
  deductible: number;
}

export interface Document {
  id: string;
  type: 'medical_record' | 'insurance_card' | 'photo_id' | 'test_result' | 'other';
  name: string;
  uploadDate: string;
  fileSize: number;
  mimeType: string;
  url: string;
}

export interface MedicalInfo {
  allergies: string[];
  currentMedications: Medication[];
  conditions: string[];
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  lastVisit?: string;
  status: 'active' | 'inactive' | 'critical';
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: Address;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
  insurance: InsuranceInfo;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface PatientListItem {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'critical';
  lastVisit?: string | null;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null;
  insuranceProvider: string;
}

export interface PaginatedPatients {
  items: PatientListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
