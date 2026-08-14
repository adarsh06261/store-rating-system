import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';
import { useFetch } from '../../hooks/useFetch';

export default function AdminStoreDetails() {
  const { id } = useParams();
  const { data: store, loading } = useFetch(`/admin/stores/${id}`);

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (!store) return <Layout><p>Store not found</p></Layout>;

  return (
    <Layout title="Store Details">
      <Link to="/admin/stores" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft size={16} /> Back to Stores
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Store Info</h2>
          <dl className="space-y-3">
            <div><dt className="text-sm text-gray-500">Name</dt><dd className="font-medium">{store.name}</dd></div>
            <div><dt className="text-sm text-gray-500">Email</dt><dd>{store.email}</dd></div>
            <div><dt className="text-sm text-gray-500">Address</dt><dd>{store.address || 'N/A'}</dd></div>
            <div>
              <dt className="text-sm text-gray-500">Average Rating</dt>
              <dd className="flex items-center gap-2 mt-1">
                <StarRating value={Math.round(store.averageRating)} readonly />
                <span className="font-medium">{store.averageRating} / 5</span>
              </dd>
            </div>
            <div><dt className="text-sm text-gray-500">Total Reviews</dt><dd>{store._count.ratings}</dd></div>
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Owner</h2>
          <dl className="space-y-3">
            <div><dt className="text-sm text-gray-500">Name</dt><dd className="font-medium">{store.owner.name}</dd></div>
            <div><dt className="text-sm text-gray-500">Email</dt><dd>{store.owner.email}</dd></div>
            <div><dt className="text-sm text-gray-500">Address</dt><dd>{store.owner.address || 'N/A'}</dd></div>
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Ratings ({store.ratings?.length || 0})</h2>
          {store.ratings?.length ? (
            <div className="space-y-3">
              {store.ratings.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{r.user.name}</p>
                    <p className="text-sm text-gray-500">{r.user.email}</p>
                  </div>
                  <div className="text-right">
                    <StarRating value={r.rating} readonly size={16} />
                    <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No ratings yet</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
