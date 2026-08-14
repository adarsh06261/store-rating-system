import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Store, LayoutDashboard, Users, Settings } from 'lucide-react';
import Button from './ui/Button';

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = {
    ADMIN: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/stores', label: 'Stores', icon: Store },
    ],
    USER: [{ to: '/stores', label: 'Stores', icon: Store }],
    STORE_OWNER: [{ to: '/owner', label: 'Dashboard', icon: LayoutDashboard }],
  };

  const links = navLinks[user?.role] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold text-primary-600">
                StoreRating
              </Link>
              <div className="hidden sm:flex items-center gap-1">
                {links.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition"
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ').toLowerCase()}</p>
              </div>
              <Link
                to={`/${user?.role === 'ADMIN' ? 'admin' : user?.role === 'STORE_OWNER' ? 'owner' : 'user'}/settings`}
                className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-100"
              >
                <Settings size={20} />
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
