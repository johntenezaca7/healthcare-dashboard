import { lazy } from 'react';

// Lazy load route components for code splitting
export const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
export const PatientList = lazy(() =>
  import('@/pages/PatientList').then(module => ({ default: module.PatientList }))
);
export const PatientDetail = lazy(() =>
  import('@/pages/PatientDetail').then(module => ({ default: module.PatientDetail }))
);
export const PatientCreate = lazy(() =>
  import('@/pages/PatientCreate').then(module => ({ default: module.PatientCreate }))
);
export const NotFound = lazy(() =>
  import('@/pages/NotFound').then(module => ({ default: module.NotFound }))
);

// Lazy load future-work pages
export const Home = lazy(() =>
  import('@/pages/future-work/Home').then(module => ({ default: module.Home }))
);
export const Settings = lazy(() =>
  import('@/pages/future-work/Settings').then(module => ({ default: module.Settings }))
);
export const Appointments = lazy(() =>
  import('@/pages/future-work/Appointments').then(module => ({ default: module.Appointments }))
);
export const ClinicalNotes = lazy(() =>
  import('@/pages/future-work/ClinicalNotes').then(module => ({ default: module.ClinicalNotes }))
);
export const Medications = lazy(() =>
  import('@/pages/future-work/Medications').then(module => ({ default: module.Medications }))
);
export const LabsResults = lazy(() =>
  import('@/pages/future-work/LabsResults').then(module => ({ default: module.LabsResults }))
);
export const Reports = lazy(() =>
  import('@/pages/future-work/Reports').then(module => ({ default: module.Reports }))
);
export const InsuranceManagement = lazy(() =>
  import('@/pages/future-work/InsuranceManagement').then(module => ({
    default: module.InsuranceManagement,
  }))
);
export const Tasks = lazy(() =>
  import('@/pages/future-work/Tasks').then(module => ({ default: module.Tasks }))
);
export const UserManagement = lazy(() =>
  import('@/pages/future-work/UserManagement').then(module => ({ default: module.UserManagement }))
);

