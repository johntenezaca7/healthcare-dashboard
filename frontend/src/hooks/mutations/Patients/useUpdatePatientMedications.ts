import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Patient } from '@/types';
import { API_BASE_URL } from '../../constants';
import { createAuthHeaders, handleApiError } from '../../utils';
import { patientKeys } from '../../queries/Patients/QueryKey';
import type { MedicationsUpdate } from './types';

const updatePatientMedications = async (
  id: string,
  updateData: MedicationsUpdate
): Promise<Patient> => {
  const response = await fetch(`${API_BASE_URL}/patients/${id}/medications`, {
    method: 'PATCH',
    headers: createAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw await handleApiError(response);
  }

  return response.json();
};

export const useUpdatePatientMedications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MedicationsUpdate }) =>
      updatePatientMedications(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific patient detail
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
      // Invalidate all patient lists (since patient data changed)
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
};
