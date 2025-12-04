import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  getPatientField,
  getMedicalInfoField,
  getPatientId,
  getStatusVariant,
  usePatientHeaderData,
} from '../utils';
import type { PatientData, MedicalInfoData } from '../types';

describe('utils', () => {
  describe('getPatientField', () => {
    it('returns camelCase field value when present', () => {
      const patient: PatientData = {
        firstName: 'John',
        lastName: 'Doe',
      };

      expect(getPatientField(patient, 'firstName')).toBe('John');
      expect(getPatientField(patient, 'lastName')).toBe('Doe');
    });

    it('returns snake_case field value when camelCase is not present', () => {
      const patient = {
        first_name: 'Jane',
        last_name: 'Smith',
      };

      expect(getPatientField(patient, 'firstName', 'first_name')).toBe('Jane');
      expect(getPatientField(patient, 'lastName', 'last_name')).toBe('Smith');
    });

    it('prefers camelCase over snake_case when both are present', () => {
      const patient = {
        firstName: 'John',
        first_name: 'Jane',
      };

      expect(getPatientField(patient, 'firstName', 'first_name')).toBe('John');
    });

    it('returns empty string when field is not found', () => {
      const patient = {};

      expect(getPatientField(patient, 'firstName', 'first_name')).toBe('');
    });

    it('handles undefined values', () => {
      const patient = {
        firstName: undefined,
        first_name: undefined,
      };

      expect(getPatientField(patient, 'firstName', 'first_name')).toBe('');
    });
  });

  describe('getMedicalInfoField', () => {
    it('returns field value when present', () => {
      const medicalInfo: MedicalInfoData = {
        status: 'active',
      };

      expect(getMedicalInfoField(medicalInfo, 'status')).toBe('active');
    });

    it('returns empty string when field is not present', () => {
      const medicalInfo = {};

      expect(getMedicalInfoField(medicalInfo, 'status')).toBe('');
    });

    it('handles undefined values', () => {
      const medicalInfo = {
        status: undefined,
      };

      expect(getMedicalInfoField(medicalInfo, 'status')).toBe('');
    });
  });

  describe('getPatientId', () => {
    it('returns string ID as-is', () => {
      const patient = { id: 'patient-123' };

      expect(getPatientId(patient)).toBe('patient-123');
    });

    it('converts number ID to string', () => {
      const patient = { id: 456 };

      expect(getPatientId(patient)).toBe('456');
    });

    it('returns empty string when ID is not present', () => {
      const patient = {};

      expect(getPatientId(patient)).toBe('');
    });

    it('handles undefined ID', () => {
      const patient = { id: undefined };

      expect(getPatientId(patient)).toBe('');
    });
  });

  describe('getStatusVariant', () => {
    it('returns success for active status', () => {
      expect(getStatusVariant('active')).toBe('success');
    });

    it('returns destructive for critical status', () => {
      expect(getStatusVariant('critical')).toBe('destructive');
    });

    it('returns secondary for inactive status', () => {
      expect(getStatusVariant('inactive')).toBe('secondary');
    });

    it('returns secondary for unknown status', () => {
      expect(getStatusVariant('unknown')).toBe('secondary');
    });
  });

  describe('usePatientHeaderData', () => {
    it('extracts and normalizes patient data correctly', () => {
      const patient: PatientData = {
        id: 'patient-123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        email: 'john.doe@example.com',
        phone: '555-1234',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      };

      const medicalInfo: MedicalInfoData = {
        status: 'active',
      };

      const { result } = renderHook(() => usePatientHeaderData(patient, medicalInfo));

      expect(result.current.firstName).toBe('John');
      expect(result.current.lastName).toBe('Doe');
      expect(result.current.initials).toBe('JD');
      expect(result.current.dateOfBirth).toBe('1990-01-15');
      expect(result.current.email).toBe('john.doe@example.com');
      expect(result.current.phone).toBe('555-1234');
      expect(result.current.patientId).toBe('patient-123');
      expect(result.current.status).toBe('active');
      expect(result.current.statusVariant).toBe('success');
    });

    it('handles snake_case patient data', () => {
      const patient = {
        id: 456,
        first_name: 'Jane',
        last_name: 'Smith',
        date_of_birth: '1985-05-20',
        email: 'jane.smith@example.com',
        phone: '555-5678',
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-15T00:00:00Z',
      };

      const medicalInfo: MedicalInfoData = {
        status: 'critical',
      };

      const { result } = renderHook(() => usePatientHeaderData(patient, medicalInfo));

      expect(result.current.firstName).toBe('Jane');
      expect(result.current.lastName).toBe('Smith');
      expect(result.current.initials).toBe('JS');
      expect(result.current.status).toBe('critical');
      expect(result.current.statusVariant).toBe('destructive');
    });

    it('defaults status to active when not provided', () => {
      const patient: PatientData = {
        id: 'patient-123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const medicalInfo = {};

      const { result } = renderHook(() => usePatientHeaderData(patient, medicalInfo));

      expect(result.current.status).toBe('active');
      expect(result.current.statusVariant).toBe('success');
    });

    it('handles empty strings gracefully', () => {
      const patient: PatientData = {
        id: 'patient-123',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      };

      const medicalInfo: MedicalInfoData = {
        status: 'active',
      };

      const { result } = renderHook(() => usePatientHeaderData(patient, medicalInfo));

      expect(result.current.firstName).toBe('');
      expect(result.current.lastName).toBe('');
      expect(result.current.initials).toBe('');
      expect(result.current.email).toBe('');
      expect(result.current.phone).toBe('');
    });

    it('generates initials correctly', () => {
      const patient1: PatientData = {
        id: 'patient-1',
        firstName: 'John',
        lastName: 'Doe',
      };

      const { result: result1 } = renderHook(() =>
        usePatientHeaderData(patient1, { status: 'active' })
      );

      expect(result1.current.initials).toBe('JD');

      const patient2: PatientData = {
        id: 'patient-2',
        firstName: 'Mary',
        lastName: 'Jane',
      };

      const { result: result2 } = renderHook(() =>
        usePatientHeaderData(patient2, { status: 'active' })
      );

      expect(result2.current.initials).toBe('MJ');
    });

    it('handles numeric patient ID', () => {
      const patient: PatientData = {
        id: 789,
        firstName: 'Test',
        lastName: 'User',
      };

      const medicalInfo: MedicalInfoData = {
        status: 'active',
      };

      const { result } = renderHook(() => usePatientHeaderData(patient, medicalInfo));

      expect(result.current.patientId).toBe('789');
    });

    it('memoizes result correctly', () => {
      const patient: PatientData = {
        id: 'patient-123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const medicalInfo: MedicalInfoData = {
        status: 'active',
      };

      const { result, rerender } = renderHook(
        ({ patient, medicalInfo }) => usePatientHeaderData(patient, medicalInfo),
        {
          initialProps: { patient, medicalInfo },
        }
      );

      const firstResult = result.current;

      // Rerender with same props
      rerender({ patient, medicalInfo });

      // Result should be the same object reference (memoized)
      expect(result.current).toBe(firstResult);

      // Rerender with different patient
      const newPatient = { ...patient, firstName: 'Jane' };
      rerender({ patient: newPatient, medicalInfo });

      // Result should be different
      expect(result.current).not.toBe(firstResult);
      expect(result.current.firstName).toBe('Jane');
    });
  });
});

