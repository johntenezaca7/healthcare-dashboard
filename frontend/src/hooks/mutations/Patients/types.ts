export interface PersonalInfoUpdate {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  bloodType?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  ifUnmodifiedSince?: string; // ISO timestamp for conflict detection
}

export interface EmergencyContactUpdate {
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
}

export interface InsuranceInfoUpdate {
  provider?: string;
  policyNumber?: string;
  groupNumber?: string;
  effectiveDate?: string;
  expirationDate?: string;
  copay?: number;
  deductible?: number;
}

export interface MedicalInfoUpdate {
  allergies?: string[];
  conditions?: string[];
  lastVisit?: string;
}

export interface MedicationUpdate {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
}

export interface MedicationsUpdate {
  medications: MedicationUpdate[];
}

export interface PatientCreate {
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
    country?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    effectiveDate: string;
    expirationDate?: string;
    copay: number;
    deductible: number;
  };
  allergies?: string[];
  conditions?: string[];
  lastVisit?: string;
  status?: 'active' | 'inactive' | 'critical';
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    startDate: string;
    endDate?: string;
  }>;
}
