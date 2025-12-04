import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Patient } from '@/types';
import { API_BASE_URL } from '../../constants';
import { createAuthHeaders, handleApiError } from '../../utils';
import { patientKeys } from '../../queries/Patients/QueryKey';
import type { PatientCreate } from './types';

const createPatient = async (patientData: PatientCreate): Promise<Patient> => {
  const response = await fetch(`${API_BASE_URL}/patients`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    throw await handleApiError(response);
  }

  return response.json();
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientData: PatientCreate) => createPatient(patientData),
    onSuccess: () => {
      // Invalidate all patient lists - this will refetch any list queries
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
};
