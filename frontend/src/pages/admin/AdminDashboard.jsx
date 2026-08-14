import { Users, Store, Star } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useFetch } from '../../hooks/useFetch';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

export default function AdminDashboard() {
  const { data, loading } = useFetch('/admin/dashboard/stats');

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout title="Admin Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={Users} label="Total Users" value={data?.totalUsers ?? 0} color="bg-blue-500" />
        <StatCard icon={Store} label="Total Stores" value={data?.totalStores ?? 0} color="bg-green-500" />
        <StatCard icon={Star} label="Total Ratings" value={data?.totalRatings ?? 0} color="bg-yellow-500" />
      </div>
    </Layout>
  );
}
