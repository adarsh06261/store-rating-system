import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  if (user) {
    const map = { ADMIN: '/admin', USER: '/stores', STORE_OWNER: '/owner' };
    return <Navigate to={map[user.role] || '/'} replace />;
  }

  return children;
}
