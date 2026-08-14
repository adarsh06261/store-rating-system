import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import StarRating from '../../components/StarRating';
import Button from '../../components/ui/Button';
import { useFetch, useDebounce } from '../../hooks/useFetch';
import api from '../../services/api';

export default function UserStores() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [page, setPage] = useState(1);
  const [ratingStore, setRatingStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const { data, loading, refetch } = useFetch('/stores', {
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
    minRating: minRating || undefined,
    maxRating: maxRating || undefined,
    page,
    limit: 9,
  });

  const handleRate = (store) => {
    setRatingStore(store);
    setSelectedRating(store.userRating || 0);
  };

  const submitRating = async () => {
    if (!selectedRating) {
      toast.error('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      if (ratingStore.userRating) {
        await api.put(`/ratings/stores/${ratingStore.id}`, { rating: selectedRating });
        toast.success('Rating updated successfully');
      } else {
        await api.post(`/ratings/stores/${ratingStore.id}`, { rating: selectedRating });
        toast.success('Rating submitted successfully');
      }
      setRatingStore(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Browse Stores">
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
          <option value="2">2+ Stars</option>
        </select>
        <select
          value={maxRating}
          onChange={(e) => { setMaxRating(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Max Rating</option>
          <option value="5">Up to 5 Stars</option>
          <option value="4">Up to 4 Stars</option>
          <option value="3">Up to 3 Stars</option>
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
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="averageRating-desc">Highest Rated</option>
          <option value="averageRating-asc">Lowest Rated</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : !data?.stores?.length ? (
        <EmptyState title="No stores found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.stores.map((store) => (
              <div key={store.id} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col">
                <h3 className="font-semibold text-lg mb-1">{store.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{store.address || 'No address'}</p>
                <div className="flex items-center gap-2 mb-4">
                  <StarRating value={Math.round(store.averageRating)} readonly size={16} />
                  <span className="text-sm text-gray-600">
                    {store.averageRating} ({store._count.ratings} reviews)
                  </span>
                </div>
                {store.userRating && (
                  <p className="text-sm text-primary-600 mb-3">Your rating: {store.userRating}/5</p>
                )}
                <Button
                  variant={store.userRating ? 'secondary' : 'primary'}
                  size="sm"
                  className="mt-auto"
                  onClick={() => handleRate(store)}
                >
                  {store.userRating ? 'Update Rating' : 'Rate Store'}
                </Button>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      {ratingStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setRatingStore(null)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Rate {ratingStore.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Select a rating from 1 to 5 stars</p>
            <div className="flex justify-center mb-6">
              <StarRating value={selectedRating} onChange={setSelectedRating} size={32} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setRatingStore(null)}>Cancel</Button>
              <Button className="flex-1" loading={submitting} onClick={submitRating}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
