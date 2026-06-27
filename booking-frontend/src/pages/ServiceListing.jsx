import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { categoriesApi, providersApi } from '../services/serviceApi';
import { formatRate } from '../utils/currency';

export default function ServiceListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [sort, setSort] = useState('rating');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesApi.list({ limit: 100, popular: true });
        setCategories(res.data.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const nextCategory = searchParams.get('category') || '';
    const nextMinPrice = searchParams.get('minPrice') || '';
    const nextMaxPrice = searchParams.get('maxPrice') || '';
    const nextMinRating = searchParams.get('minRating') || '';
    const nextAvailability = searchParams.get('availabilityStatus') || '';
    const nextSort = searchParams.get('sort') || 'rating';

    setCategory(nextCategory);
    setMinPrice(nextMinPrice);
    setMaxPrice(nextMaxPrice);
    setMinRating(nextMinRating);
    setAvailabilityStatus(nextAvailability);
    setSort(nextSort);
    fetchProviders({
      category: nextCategory,
      minPrice: nextMinPrice,
      maxPrice: nextMaxPrice,
      minRating: nextMinRating,
      availabilityStatus: nextAvailability,
      sort: nextSort,
      page: searchParams.get('page') || 1
    });
  }, [searchParams]);

  const fetchProviders = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: filters.page,
        limit: 9,
        availabilityStatus: filters.availabilityStatus,
        sort: filters.sort
      };
      ['category', 'minPrice', 'maxPrice', 'minRating'].forEach((key) => {
        if (filters[key]) params[key] = filters[key];
      });

      const res = await providersApi.search(params);
      setProviders(res.data.data.providers || []);
      setPagination(res.data.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRating) params.set('minRating', minRating);
    if (availabilityStatus) params.set('availabilityStatus', availabilityStatus);
    if (sort) params.set('sort', sort);
    setSearchParams(params);
  };

  const resetFilters = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setAvailabilityStatus('available');
    setSort('rating');
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
  };

  const providerName = (provider) => provider.user?.name || provider.userId?.name || 'Provider';
  const providerAvatar = (provider) => provider.user?.avatar || provider.userId?.avatar;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 flex gap-10 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <aside className="hidden lg:flex flex-col w-72 shrink-0 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl sticky top-28 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="mb-8">
            <BackButton fallback="/services" className="mb-5" />
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Filters</h2>
            <p className="text-slate-500 text-sm mt-1">Refine your search</p>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 text-indigo-600 font-bold mb-4">
                <span className="material-symbols-outlined">category</span>
                <span className="text-sm">Categories</span>
              </div>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${!category ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-800' : 'hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-transparent'}`}>
                  <input type="radio" name="category" className="hidden" onChange={() => setCategory('')} checked={!category} />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat._id} className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${category === cat.slug ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-800' : 'hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-transparent'}`}>
                    <input type="radio" name="category" className="hidden" checked={category === cat.slug} onChange={() => setCategory(cat.slug)} />
                    <span className={`text-sm font-medium capitalize ${category === cat.slug ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">payments</span>
                <span className="text-sm">Price Range</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" type="number" min="0" placeholder="Min Rs." value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <input className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" type="number" min="0" placeholder="Max Rs." value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">star</span>
                <span className="text-sm">Rating</span>
              </div>
              <div className="flex gap-2">
                {['4', '3', '2'].map((rating) => (
                  <button key={rating} type="button" onClick={() => setMinRating(rating)} className={`flex-1 py-2 rounded-lg font-bold border-2 transition-colors ${minRating === rating ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-400' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-amber-400 hover:text-amber-500'}`}>
                    {rating}+
                  </button>
                ))}
                <button type="button" onClick={() => setMinRating('')} className={`flex-1 py-2 rounded-lg font-bold border-2 transition-colors ${!minRating ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-400' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-500'}`}>
                  Any
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">event_available</span>
                <span className="text-sm">Availability</span>
              </div>
              <select className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold" value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)}>
                <option value="available">Available now</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">sort</span>
                <span className="text-sm">Sort</span>
              </div>
              <select className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="rating">Top rated</option>
                <option value="price">Lowest price</option>
                <option value="priceDesc">Highest price</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <button onClick={applyFilters} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]">
              Apply Filters
            </button>
            <button onClick={resetFilters} className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition-all active:scale-[0.98]">
              Reset Filters
            </button>
          </div>
        </div>
      </aside>

      <section className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Home Services</h1>
            <p className="text-slate-500 mt-2 font-medium">{pagination.total} professional providers found.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-500">Loading providers...</div>
        ) : error ? (
          <div className="flex justify-center py-20 text-rose-500">{error}</div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No providers found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters to see more results.</p>
            <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {providers.map((provider) => {
                const name = providerName(provider);
                return (
                  <div key={provider._id} className="group bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 dark:border-slate-700 transition-all duration-500 flex flex-col">
                    <div className="relative overflow-hidden rounded-[1.5rem] mb-6 shrink-0 bg-indigo-50">
                      <img className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" alt={name} src={providerAvatar(provider) || `https://ui-avatars.com/api/?name=${name}&background=4F46E5&color=fff&size=256`} />
                      <div className="absolute top-4 right-4 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{provider.rating || 'New'}</span>
                      </div>
                    </div>
                    <div className="px-2 pb-2 flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white capitalize">{name}</h3>
                        <span className="text-lg font-black text-indigo-600 text-right">{formatRate(provider.hourlyRate || 0)}</span>
                      </div>
                      <p className="text-slate-500 text-sm font-medium mb-6 capitalize">{provider.category} Specialist</p>
                      <div className="flex items-center gap-6 mb-8 text-slate-500 mt-auto">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-indigo-400">work_history</span>
                          <span className="text-xs font-bold">{provider.experience || 0}+ yrs Exp</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-400">verified</span>
                          <span className="text-xs font-bold text-emerald-600">Verified</span>
                        </div>
                      </div>
                      <Link to={`/provider-details?id=${provider._id}`} className="block w-full py-4 text-center bg-slate-50 dark:bg-slate-700/50 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-300">View Details</Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {pagination.pages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-4">
                <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="px-4 py-2 font-bold text-slate-700 dark:text-slate-300">Page {pagination.page} of {pagination.pages}</span>
                <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
