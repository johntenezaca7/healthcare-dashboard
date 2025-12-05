import { useMemo } from 'react';

import type {
  Address,
  EmergencyContact,
  InsuranceInfo,
  MedicalInfo,
  Medication,
  Patient,
} from '@/types';

import type {
  ApiAddress,
  ApiEmergencyContact,
  ApiInsuranceInfo,
  ApiMedication,
  ApiPatient,
  NormalizedAddress,
  NormalizedEmergencyContact,
  NormalizedInsuranceInfo,
  NormalizedMedicalInfo,
  NormalizedPatientData,
  PatientDataUnion,
} from './types';
import type { MedicalInfoData, PatientData } from './types';

// Helper to get string value from either camelCase or snake_case
const getStringField = (obj: unknown, camelKey: string, snakeKey: string): string => {
  const o = obj as Record<string, unknown>;
  return (o[camelKey] as string | undefined) || (o[snakeKey] as string | undefined) || '';
};

// Legacy helper functions for backward compatibility with tests
export const getPatientField = (
  patient: PatientData | Record<string, unknown>,
  camelCaseField: keyof PatientData,
  snakeCaseField?: string
): string => {
  const patientData = patient as PatientData & Record<string, unknown>;
  const camelValue = patientData[camelCaseField] as string | undefined;
  const snakeValue = snakeCaseField
    ? (patientData[snakeCaseField] as string | undefined)
    : undefined;
  return camelValue || snakeValue || '';
};

export const getMedicalInfoField = (
  medicalInfo: MedicalInfoData | Record<string, unknown>,
  field: keyof MedicalInfoData
): string => {
  const medicalInfoData = medicalInfo as MedicalInfoData & Record<string, unknown>;
  return (medicalInfoData[field] as string | undefined) || '';
};

export const getPatientId = (patient: PatientData | Record<string, unknown>): string => {
  const patientData = patient as PatientData & Record<string, unknown>;
  const idRaw = patientData.id;
  return idRaw !== undefined ? String(idRaw) : '';
};

// Helper to get optional string value
const getOptionalStringField = (
  obj: unknown,
  camelKey: string,
  snakeKey: string
): string | null | undefined => {
  const o = obj as Record<string, unknown>;
  return (o[camelKey] as string | null | undefined) ?? (o[snakeKey] as string | null | undefined);
};

// Helper to get number value
const getNumberField = (obj: unknown, camelKey: string, snakeKey: string): number => {
  const o = obj as Record<string, unknown>;
  return (o[camelKey] as number | undefined) ?? (o[snakeKey] as number | undefined) ?? 0;
};

// Normalize address from either format
export const normalizeAddress = (address: unknown): NormalizedAddress | null => {
  if (!address) return null;
  const addr = address as Address | ApiAddress | Record<string, unknown>;

  const street = getStringField(addr, 'street', 'street');
  const city = getStringField(addr, 'city', 'city');
  const state = getStringField(addr, 'state', 'state');
  const zipCode = getStringField(addr, 'zipCode', 'zip_code');
  const country = getOptionalStringField(addr, 'country', 'country') || undefined;

  if (!street && !city && !state && !zipCode) return null;

  return { street, city, state, zipCode, country };
};

// Normalize emergency contact from either format
export const normalizeEmergencyContact = (contact: unknown): NormalizedEmergencyContact | null => {
  if (!contact) return null;
  const ec = contact as EmergencyContact | ApiEmergencyContact | Record<string, unknown>;

  const name = getStringField(ec, 'name', 'name');
  const relationship = getStringField(ec, 'relationship', 'relationship_type');
  const phone = getStringField(ec, 'phone', 'phone');
  const email = getOptionalStringField(ec, 'email', 'email');

  if (!name && !relationship && !phone) return null;

  return { name, relationship, phone, email: email ?? null };
};

// Normalize insurance info from either format
export const normalizeInsuranceInfo = (insurance: unknown): NormalizedInsuranceInfo | null => {
  if (!insurance) return null;
  const ins = insurance as InsuranceInfo | ApiInsuranceInfo | Record<string, unknown>;

  const provider = getStringField(ins, 'provider', 'provider');
  const policyNumber = getStringField(ins, 'policyNumber', 'policy_number');
  const groupNumber = getOptionalStringField(ins, 'groupNumber', 'group_number');
  const effectiveDate = getStringField(ins, 'effectiveDate', 'effective_date');
  const expirationDate = getOptionalStringField(ins, 'expirationDate', 'expiration_date');
  const copay = getNumberField(ins, 'copay', 'copay');
  const deductible = getNumberField(ins, 'deductible', 'deductible');

  if (!provider && !policyNumber) return null;

  return {
    provider,
    policyNumber,
    groupNumber: groupNumber ?? null,
    effectiveDate,
    expirationDate: expirationDate ?? null,
    copay,
    deductible,
  };
};

// Normalize medication from either format
const normalizeMedication = (med: unknown): Medication | null => {
  if (!med) return null;
  const medication = med as Medication | ApiMedication | Record<string, unknown>;

  const name = getStringField(medication, 'name', 'name');
  const dosage = getStringField(medication, 'dosage', 'dosage');
  const frequency = getStringField(medication, 'frequency', 'frequency');
  const prescribedBy = getStringField(medication, 'prescribedBy', 'prescribing_doctor');
  const startDate = getStringField(medication, 'startDate', 'start_date');
  const endDate = getOptionalStringField(medication, 'endDate', 'end_date');
  const id = getStringField(medication, 'id', 'id');
  const isActive = (medication as Record<string, unknown>).isActive !== false;

  if (!name || !dosage || !frequency) return null;

  return {
    id,
    name,
    dosage,
    frequency,
    prescribedBy,
    startDate,
    endDate: endDate ?? null,
    isActive,
  };
};

// Normalize medical info from either format
export const normalizeMedicalInfo = (medicalInfo: unknown): NormalizedMedicalInfo | null => {
  if (!medicalInfo) return null;
  const mi = medicalInfo as MedicalInfo | Record<string, unknown>;

  const allergies = Array.isArray(mi.allergies)
    ? (mi.allergies as string[])
    : Array.isArray((mi as Record<string, unknown>).allergies)
      ? ((mi as Record<string, unknown>).allergies as string[])
      : [];

  const conditions = Array.isArray(mi.conditions)
    ? (mi.conditions as string[])
    : Array.isArray((mi as Record<string, unknown>).conditions)
      ? ((mi as Record<string, unknown>).conditions as string[])
      : [];

  const miRecord = mi as Record<string, unknown>;
  const currentMedicationsRaw =
    (miRecord.currentMedications as Medication[] | undefined) ||
    (miRecord.current_medications as ApiMedication[] | undefined) ||
    (miRecord.medications as ApiMedication[] | undefined) ||
    [];

  const currentMedications = currentMedicationsRaw
    .map(normalizeMedication)
    .filter((m): m is Medication => m !== null);

  const bloodType = getOptionalStringField(mi, 'bloodType', 'blood_type');
  const lastVisit = getOptionalStringField(mi, 'lastVisit', 'last_visit');
  const status = (getStringField(mi, 'status', 'status') || 'active') as
    | 'active'
    | 'inactive'
    | 'critical';

  return {
    allergies,
    conditions,
    currentMedications,
    bloodType: bloodType ?? null,
    lastVisit: lastVisit ?? null,
    status,
  };
};

// Normalize full patient data from either format
export const normalizePatientData = (patient: PatientDataUnion): NormalizedPatientData => {
  const p = patient as Patient | ApiPatient | Record<string, unknown>;

  const id = String(p.id || '');
  const firstName = getStringField(p, 'firstName', 'first_name');
  const lastName = getStringField(p, 'lastName', 'last_name');
  const dateOfBirth = getStringField(p, 'dateOfBirth', 'date_of_birth');
  const email = getStringField(p, 'email', 'email');
  const phone = getStringField(p, 'phone', 'phone');

  const pRecord = p as Record<string, unknown>;

  // Handle addresses - API returns array, frontend expects single object
  const addressesRaw = (pRecord.addresses as ApiAddress[] | undefined) || [];
  const addressRaw = (pRecord.address as Address | undefined) || addressesRaw[0];
  const address = normalizeAddress(addressRaw);

  // Handle emergency contacts - API returns array, frontend expects single object
  const emergencyContactsRaw =
    (pRecord.emergency_contacts as ApiEmergencyContact[] | undefined) || [];
  const emergencyContactRaw =
    (pRecord.emergencyContact as EmergencyContact | undefined) || emergencyContactsRaw[0];
  const emergencyContact = normalizeEmergencyContact(emergencyContactRaw);

  // Handle insurance info - API returns array, frontend expects single object
  const insuranceInfoRaw = (pRecord.insurance_info as ApiInsuranceInfo[] | undefined) || [];
  const insuranceRaw = (pRecord.insurance as InsuranceInfo | undefined) || insuranceInfoRaw[0];
  const insurance = normalizeInsuranceInfo(insuranceRaw);

  // Handle medical info
  const medicalInfoRaw =
    (pRecord.medicalInfo as MedicalInfo | undefined) ||
    (pRecord.medical_info as Record<string, unknown> | undefined);
  const medicalInfo = normalizeMedicalInfo(medicalInfoRaw);

  // Handle documents
  const documentsRaw =
    (p.documents as Patient['documents']) ||
    ((p as Record<string, unknown>).documents as Patient['documents']) ||
    [];
  const documents = Array.isArray(documentsRaw) ? documentsRaw : [];

  return {
    id,
    firstName,
    lastName,
    dateOfBirth,
    email,
    phone,
    address,
    emergencyContact,
    insurance,
    medicalInfo: medicalInfo || null,
    documents,
  };
};

export const getStatusVariant = (status: string): 'success' | 'destructive' | 'secondary' => {
  if (status === 'active') {
    return 'success';
  }
  if (status === 'critical') {
    return 'destructive';
  }
  return 'secondary';
};

export const usePatientHeaderData = (
  patient: PatientDataUnion,
  medicalInfo: NormalizedMedicalInfo | null
) => {
  return useMemo(() => {
    const normalized = normalizePatientData(patient);
    const statusValue = medicalInfo?.status || 'active';
    const statusVariant = getStatusVariant(statusValue);
    const initials =
      `${normalized.firstName?.[0] || ''}${normalized.lastName?.[0] || ''}`.toUpperCase();

    // Extract createdAt and updatedAt from patient (handle both formats)
    const p = patient as Patient | ApiPatient | Record<string, unknown>;
    const createdAt = getStringField(p, 'createdAt', 'created_at');
    const updatedAt = getStringField(p, 'updatedAt', 'updated_at');

    return {
      firstName: normalized.firstName,
      lastName: normalized.lastName,
      initials,
      dateOfBirth: normalized.dateOfBirth,
      createdAt,
      updatedAt,
      email: normalized.email,
      phone: normalized.phone,
      patientId: normalized.id,
      status: statusValue,
      statusVariant,
    };
  }, [patient, medicalInfo]);
};
