import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeAuthToken } from '../../utils';
import { authKeys } from './QueryKey';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      removeAuthToken();
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.currentUser(), null);
      queryClient.clear();
    },
  });
};
