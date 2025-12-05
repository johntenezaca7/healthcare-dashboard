import type { PatientCreate } from '@/hooks/mutations/Patients';

import type { PatientCreateFormData } from '../schemas';

/**
 * Transforms PatientCreateFormData to PatientCreate API payload
 * Handles empty strings, undefined values, and array transformations
 */
export function transformFormDataToPatientCreate(formData: PatientCreateFormData): PatientCreate {
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    dateOfBirth: formData.dateOfBirth,
    email: formData.email,
    phone: formData.phone,
    bloodType: formData.bloodType,
    address: {
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      zipCode: formData.address.zipCode,
      country: formData.address.country,
    },
    emergencyContact: {
      name: formData.emergencyContact.name,
      relationship: formData.emergencyContact.relationship,
      phone: formData.emergencyContact.phone,
      email: formData.emergencyContact.email || undefined,
    },
    insurance: {
      provider: formData.insurance.provider,
      policyNumber: formData.insurance.policyNumber,
      groupNumber: formData.insurance.groupNumber || undefined,
      effectiveDate: formData.insurance.effectiveDate,
      expirationDate: formData.insurance.expirationDate || undefined,
      copay: formData.insurance.copay,
      deductible: formData.insurance.deductible,
    },
    allergies:
      formData.allergies && formData.allergies.length > 0
        ? formData.allergies.filter((a): a is string => typeof a === 'string')
        : undefined,
    conditions:
      formData.conditions && formData.conditions.length > 0
        ? formData.conditions.filter((c): c is string => typeof c === 'string')
        : undefined,
    lastVisit: formData.lastVisit || undefined,
    status: formData.status,
    medications:
      formData.medications.length > 0
        ? formData.medications.map((med: PatientCreateFormData['medications'][0]) => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            prescribedBy: med.prescribedBy,
            startDate: med.startDate,
            endDate: med.endDate || undefined,
          }))
        : undefined,
  };
}
