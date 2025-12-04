import type { PatientCreateFormData } from '../schemas';

/**
 * Creates default form values for patient creation
 */
export function getDefaultPatientFormValues(): PatientCreateFormData {
  return {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    bloodType: undefined,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: undefined,
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: undefined,
      effectiveDate: '',
      expirationDate: undefined,
      copay: 0,
      deductible: 0,
    },
    allergies: [],
    conditions: [],
    lastVisit: undefined,
    status: 'active',
    medications: [],
  };
}

