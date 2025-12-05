import type { FetchPatientsParams } from '@/hooks/queries';

import { PatientListItem } from '@/types';

import { bloodTypes, lastVisitValues, statuses, statusValues } from '../constants';
import type { ArrayFilterValue, FilterValue } from './utils/types';
import type { BloodTypes, Statuses } from './types';

export function getPatientData(
  patient: PatientListItem | Record<string, unknown>
): PatientListItem {
  const patientAny = patient as PatientListItem & Record<string, unknown>;

  const getString = (value: unknown, fallback: string = ''): string => {
    return typeof value === 'string' ? value : fallback;
  };

  const getStatus = (value: unknown): Statuses => {
    if (typeof value === 'string' && statuses.includes(value as Statuses)) {
      return value as Statuses;
    }
    return 'active';
  };

  const getBloodType = (value: unknown): BloodTypes | null => {
    if (typeof value === 'string' && (bloodTypes as readonly string[]).includes(value)) {
      return value as BloodTypes;
    }
    return null;
  };

  return {
    id: getString(patientAny.id),
    firstName: getString(patientAny.firstName || patientAny.first_name),
    lastName: getString(patientAny.lastName || patientAny.last_name),
    dateOfBirth: getString(patientAny.dateOfBirth || patientAny.date_of_birth),
    email: getString(patientAny.email),
    phone: getString(patientAny.phone),
    status: getStatus(patientAny.status),
    lastVisit:
      typeof patientAny.lastVisit === 'string'
        ? patientAny.lastVisit
        : typeof patientAny.last_visit === 'string'
          ? patientAny.last_visit
          : null,
    bloodType: getBloodType(patientAny.bloodType || patientAny.blood_type),
    insuranceProvider: getString(patientAny.insuranceProvider || patientAny.insurance_provider),
  };
}

export function normalizeFilterValues(filters: Partial<FetchPatientsParams>) {
  const normalizeArray = (value: FilterValue): ArrayFilterValue => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.length > 0 ? value : undefined;
    return [value];
  };

  return {
    insuranceProvider: normalizeArray(filters.insuranceProvider),
    currentMedications: normalizeArray(filters.currentMedications),
    conditions: normalizeArray(filters.conditions),
    allergies: normalizeArray(filters.allergies),
    bloodType: normalizeArray(filters.bloodType),
    lastVisit: normalizeArray(filters.lastVisit),
    status: normalizeArray(filters.status),
  };
}

export function hasActiveFilters(
  filters: Partial<FetchPatientsParams>,
  searchInput: string
): boolean {
  if (searchInput) return true;

  const hasArrayFilter = (value: FilterValue): boolean => {
    if (!value) return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  };

  return !!(
    hasArrayFilter(filters.insuranceProvider) ||
    hasArrayFilter(filters.allergies) ||
    hasArrayFilter(filters.currentMedications) ||
    hasArrayFilter(filters.conditions) ||
    hasArrayFilter(filters.bloodType) ||
    hasArrayFilter(filters.lastVisit) ||
    hasArrayFilter(filters.status)
  );
}

export function convertStatusDisplayToApi(displayValues: string[]): string[] {
  return displayValues.map(label => statusValues[label] || label).filter(Boolean);
}

export function convertStatusApiToDisplay(apiValues: string[]): string[] {
  return apiValues.map(value => {
    const entry = Object.entries(statusValues).find(([_, v]) => v === value);
    return entry ? entry[0] : value;
  });
}

export function convertLastVisitDisplayToApi(displayLabels: string[]): string[] {
  return displayLabels.map(label => lastVisitValues[label] || label).filter(Boolean);
}

export function convertLastVisitApiToDisplay(apiValues: string[]): string[] {
  return apiValues.map(value => {
    const entry = Object.entries(lastVisitValues).find(([_, v]) => v === value);
    return entry ? entry[0] : value;
  });
}

export function extractDatePart(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(' ')[0];
}
