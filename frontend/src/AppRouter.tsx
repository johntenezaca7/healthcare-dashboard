import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Sidebar, SessionExpiredModal } from '@/components';
import { Header, Footer } from '@/components/ui';
import { ProtectedRoute, RoleProtectedRoute } from '@/lib';
import { PatientList, PatientDetail, PatientCreate, NotFound, Login } from '@/pages';
import {
  Home,
  Settings,
  Appointments,
  ClinicalNotes,
  Medications,
  LabsResults,
  Reports,
  InsuranceManagement,
  Tasks,
  UserManagement,
} from '@/pages/future-work';
import { useAuth } from '@/context/auth';
import { ROUTES } from '@/utils/constants';

export const AppRouter = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sessionExpired, setSessionExpired } = useAuth();

  return (
    <BrowserRouter>
      <SessionExpiredModal open={sessionExpired} onClose={() => setSessionExpired(false)} />
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
                  </div>
                </main>
              </div>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

