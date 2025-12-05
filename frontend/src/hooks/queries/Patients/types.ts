import type { OptionalFilterValue } from '@/components/patients-list/utils/types';

export interface FetchPatientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: OptionalFilterValue;
  bloodType?: OptionalFilterValue;
  city?: string;
  state?: string;
  insuranceProvider?: OptionalFilterValue;
  allergies?: OptionalFilterValue;
  currentMedications?: OptionalFilterValue;
  conditions?: OptionalFilterValue;
  lastVisit?: OptionalFilterValue;
  sortBy?: 'firstName' | 'lastName' | 'dateOfBirth' | 'createdAt' | 'status' | 'insuranceProvider';
  sortOrder?: 'asc' | 'desc';
}
