export { PatientDetailSkeleton } from './PatientDetailSkeleton';
export { PatientDetailError } from './PatientDetailError';
export { PatientHeaderCard } from './PatientHeaderCard';
export { DocumentsCard } from './DocumentsCard';
export type {
  PatientHeaderCardProps,
  PatientDataUnion,
  NormalizedPatientData,
  NormalizedAddress,
  NormalizedEmergencyContact,
  NormalizedInsuranceInfo,
  NormalizedMedicalInfo,
  ApiPatient,
} from './types';
export {
  normalizePatientData,
  normalizeAddress,
  normalizeEmergencyContact,
  normalizeInsuranceInfo,
  normalizeMedicalInfo,
  getStatusVariant,
  usePatientHeaderData,
} from './utils';
