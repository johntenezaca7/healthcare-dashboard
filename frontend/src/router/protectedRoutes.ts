import { ROUTES } from '@/utils/constants';

import * as LazyRoutes from './lazyRoutes';
import type { RouteConfig } from './types';

export const protectedRoutes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    component: LazyRoutes.Home,
    protected: true,
  },
  {
    path: ROUTES.PATIENTS,
    component: LazyRoutes.PatientList,
    protected: true,
  },
  {
    path: ROUTES.PATIENT_CREATE,
    component: LazyRoutes.PatientCreate,
    protected: true,
  },
  {
    path: '/patients/:id',
    component: LazyRoutes.PatientDetail,
    protected: true,
  },
  {
    path: ROUTES.APPOINTMENTS,
    component: LazyRoutes.Appointments,
    protected: true,
  },
  {
    path: ROUTES.CLINICAL_NOTES,
    component: LazyRoutes.ClinicalNotes,
    protected: true,
  },
  {
    path: ROUTES.MEDICATIONS,
    component: LazyRoutes.Medications,
    protected: true,
  },
  {
    path: ROUTES.LABS_RESULTS,
    component: LazyRoutes.LabsResults,
    protected: true,
  },
  {
    path: ROUTES.INSURANCE_MANAGEMENT,
    component: LazyRoutes.InsuranceManagement,
    protected: true,
    roleProtected: {
      allowedRoles: ['admin', 'system_admin', 'super_admin'],
    },
  },
  {
    path: ROUTES.REPORTS,
    component: LazyRoutes.Reports,
    protected: true,
    roleProtected: {
      blockedRoles: ['nurse'],
    },
  },
  {
    path: ROUTES.TASKS,
    component: LazyRoutes.Tasks,
    protected: true,
  },
  {
    path: ROUTES.USER_MANAGEMENT,
    component: LazyRoutes.UserManagement,
    protected: true,
    roleProtected: {
      allowedRoles: ['admin', 'system_admin', 'super_admin'],
    },
  },
  {
    path: ROUTES.SETTINGS,
    component: LazyRoutes.Settings,
    protected: true,
    roleProtected: {
      allowedRoles: ['admin', 'system_admin', 'super_admin'],
    },
  },
];

