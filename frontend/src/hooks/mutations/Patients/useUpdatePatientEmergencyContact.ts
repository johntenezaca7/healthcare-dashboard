import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Patient } from '@/types';
import { API_BASE_URL } from '../../constants';
import { createAuthHeaders, handleApiError } from '../../utils';
import { patientKeys } from '../../queries/Patients/QueryKey';
import type { EmergencyContactUpdate } from './types';

const updatePatientEmergencyContact = async (
  id: string,
  updateData: EmergencyContactUpdate
): Promise<Patient> => {
  const response = await fetch(`${API_BASE_URL}/patients/${id}/emergency-contact`, {
    method: 'PATCH',
    headers: createAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw await handleApiError(response);
  }

  return response.json();
};

export const useUpdatePatientEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmergencyContactUpdate }) =>
      updatePatientEmergencyContact(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific patient detail
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
      // Invalidate all patient lists (since patient data changed)
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
};
