import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Patient } from '@/types';

import { API_BASE_URL } from '../../constants';
import { patientKeys } from '../../queries/Patients/QueryKey';
import { createAuthHeaders, handleApiError } from '../../utils';
import type { MedicalInfoUpdate } from './types';

const updatePatientMedicalInfo = async (
  id: string,
  updateData: MedicalInfoUpdate
): Promise<Patient> => {
  const response = await fetch(`${API_BASE_URL}/patients/${id}/medical-info`, {
    method: 'PATCH',
    headers: createAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw await handleApiError(response);
  }

  return response.json();
};

export const useUpdatePatientMedicalInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MedicalInfoUpdate }) =>
      updatePatientMedicalInfo(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific patient detail
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
      // Invalidate all patient lists (since patient data changed)
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
};
