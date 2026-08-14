import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';
import { useFetch } from '../../hooks/useFetch';

export default function AdminUserDetails() {
  const { id } = useParams();
  const { data: user, loading } = useFetch(`/admin/users/${id}`);

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (!user) return <Layout><p>User not found</p></Layout>;

  return (
    <Layout title="User Details">
      <Link to="/admin/users" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft size={16} /> Back to Users
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <dl className="space-y-3">
            <div><dt className="text-sm text-gray-500">Name</dt><dd className="font-medium">{user.name}</dd></div>
            <div><dt className="text-sm text-gray-500">Email</dt><dd>{user.email}</dd></div>
            <div><dt className="text-sm text-gray-500">Role</dt><dd className="capitalize">{user.role.replace('_', ' ').toLowerCase()}</dd></div>
            <div><dt className="text-sm text-gray-500">Address</dt><dd>{user.address || 'N/A'}</dd></div>
            <div><dt className="text-sm text-gray-500">Joined</dt><dd>{new Date(user.createdAt).toLocaleDateString()}</dd></div>
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Ratings Given ({user.ratings?.length || 0})</h2>
          {user.ratings?.length ? (
            <div className="space-y-3">
              {user.ratings.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{r.store.name}</span>
                  <StarRating value={r.rating} readonly size={16} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No ratings yet</p>
          )}
        </div>

        {user.ownedStores?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Owned Stores ({user.ownedStores.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.ownedStores.map((store) => {
                const avg = store.ratings.length
                  ? (store.ratings.reduce((s, r) => s + r.rating, 0) / store.ratings.length).toFixed(1)
                  : '0';
                return (
                  <div key={store.id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-gray-500">{store._count.ratings} ratings · Avg: {avg}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
