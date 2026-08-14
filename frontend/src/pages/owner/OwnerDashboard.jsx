import { Store, Star, Users } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StarRating from '../../components/StarRating';
import { useFetch } from '../../hooks/useFetch';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const { data, loading } = useFetch('/owner/dashboard');

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout title="Owner Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Store} label="My Stores" value={data?.totalStores ?? 0} color="bg-green-500" />
        <StatCard icon={Star} label="Overall Average" value={data?.overallAverage ?? 0} color="bg-yellow-500" />
        <StatCard icon={Users} label="Total Ratings" value={data?.totalRatings ?? 0} color="bg-blue-500" />
      </div>

      {!data?.stores?.length ? (
        <EmptyState title="No stores yet" description="Contact admin to add stores to your account." />
      ) : (
        <div className="space-y-6">
          {data.stores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{store.name}</h3>
                    <p className="text-sm text-gray-500">{store.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StarRating value={Math.round(store.averageRating)} readonly />
                    <span className="font-medium">{store.averageRating} avg · {store.totalRatings} reviews</span>
                  </div>
                </div>
              </div>

              {store.ratings?.length ? (
                <div className="divide-y">
                  {store.ratings.map((r) => (
                    <div key={r.id} className="px-6 py-4 flex items-center justify-between">
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
                <div className="p-6 text-center text-gray-500 text-sm">No ratings yet for this store</div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
