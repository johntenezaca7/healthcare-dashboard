import { useQuery } from '@tanstack/react-query';

import { PaginatedPatients } from '@/types';

import { API_BASE_URL } from '../../constants';
import { createAuthHeaders, handleApiError } from '../../utils';
import { patientKeys } from './QueryKey';
import type { FetchPatientsParams } from './types';

const fetchPatients = async (params: FetchPatientsParams = {}): Promise<PaginatedPatients> => {
  const {
    page = 1,
    pageSize = 25,
    search,
    status,
    bloodType,
    city,
    state,
    insuranceProvider,
    allergies,
    currentMedications,
    conditions,
    lastVisit,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  if (search) queryParams.append('search', search);

  if (status) {
    if (Array.isArray(status)) {
      status.forEach(s => queryParams.append('status', s));
    } else {
      queryParams.append('status', status);
    }
  }

  if (bloodType) {
    if (Array.isArray(bloodType)) {
      bloodType.forEach(type => queryParams.append('blood_type', type));
    } else {
      queryParams.append('blood_type', bloodType);
    }
  }

  if (city) queryParams.append('city', city);
  if (state) queryParams.append('state', state);

  if (insuranceProvider) {
    if (Array.isArray(insuranceProvider)) {
      insuranceProvider.forEach(provider => queryParams.append('insurance_provider', provider));
    } else {
      queryParams.append('insurance_provider', insuranceProvider);
    }
  }

  if (allergies) {
    if (Array.isArray(allergies)) {
      allergies.forEach(allergy => queryParams.append('allergies', allergy));
    } else {
      queryParams.append('allergies', allergies);
    }
  }

  if (currentMedications) {
    if (Array.isArray(currentMedications)) {
      currentMedications.forEach(med => queryParams.append('current_medications', med));
    } else {
      queryParams.append('current_medications', currentMedications);
    }
  }

  if (conditions) {
    if (Array.isArray(conditions)) {
      conditions.forEach(condition => queryParams.append('conditions', condition));
    } else {
      queryParams.append('conditions', conditions);
    }
  }

  if (lastVisit) {
    if (Array.isArray(lastVisit)) {
      lastVisit.forEach(visit => queryParams.append('last_visit', visit));
    } else {
      queryParams.append('last_visit', lastVisit);
    }
  }

  const response = await fetch(`${API_BASE_URL}/patients?${queryParams}`, {
    method: 'GET',
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    throw await handleApiError(response);
  }

  return response.json();
};

export const useGetAllPatients = (params: FetchPatientsParams = {}) => {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => fetchPatients(params),
    refetchOnMount: 'always',
    staleTime: 0,
    gcTime: 0,
  });
};
