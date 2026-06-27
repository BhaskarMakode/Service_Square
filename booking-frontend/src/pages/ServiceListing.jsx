import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { categoriesApi, providersApi } from '../services/serviceApi';
import { formatRate } from '../utils/currency';

const distanceOptions = [
  { label: '10 km', value: '10' },
  { label: '25 km', value: '25' },
  { label: '50 km', value: '50' },
  { label: '100 km', value: '100' },
  { label: '200 km', value: '200' },
  { label: 'Anywhere', value: 'anywhere' }
];

const sortOptions = [
  { label: 'Nearest first', value: 'distance' },
  { label: 'Highest rated', value: 'rating' },
  { label: 'Lowest price', value: 'price' },
  { label: 'Highest price', value: 'priceDesc' },
  { label: 'Most booked', value: 'mostBooked' },
  { label: 'Recently added', value: 'newest' }
];

const toFixedDistance = (distanceKm) => {
  if (distanceKm === undefined || distanceKm === null) return 'Distance unavailable';
  return `${Number(distanceKm).toFixed(Number(distanceKm) < 10 ? 1 : 0)} km away`;
};

const arrivalEstimate = (distanceKm) => {
  if (distanceKm === undefined || distanceKm === null) return null;
  const minutes = Math.max(Math.round(Number(distanceKm) * 2.5), 10);
  return `${minutes}-${minutes + 10} min`;
};

export default function ServiceListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationNotice, setLocationNotice] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [coords, setCoords] = useState(null);
  const [manualCoords, setManualCoords] = useState({ latitude: '', longitude: '' });

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    availabilityStatus: searchParams.get('availabilityStatus') || '',
    minExperience: searchParams.get('minExperience') || '',
    radius: searchParams.get('radius') || '100',
    sort: searchParams.get('sort') || 'distance',
    page: Number(searchParams.get('page') || 1)
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesApi.list({ limit: 100 });
        setCategories(res.data.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    requestCurrentLocation({ silent: true });
  }, []);

  const requestCurrentLocation = ({ silent = false } = {}) => {
    if (!navigator.geolocation) {
      setLocationNotice('Browser location is not available. Enter latitude and longitude to filter by distance.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setCoords(nextCoords);
        setManualCoords({
          latitude: String(nextCoords.latitude.toFixed(6)),
          longitude: String(nextCoords.longitude.toFixed(6))
        });
        setLocationNotice('Using your current location for nearby services.');
        setGeoLoading(false);
      },
      () => {
        setCoords(null);
        setLocationNotice(silent ? 'Location permission was not granted. Enter a location or choose Anywhere to view all approved services.' : 'Could not access your location. Enter a location manually or choose Anywhere.');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  };

  const updateFilters = (patch) => {
    setFilters((current) => ({ ...current, ...patch, page: patch.page || 1 }));
  };

  const applyManualLocation = () => {
    const latitude = Number(manualCoords.latitude);
    const longitude = Number(manualCoords.longitude);
    if (Number.isNaN(latitude) || latitude < -90 || latitude > 90 || Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
      setLocationNotice('Enter valid latitude (-90 to 90) and longitude (-180 to 180).');
      return;
    }
    setCoords({ latitude, longitude });
    setLocationNotice('Using your manually entered location.');
  };

  const resetFilters = () => {
    setFilters({
      q: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      availabilityStatus: '',
      minExperience: '',
      radius: '100',
      sort: 'distance',
      page: 1
    });
  };

  const queryParams = useMemo(() => {
    const params = {
      page: filters.page,
      limit: 9,
      sort: filters.sort || 'distance'
    };

    ['q', 'category', 'minPrice', 'maxPrice', 'minRating', 'availabilityStatus', 'minExperience'].forEach((key) => {
      if (filters[key] !== '') params[key] = filters[key];
    });

    if (coords && filters.radius !== 'anywhere') {
      params.latitude = coords.latitude;
      params.longitude = coords.longitude;
      params.radius = filters.radius || '100';
    } else if (coords && filters.radius === 'anywhere') {
      params.latitude = coords.latitude;
      params.longitude = coords.longitude;
      params.radius = 'anywhere';
    }

    return params;
  }, [coords, filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && !(key === 'page' && Number(value) === 1)) params.set(key, String(value));
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await providersApi.search(queryParams);
        setProviders(res.data.data.providers || []);
        setPagination(res.data.data.pagination || { page: 1, pages: 1, total: 0 });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load services');
        setProviders([]);
        setPagination({ page: 1, pages: 1, total: 0 });
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProviders, 250);
    return () => clearTimeout(timeout);
  }, [queryParams]);

  const providerName = (provider) => provider.user?.name || provider.userId?.name || 'Provider';
  const providerAvatar = (provider) => provider.user?.avatar || provider.userId?.avatar;
  const categoryName = (provider) => provider.categoryDetails?.name || provider.categoryId?.name || provider.category || 'Service';
  const serviceName = (provider) => provider.skills?.[0] || categoryName(provider);

  const handlePageChange = (page) => updateFilters({ page });

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 flex gap-10 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl sticky top-28 shadow-sm border border-slate-100 dark:border-slate-700 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="mb-8">
            <BackButton fallback="/" className="mb-5" />
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Filters</h2>
            <p className="text-slate-500 text-sm mt-1">Live approved services near you</p>
          </div>

          <div className="space-y-7">
            <div>
              <label className="flex items-center gap-3 text-slate-500 font-medium mb-3">
                <span className="material-symbols-outlined">search</span>
                <span className="text-sm">Search</span>
              </label>
              <input className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" placeholder="Search service or skill" value={filters.q} onChange={(event) => updateFilters({ q: event.target.value })} />
            </div>

            <div>
              <div className="flex items-center gap-3 text-indigo-600 font-bold mb-4">
                <span className="material-symbols-outlined">category</span>
                <span className="text-sm">Categories</span>
              </div>
              <select className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold" value={filters.category} onChange={(event) => updateFilters({ category: event.target.value })}>
                <option value="">All Categories</option>
                {categories.map((cat) => <option key={cat._id} value={cat.slug}>{cat.name}</option>)}
              </select>
            </div>

            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">my_location</span>
                <span className="text-sm">Location</span>
              </div>
              <button type="button" onClick={() => requestCurrentLocation()} className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-xl font-bold mb-3 disabled:opacity-60" disabled={geoLoading}>
                {geoLoading ? 'Detecting...' : 'Use Current Location'}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <input className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" placeholder="Latitude" value={manualCoords.latitude} onChange={(event) => setManualCoords((current) => ({ ...current, latitude: event.target.value }))} />
                <input className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" placeholder="Longitude" value={manualCoords.longitude} onChange={(event) => setManualCoords((current) => ({ ...current, longitude: event.target.value }))} />
              </div>
              <button type="button" onClick={applyManualLocation} className="mt-2 w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold">Apply Manual Location</button>
            </div>

            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">near_me</span>
                <span className="text-sm">Distance</span>
              </div>
              <select className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold" value={filters.radius} onChange={(event) => updateFilters({ radius: event.target.value })}>
                {distanceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>

            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">payments</span>
                <span className="text-sm">Price Range</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" type="number" min="0" placeholder="Min Rs." value={filters.minPrice} onChange={(event) => updateFilters({ minPrice: event.target.value })} />
                <input className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" type="number" min="0" placeholder="Max Rs." value={filters.maxPrice} onChange={(event) => updateFilters({ maxPrice: event.target.value })} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">star</span>
                <span className="text-sm">Rating</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['4', '3', '2'].map((rating) => (
                  <button key={rating} type="button" onClick={() => updateFilters({ minRating: filters.minRating === rating ? '' : rating })} className={`py-2 rounded-lg font-bold border-2 transition-colors ${filters.minRating === rating ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-400' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'}`}>
                    {rating}+
                  </button>
                ))}
                <button type="button" onClick={() => updateFilters({ minRating: '' })} className={`py-2 rounded-lg font-bold border-2 transition-colors ${!filters.minRating ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-400' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'}`}>
                  Any
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">workspace_premium</span>
                <span className="text-sm">Experience</span>
              </div>
              <select className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold" value={filters.minExperience} onChange={(event) => updateFilters({ minExperience: event.target.value })}>
                <option value="">Any experience</option>
                <option value="1">1+ years</option>
                <option value="3">3+ years</option>
                <option value="5">5+ years</option>
                <option value="10">10+ years</option>
              </select>
            </div>

            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">event_available</span>
                <span className="text-sm">Availability</span>
              </div>
              <select className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold" value={filters.availabilityStatus} onChange={(event) => updateFilters({ availabilityStatus: event.target.value })}>
                <option value="">Any status</option>
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
              <select className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold" value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value })}>
                {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>

            <button onClick={resetFilters} className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition-all active:scale-[0.98]">
              Reset Filters
            </button>
          </div>
        </div>
      </aside>

      <section className="flex-1">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Home Services</h1>
            <p className="text-slate-500 mt-2 font-medium">{pagination.total} active service{pagination.total !== 1 ? 's' : ''} found.</p>
            {locationNotice && <p className="text-sm text-slate-500 mt-2 max-w-2xl">{locationNotice}</p>}
          </div>
          <div className="lg:hidden grid grid-cols-2 gap-3 w-full md:w-auto">
            <select className="px-3 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" value={filters.radius} onChange={(event) => updateFilters({ radius: event.target.value })}>
              {distanceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select className="px-3 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value })}>
              {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-500">Loading services...</div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-6xl text-rose-300 mb-4">error</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Could not load services</h3>
            <p className="text-rose-500 mt-2">{error}</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No services found</h3>
            <p className="text-slate-500 mt-2 text-center max-w-md">Try widening the distance filter, selecting Anywhere, or clearing filters.</p>
            <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {providers.map((provider) => {
                const name = providerName(provider);
                const distance = toFixedDistance(provider.distanceKm);
                const eta = arrivalEstimate(provider.distanceKm);
                const service = serviceName(provider);
                return (
                  <div key={provider._id} className="group bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 dark:border-slate-700 transition-all duration-500 flex flex-col">
                    <div className="relative overflow-hidden rounded-[1.5rem] mb-6 shrink-0 bg-indigo-50">
                      <img className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700" alt={name} src={providerAvatar(provider) || `https://ui-avatars.com/api/?name=${name}&background=4F46E5&color=fff&size=256`} />
                      <div className="absolute top-4 right-4 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{provider.rating ? Number(provider.rating).toFixed(1) : 'New'}</span>
                        <span className="text-xs text-slate-400">({provider.reviewsCount || 0})</span>
                      </div>
                      <div className="absolute top-4 left-4 backdrop-blur-md bg-emerald-50/90 text-emerald-700 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 text-xs font-black">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        Approved
                      </div>
                    </div>
                    <div className="px-2 pb-2 flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <div>
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white capitalize">{service}</h3>
                          <p className="text-slate-500 text-sm font-semibold capitalize mt-1">{name}</p>
                        </div>
                        <span className="text-lg font-black text-indigo-600 text-right">{formatRate(provider.hourlyRate || 0)}</span>
                      </div>
                      <p className="text-slate-500 text-sm font-medium mb-5 capitalize">{categoryName(provider)}</p>
                      <div className="grid grid-cols-2 gap-3 mb-6 text-slate-500 mt-auto">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-indigo-400 text-lg">near_me</span>
                          <span className="text-xs font-bold">{distance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sky-400 text-lg">schedule</span>
                          <span className="text-xs font-bold">{eta || 'ETA unavailable'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-purple-400 text-lg">work_history</span>
                          <span className="text-xs font-bold">{provider.experience || 0}+ yrs Exp</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-lg ${provider.availabilityStatus === 'available' ? 'text-emerald-400' : 'text-slate-400'}`}>radio_button_checked</span>
                          <span className="text-xs font-bold capitalize">{provider.availabilityStatus || 'available'}</span>
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
