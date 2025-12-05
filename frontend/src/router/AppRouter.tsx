import { Suspense, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { SessionExpiredModal, Sidebar } from '@/components';
import { Footer, Header } from '@/components/ui';

import { useAuth } from '@/context/auth';
import { ProtectedRoute, RoleProtectedRoute } from '@/lib';

import { ROUTES } from '@/utils/constants';

import { protectedRoutes } from './protectedRoutes';
import * as LazyRoutes from './lazyRoutes';

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
          <Route path={ROUTES.LOGIN} element={<LazyRoutes.Login />} />
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
                          {protectedRoutes.map(({ path, component: Component, roleProtected }) => {
                            const element = roleProtected ? (
                              <ProtectedRoute>
                                <RoleProtectedRoute
                                  allowedRoles={roleProtected.allowedRoles}
                                  blockedRoles={roleProtected.blockedRoles}
                                >
                                  <Component />
                                </RoleProtectedRoute>
                              </ProtectedRoute>
                            ) : (
                              <ProtectedRoute>
                                <Component />
                              </ProtectedRoute>
                            );

                            return <Route key={path} path={path} element={element} />;
                          })}
                          <Route path="*" element={<LazyRoutes.NotFound />} />
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

