import { useState } from 'react';
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
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useFetch, useDebounce } from '../../hooks/useFetch';
import api from '../../services/api';
import { z } from 'zod';
import { nameSchema, passwordSchema, emailSchema, addressSchema } from '../../utils/validation';

const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']),
});

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const debouncedSearch = useDebounce(search);

  const { data, loading, refetch } = useFetch('/admin/users', {
    search: debouncedSearch || undefined,
    role: role || undefined,
    sortBy,
    sortOrder,
    page,
    limit: 10,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(createUserSchema), defaultValues: { role: 'USER' } });

  const onSubmit = async (formData) => {
    try {
      await api.post('/admin/users', { ...formData, address: formData.address || undefined });
      toast.success('User created successfully');
      setShowModal(false);
      reset();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <Layout title="Manage Users">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search users..." />
        </div>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [sb, so] = e.target.value.split('-');
            setSortBy(sb);
            setSortOrder(so);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="email-asc">Email A-Z</option>
        </select>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-1" /> Add User
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : !data?.users?.length ? (
        <EmptyState title="No users found" />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Role</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Ratings</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 capitalize">
                          {user.role.replace('_', ' ').toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">{user._count.ratings}</td>
                      <td className="px-6 py-4">
                        <Link to={`/admin/users/${user.id}`} className="text-primary-600 hover:text-primary-700">
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name (20-60 chars)" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
          <Input label="Address (optional)" error={errors.address?.message} {...register('address')} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select {...register('role')} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full">Create User</Button>
        </form>
      </Modal>
    </Layout>
  );
}
