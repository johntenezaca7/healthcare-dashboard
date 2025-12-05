import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '@/utils/constants';

import { useAuth } from './AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  blockedRoles?: string[];
}

const RoleProtectedRoute = ({ children, allowedRoles, blockedRoles }: RoleProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  const userRole = user.role?.toLowerCase() || '';

  if (blockedRoles && blockedRoles.some(role => userRole === role.toLowerCase())) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (allowedRoles && !allowedRoles.some(role => userRole === role.toLowerCase())) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export { RoleProtectedRoute };
