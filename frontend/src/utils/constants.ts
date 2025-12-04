export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PATIENTS: '/patients',
  PATIENT_CREATE: '/patients/new',
  PATIENT_DETAIL: '/patients/:id',
  APPOINTMENTS: '/appointments',
  CLINICAL_NOTES: '/clinical-notes',
  MEDICATIONS: '/medications',
  LABS_RESULTS: '/labs-results',
  INSURANCE_MANAGEMENT: '/insurance-management',
  REPORTS: '/reports',
  TASKS: '/tasks',
  USER_MANAGEMENT: '/user-management',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
} as const;

export const getPatientDetailRoute = (id: string) => `/patients/${id}`;
