import { useQuery } from '@tanstack/react-query';

import { Patient } from '@/types';

import { API_BASE_URL } from '../../constants';
import { createAuthHeaders, handleApiError } from '../../utils';
import { patientKeys } from './QueryKey';

const fetchPatientById = async (id: string): Promise<Patient> => {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    method: 'GET',
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Patient not found');
    }
    throw await handleApiError(response);
  }

  return response.json();
};

export const useGetPatient = (id: string) => {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => fetchPatientById(id),
    enabled: !!id,
  });
};
