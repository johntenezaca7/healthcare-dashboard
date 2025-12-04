/**
 * Centralized error messages for consistent error handling across the application
 */
export const ERROR_MESSAGES = {
  // Patient errors
  PATIENT_NOT_FOUND: 'Patient not found',
  FAILED_TO_FETCH_PATIENTS: 'Failed to fetch patients',
  FAILED_TO_CREATE_PATIENT: 'Failed to create patient',
  FAILED_TO_UPDATE_PATIENT: 'Failed to update patient',
  
  // Auth errors
  LOGIN_FAILED: 'Login failed',
  INVALID_CREDENTIALS: 'Invalid credentials',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  
  // Generic errors
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  
  // Form errors
  VALIDATION_ERROR: 'Please check the form for errors.',
} as const;

/**
 * Get user-friendly error message from an error object
 */
export const getErrorMessage = (error: unknown, fallback?: string): string => {
  if (error instanceof Error) {
    return error.message || fallback || ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallback || ERROR_MESSAGES.SOMETHING_WENT_WRONG;
};

