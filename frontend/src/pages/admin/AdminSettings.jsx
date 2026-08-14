import Layout from '../../components/Layout';
import ChangePassword from '../auth/ChangePassword';

export default function AdminSettings() {
  return (
    <Layout title="Settings">
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-lg">
        <ChangePassword />
      </div>
    </Layout>
  );
}
