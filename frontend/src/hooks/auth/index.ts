export { useLogin, useGetCurrentUser, useLogout, authKeys } from './Auth';
export { getAuthToken, setAuthToken, removeAuthToken } from '../utils';

// Backward compatibility alias
export { useGetCurrentUser as useCurrentUser } from './Auth';
