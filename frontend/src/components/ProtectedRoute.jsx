import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const redirectMap = {
      ADMIN: '/admin',
      USER: '/stores',
      STORE_OWNER: '/owner',
    };
    return <Navigate to={redirectMap[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
