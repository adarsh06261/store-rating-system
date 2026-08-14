import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminStores from './pages/admin/AdminStores';
import AdminStoreDetails from './pages/admin/AdminStoreDetails';
import AdminSettings from './pages/admin/AdminSettings';
import UserStores from './pages/user/UserStores';
import UserSettings from './pages/user/UserSettings';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerSettings from './pages/owner/OwnerSettings';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  const map = { ADMIN: '/admin', USER: '/stores', STORE_OWNER: '/owner' };
  return <Navigate to={map[user.role] || '/login'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/users/:id" element={<ProtectedRoute roles={['ADMIN']}><AdminUserDetails /></ProtectedRoute>} />
          <Route path="/admin/stores" element={<ProtectedRoute roles={['ADMIN']}><AdminStores /></ProtectedRoute>} />
          <Route path="/admin/stores/:id" element={<ProtectedRoute roles={['ADMIN']}><AdminStoreDetails /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute roles={['ADMIN']}><AdminSettings /></ProtectedRoute>} />
          <Route path="/stores" element={<ProtectedRoute roles={['USER']}><UserStores /></ProtectedRoute>} />
          <Route path="/user/settings" element={<ProtectedRoute roles={['USER']}><UserSettings /></ProtectedRoute>} />
          <Route path="/owner" element={<ProtectedRoute roles={['STORE_OWNER']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/settings" element={<ProtectedRoute roles={['STORE_OWNER']}><OwnerSettings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
