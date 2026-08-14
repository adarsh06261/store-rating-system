import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Plus, Eye } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import StarRating from '../../components/StarRating';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useFetch, useDebounce } from '../../hooks/useFetch';
import api from '../../services/api';
import { z } from 'zod';
import { nameSchema, emailSchema, addressSchema } from '../../utils/validation';

const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.string().min(1, 'Owner is required'),
});

export default function AdminStores() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [owners, setOwners] = useState([]);
  const debouncedSearch = useDebounce(search);

  const { data, loading, refetch } = useFetch('/admin/stores', {
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
    minRating: minRating || undefined,
    maxRating: maxRating || undefined,
    page,
    limit: 10,
  });

  useEffect(() => {
    api.get('/admin/store-owners').then(({ data: res }) => setOwners(res.data));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(createStoreSchema) });

  const onSubmit = async (formData) => {
    try {
      await api.post('/admin/stores', { ...formData, address: formData.address || undefined });
      toast.success('Store created successfully');
      setShowModal(false);
      reset();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    }
  };

  return (
    <Layout title="Manage Stores">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search stores..." />
        </div>
        <select
          value={minRating}
          onChange={(e) => { setMinRating(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Min Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
        <select
          value={maxRating}
          onChange={(e) => { setMaxRating(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Max Rating</option>
          <option value="5">Up to 5 Stars</option>
          <option value="4">Up to 4 Stars</option>
        </select>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [sb, so] = e.target.value.split('-');
            setSortBy(sb);
            setSortOrder(so);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="name-asc">Name A-Z</option>
          <option value="averageRating-desc">Highest Rated</option>
          <option value="averageRating-asc">Lowest Rated</option>
        </select>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-1" /> Add Store
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : !data?.stores?.length ? (
        <EmptyState title="No stores found" />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Owner</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Rating</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Reviews</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.stores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{store.name}</td>
                      <td className="px-6 py-4 text-gray-600">{store.owner?.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StarRating value={Math.round(store.averageRating)} readonly size={14} />
                          <span className="text-gray-600">{store.averageRating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{store._count.ratings}</td>
                      <td className="px-6 py-4">
                        <Link to={`/admin/stores/${store.id}`} className="text-primary-600 hover:text-primary-700">
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Store">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Store Name (20-60 chars)" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Address (optional)" error={errors.address?.message} {...register('address')} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Owner</label>
            <select {...register('ownerId')} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select owner</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
              ))}
            </select>
            {errors.ownerId && <p className="text-sm text-red-500 mt-1">{errors.ownerId.message}</p>}
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full">Create Store</Button>
        </form>
      </Modal>
    </Layout>
  );
}
