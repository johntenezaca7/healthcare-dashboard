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
      // These are undefined initially but will be validated as numbers by the schema
      // The schema transform handles empty/undefined values before validation
      copay: undefined as unknown as number,
      deductible: undefined as unknown as number,
    },
    allergies: [],
    conditions: [],
    lastVisit: undefined,
    status: 'active',
    medications: [],
  };
}
