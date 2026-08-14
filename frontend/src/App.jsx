import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><div>Admin Dashboard</div></ProtectedRoute>} />
          <Route path="/stores" element={<ProtectedRoute roles={['USER']}><div>User Stores</div></ProtectedRoute>} />
          <Route path="/owner" element={<ProtectedRoute roles={['STORE_OWNER']}><div>Owner Dashboard</div></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
