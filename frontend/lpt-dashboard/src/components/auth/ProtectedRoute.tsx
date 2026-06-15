import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { RoleId } from '../../types';
import { getMenuForRole, midToPath } from '../../utils/helpers';

interface ProtectedRouteProps {
  allowedRoles?: RoleId[];
  requiredMid?: number;
}

export function ProtectedRoute({ allowedRoles, requiredMid }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredMid && user) {
    const menu = getMenuForRole(user.role);
    if (!menu.some((m) => m.mid === requiredMid)) {
      return <Navigate to={midToPath(1)} replace />;
    }
  }

  return <Outlet />;
}
