import { describe, it, expect } from 'vitest';
import {
  getPatientData,
  normalizeFilterValues,
  hasActiveFilters,
  convertStatusDisplayToApi,
  convertStatusApiToDisplay,
  convertLastVisitDisplayToApi,
  convertLastVisitApiToDisplay,
  extractDatePart,
} from '../utils';
import type { PatientListItem } from '@/types';
import type { FetchPatientsParams } from '@/hooks/queries';

describe('utils', () => {
  describe('getPatientData', () => {
    it('extracts patient data with camelCase fields', () => {
      const patient: PatientListItem = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        email: 'john@example.com',
        phone: '555-1234',
        status: 'active',
        lastVisit: '2024-01-15',
        bloodType: 'O+',
        insuranceProvider: 'Blue Cross',
      };

      const result = getPatientData(patient);

      expect(result).toEqual(patient);
    });

    it('extracts patient data with snake_case fields', () => {
      const patient = {
        id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        date_of_birth: '1985-05-20',
        email: 'jane@example.com',
        phone: '555-5678',
        status: 'inactive',
        last_visit: '2023-12-10',
        blood_type: 'A-',
        insurance_provider: 'Aetna',
      };

      const result = getPatientData(patient);

      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Smith');
      expect(result.dateOfBirth).toBe('1985-05-20');
      expect(result.email).toBe('jane@example.com');
      expect(result.phone).toBe('555-5678');
      expect(result.status).toBe('inactive');
      expect(result.lastVisit).toBe('2023-12-10');
      expect(result.bloodType).toBe('A-');
      expect(result.insuranceProvider).toBe('Aetna');
    });

    it('prefers camelCase over snake_case when both are present', () => {
      const patient = {
        id: '3',
        firstName: 'John',
        first_name: 'Jane',
        lastName: 'Doe',
        last_name: 'Smith',
      };

      const result = getPatientData(patient);

      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });

    it('defaults status to active when invalid', () => {
      const patient = {
        id: '4',
        status: 'invalid_status',
      };

      const result = getPatientData(patient);

      expect(result.status).toBe('active');
    });

    it('handles null bloodType', () => {
      const patient = {
        id: '5',
        bloodType: null,
      };

      const result = getPatientData(patient);

      expect(result.bloodType).toBeNull();
    });

    it('handles missing fields gracefully', () => {
      const patient = {
        id: '6',
      };

      const result = getPatientData(patient);

      expect(result.id).toBe('6');
      expect(result.firstName).toBe('');
      expect(result.lastName).toBe('');
      expect(result.status).toBe('active');
    });
  });

  describe('normalizeFilterValues', () => {
    it('converts single values to arrays', () => {
      const filters: Partial<FetchPatientsParams> = {
        insuranceProvider: 'Blue Cross',
        allergies: 'Peanuts',
      };

      const result = normalizeFilterValues(filters);

      expect(result.insuranceProvider).toEqual(['Blue Cross']);
      expect(result.allergies).toEqual(['Peanuts']);
    });

    it('keeps arrays as arrays', () => {
      const filters: Partial<FetchPatientsParams> = {
        insuranceProvider: ['Blue Cross', 'Aetna'],
        allergies: ['Peanuts', 'Shellfish'],
      };

      const result = normalizeFilterValues(filters);

      expect(result.insuranceProvider).toEqual(['Blue Cross', 'Aetna']);
      expect(result.allergies).toEqual(['Peanuts', 'Shellfish']);
    });

    it('converts empty arrays to undefined', () => {
      const filters: Partial<FetchPatientsParams> = {
        insuranceProvider: [],
        allergies: [],
      };

      const result = normalizeFilterValues(filters);

      expect(result.insuranceProvider).toBeUndefined();
      expect(result.allergies).toBeUndefined();
    });

    it('converts undefined to undefined', () => {
      const filters: Partial<FetchPatientsParams> = {
        insuranceProvider: undefined,
      };

      const result = normalizeFilterValues(filters);

      expect(result.insuranceProvider).toBeUndefined();
    });

    it('normalizes all filter types', () => {
      const filters: Partial<FetchPatientsParams> = {
        insuranceProvider: 'Provider',
        allergies: ['Allergy1'],
        currentMedications: 'Medication',
        conditions: ['Condition1'],
        bloodType: 'O+',
        lastVisit: 'last_30_days',
        status: 'active',
      };

      const result = normalizeFilterValues(filters);

      expect(result.insuranceProvider).toEqual(['Provider']);
      expect(result.allergies).toEqual(['Allergy1']);
      expect(result.currentMedications).toEqual(['Medication']);
      expect(result.conditions).toEqual(['Condition1']);
      expect(result.bloodType).toEqual(['O+']);
      expect(result.lastVisit).toEqual(['last_30_days']);
      expect(result.status).toEqual(['active']);
    });
  });

  describe('hasActiveFilters', () => {
    it('returns true when search input has value', () => {
      const filters: Partial<FetchPatientsParams> = {};
      expect(hasActiveFilters(filters, 'test')).toBe(true);
    });

    it('returns false when no filters and empty search', () => {
      const filters: Partial<FetchPatientsParams> = {};
      expect(hasActiveFilters(filters, '')).toBe(false);
    });

    it('returns true when insurance provider filter is active', () => {
      const filters: Partial<FetchPatientsParams> = {
        insuranceProvider: ['Blue Cross'],
      };
      expect(hasActiveFilters(filters, '')).toBe(true);
    });

    it('returns true when allergies filter is active', () => {
      const filters: Partial<FetchPatientsParams> = {
        allergies: ['Peanuts'],
      };
      expect(hasActiveFilters(filters, '')).toBe(true);
    });

    it('returns true when single value filter is active', () => {
      const filters: Partial<FetchPatientsParams> = {
        insuranceProvider: 'Blue Cross',
      };
      expect(hasActiveFilters(filters, '')).toBe(true);
    });

    it('returns false when filter array is empty', () => {
      const filters: Partial<FetchPatientsParams> = {
        insuranceProvider: [],
      };
      expect(hasActiveFilters(filters, '')).toBe(false);
    });

    it('checks all filter types', () => {
      const filters: Partial<FetchPatientsParams> = {
        insuranceProvider: ['Provider'],
        allergies: ['Allergy'],
        currentMedications: ['Medication'],
        conditions: ['Condition'],
        bloodType: ['O+'],
        lastVisit: ['last_30_days'],
        status: ['active'],
      };

      expect(hasActiveFilters(filters, '')).toBe(true);
    });
  });

  describe('convertStatusDisplayToApi', () => {
    it('converts display values to API values', () => {
      const displayValues = ['Active', 'Inactive', 'Critical'];
      const result = convertStatusDisplayToApi(displayValues);

      expect(result).toContain('active');
      expect(result).toContain('inactive');
      expect(result).toContain('critical');
    });

    it('handles empty array', () => {
      const result = convertStatusDisplayToApi([]);
      expect(result).toEqual([]);
    });

    it('handles unknown values', () => {
      const result = convertStatusDisplayToApi(['Unknown']);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('convertStatusApiToDisplay', () => {
    it('converts API values to display values', () => {
      const apiValues = ['active', 'inactive', 'critical'];
      const result = convertStatusApiToDisplay(apiValues);

      expect(result).toContain('Active');
      expect(result).toContain('Inactive');
      expect(result).toContain('Critical');
    });

    it('handles empty array', () => {
      const result = convertStatusApiToDisplay([]);
      expect(result).toEqual([]);
    });

    it('handles unknown values', () => {
      const result = convertStatusApiToDisplay(['unknown']);
      expect(result).toContain('unknown');
    });
  });

  describe('convertLastVisitDisplayToApi', () => {
    it('converts display labels to API values', () => {
      const displayLabels = ['Last 30 Days', 'Last 90 Days'];
      const result = convertLastVisitDisplayToApi(displayLabels);

      expect(result.length).toBeGreaterThan(0);
    });

    it('handles empty array', () => {
      const result = convertLastVisitDisplayToApi([]);
      expect(result).toEqual([]);
    });
  });

  describe('convertLastVisitApiToDisplay', () => {
    it('converts API values to display labels', () => {
      const apiValues = ['last_30_days', 'last_90_days'];
      const result = convertLastVisitApiToDisplay(apiValues);

      expect(result.length).toBeGreaterThan(0);
    });

    it('handles empty array', () => {
      const result = convertLastVisitApiToDisplay([]);
      expect(result).toEqual([]);
    });
  });

  describe('extractDatePart', () => {
    it('extracts date from ISO format string', () => {
      expect(extractDatePart('2024-01-15T10:30:00Z')).toBe('2024-01-15');
    });

    it('extracts date from space-separated format', () => {
      expect(extractDatePart('2024-01-15 10:30:00')).toBe('2024-01-15');
    });

    it('returns empty string for null', () => {
      expect(extractDatePart(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(extractDatePart(undefined)).toBe('');
    });

    it('handles date-only strings', () => {
      expect(extractDatePart('2024-01-15')).toBe('2024-01-15');
    });
  });
});

