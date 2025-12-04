import type { PatientCreateFormData } from '../schemas';
import type { PatientCreate } from '@/hooks/mutations/Patients';

/**
 * Transforms PatientCreateFormData to PatientCreate API payload
 * Handles empty strings, undefined values, and array transformations
 */
export function transformFormDataToPatientCreate(
  formData: PatientCreateFormData
): PatientCreate {
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
    allergies: formData.allergies.length > 0 ? formData.allergies : undefined,
    conditions: formData.conditions.length > 0 ? formData.conditions : undefined,
    lastVisit: formData.lastVisit || undefined,
    status: formData.status,
    medications:
      formData.medications.length > 0
        ? formData.medications.map(med => ({
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

