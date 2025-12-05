export { getAuthToken, removeAuthToken, setAuthToken } from '../utils';
export { authKeys, useGetCurrentUser, useLogin, useLogout } from './Auth';

// Backward compatibility alias
export { useGetCurrentUser as useCurrentUser } from './Auth';
