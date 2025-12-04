import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROUTES } from '@/utils/constants';
import { getAuthToken } from '@/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, sessionExpired } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (sessionExpired) {
    return <>{children}</>;
  }

  const hasToken = !!getAuthToken();
  if (!isAuthenticated && !hasToken) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export { ProtectedRoute };
