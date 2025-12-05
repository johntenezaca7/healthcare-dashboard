import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { SessionExpiredModal, Sidebar } from '@/components';
import { Footer, Header } from '@/components/ui';

import { useAuth } from '@/context/auth';
import { ProtectedRoute, RoleProtectedRoute } from '@/lib';

import { ROUTES } from '@/utils/constants';

// Lazy load route components for code splitting
const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const PatientList = lazy(() =>
  import('@/pages/PatientList').then(module => ({ default: module.PatientList }))
);
const PatientDetail = lazy(() =>
  import('@/pages/PatientDetail').then(module => ({ default: module.PatientDetail }))
);
const PatientCreate = lazy(() =>
  import('@/pages/PatientCreate').then(module => ({ default: module.PatientCreate }))
);
const NotFound = lazy(() =>
  import('@/pages/NotFound').then(module => ({ default: module.NotFound }))
);

// Lazy load future-work pages
const Home = lazy(() =>
  import('@/pages/future-work/Home').then(module => ({ default: module.Home }))
);
const Settings = lazy(() =>
  import('@/pages/future-work/Settings').then(module => ({ default: module.Settings }))
);
const Appointments = lazy(() =>
  import('@/pages/future-work/Appointments').then(module => ({ default: module.Appointments }))
);
const ClinicalNotes = lazy(() =>
  import('@/pages/future-work/ClinicalNotes').then(module => ({ default: module.ClinicalNotes }))
);
const Medications = lazy(() =>
  import('@/pages/future-work/Medications').then(module => ({ default: module.Medications }))
);
const LabsResults = lazy(() =>
  import('@/pages/future-work/LabsResults').then(module => ({ default: module.LabsResults }))
);
const Reports = lazy(() =>
  import('@/pages/future-work/Reports').then(module => ({ default: module.Reports }))
);
const InsuranceManagement = lazy(() =>
  import('@/pages/future-work/InsuranceManagement').then(module => ({
    default: module.InsuranceManagement,
  }))
);
const Tasks = lazy(() =>
  import('@/pages/future-work/Tasks').then(module => ({ default: module.Tasks }))
);
const UserManagement = lazy(() =>
  import('@/pages/future-work/UserManagement').then(module => ({ default: module.UserManagement }))
);

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const AppRouter = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sessionExpired, setSessionExpired } = useAuth();

  return (
    <BrowserRouter>
      <SessionExpiredModal open={sessionExpired} onClose={() => setSessionExpired(false)} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route
            path="*"
            element={
              <div className="flex min-h-screen flex-col bg-background">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex flex-1">
                  <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
                    <div className="container mx-auto max-w-7xl px-0 sm:px-4">
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route
                            path={ROUTES.HOME}
                            element={
                              <ProtectedRoute>
                                <Home />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.PATIENTS}
                            element={
                              <ProtectedRoute>
                                <PatientList />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.PATIENT_CREATE}
                            element={
                              <ProtectedRoute>
                                <PatientCreate />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/patients/:id"
                            element={
                              <ProtectedRoute>
                                <PatientDetail />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.APPOINTMENTS}
                            element={
                              <ProtectedRoute>
                                <Appointments />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.CLINICAL_NOTES}
                            element={
                              <ProtectedRoute>
                                <ClinicalNotes />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.MEDICATIONS}
                            element={
                              <ProtectedRoute>
                                <Medications />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.LABS_RESULTS}
                            element={
                              <ProtectedRoute>
                                <LabsResults />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.INSURANCE_MANAGEMENT}
                            element={
                              <ProtectedRoute>
                                <RoleProtectedRoute
                                  allowedRoles={['admin', 'system_admin', 'super_admin']}
                                >
                                  <InsuranceManagement />
                                </RoleProtectedRoute>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.REPORTS}
                            element={
                              <ProtectedRoute>
                                <RoleProtectedRoute blockedRoles={['nurse']}>
                                  <Reports />
                                </RoleProtectedRoute>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.TASKS}
                            element={
                              <ProtectedRoute>
                                <Tasks />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.USER_MANAGEMENT}
                            element={
                              <ProtectedRoute>
                                <RoleProtectedRoute
                                  allowedRoles={['admin', 'system_admin', 'super_admin']}
                                >
                                  <UserManagement />
                                </RoleProtectedRoute>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path={ROUTES.SETTINGS}
                            element={
                              <ProtectedRoute>
                                <RoleProtectedRoute
                                  allowedRoles={['admin', 'system_admin', 'super_admin']}
                                >
                                  <Settings />
                                </RoleProtectedRoute>
                              </ProtectedRoute>
                            }
                          />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </div>
                  </main>
                </div>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
