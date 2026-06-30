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
  const [locationSearch, setLocationSearch] = useState('');

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

  const applyManualLocation = async () => {
    if (!locationSearch.trim()) {
      setLocationNotice('Please enter a city or area name.');
      return;
    }
    setGeoLoading(true);
    setLocationNotice('Searching for location...');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setCoords({
          latitude: Number(data[0].lat),
          longitude: Number(data[0].lon)
        });
        setLocationNotice(`Using location: ${data[0].display_name.split(',')[0]}`);
        setLocationSearch('');
      } else {
        setLocationNotice('Location not found. Try a different city name.');
      }
    } catch (err) {
      setLocationNotice('Failed to search location. Try again.');
    } finally {
      setGeoLoading(false);
    }
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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-['Inter'] text-sm">
      <main className="max-w-[1600px] mx-auto flex flex-col relative">
        
        {/* Search & Location Bar */}
        <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center gap-6 sticky top-20 z-30">
          <div className="w-full md:w-auto flex-1 max-w-4xl flex flex-col sm:flex-row items-center gap-4">
            {/* Global Search */}
            <div className="flex w-full sm:w-auto items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-full flex-1 min-w-[250px] shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/30 transition-shadow">
              <span className="material-symbols-outlined text-indigo-600 text-[20px]">search</span>
              <input 
                  className="bg-transparent border-none text-sm font-semibold text-slate-900 dark:text-white outline-none w-full placeholder-slate-400"
                  placeholder="Search for providers, services, categories..."
                  value={filters.q} 
                  onChange={(event) => updateFilters({ q: event.target.value })} 
              />
            </div>
            {/* Location Selector */}
            <div className="flex w-full sm:w-auto items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-full min-w-[250px] shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/30 transition-shadow">
              <span className="material-symbols-outlined text-indigo-600 text-[20px]">location_on</span>
              <input 
                  className="bg-transparent border-none text-sm font-semibold text-slate-900 dark:text-white outline-none w-full placeholder-slate-400"
                  placeholder="e.g. Mumbai, Delhi"
                  value={locationSearch} 
                  onChange={(event) => setLocationSearch(event.target.value)} 
                  onKeyDown={(e) => { if(e.key === 'Enter') applyManualLocation(); }}
              />
              <button onClick={applyManualLocation} className="text-slate-400 hover:text-indigo-600 pr-2 border-r border-slate-200 dark:border-slate-700" title="Search Location">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
              <button onClick={() => requestCurrentLocation()} className="text-slate-400 hover:text-indigo-600 pl-1" title="Use Current Location">
                <span className="material-symbols-outlined text-[20px]">my_location</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row px-6 lg:px-10 py-8 gap-10 w-full">
          
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-48 space-y-8 pr-2">
              
              {/* Categories */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center justify-between mb-4 cursor-pointer text-sm">
                  Category
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">expand_less</span>
                </h3>
                <select className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" value={filters.category} onChange={(event) => updateFilters({ category: event.target.value })}>
                  <option value="">All Categories</option>
                  {categories.map((cat) => <option key={cat._id} value={cat.slug}>{cat.name}</option>)}
                </select>
              </div>

              {/* Distance */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center justify-between mb-4 cursor-pointer text-sm border-t border-slate-100 dark:border-slate-800 pt-6">
                  Distance
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">expand_less</span>
                </h3>
                <select className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" value={filters.radius} onChange={(event) => updateFilters({ radius: event.target.value })}>
                  {distanceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center justify-between mb-4 cursor-pointer text-sm border-t border-slate-100 dark:border-slate-800 pt-6">
                  Price Range
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">expand_less</span>
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="priceRange" className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 cursor-pointer" 
                           checked={!filters.minPrice && !filters.maxPrice} 
                           onChange={() => updateFilters({ minPrice: '', maxPrice: '' })} />
                    <span className={`text-sm ${!filters.minPrice && !filters.maxPrice ? 'text-indigo-600 font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>All Prices</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="priceRange" className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 cursor-pointer" 
                           checked={filters.maxPrice === '499'} 
                           onChange={() => updateFilters({ minPrice: '', maxPrice: '499' })} />
                    <span className={`text-sm ${filters.maxPrice === '499' ? 'text-indigo-600 font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>Under ₹499</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="priceRange" className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 cursor-pointer" 
                           checked={filters.minPrice === '500' && filters.maxPrice === '999'} 
                           onChange={() => updateFilters({ minPrice: '500', maxPrice: '999' })} />
                    <span className={`text-sm ${filters.minPrice === '500' && filters.maxPrice === '999' ? 'text-indigo-600 font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>₹500 - ₹999</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="priceRange" className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 cursor-pointer" 
                           checked={filters.minPrice === '1000' && filters.maxPrice === '1999'} 
                           onChange={() => updateFilters({ minPrice: '1000', maxPrice: '1999' })} />
                    <span className={`text-sm ${filters.minPrice === '1000' && filters.maxPrice === '1999' ? 'text-indigo-600 font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>₹1000 - ₹1999</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="priceRange" className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 cursor-pointer" 
                           checked={filters.minPrice === '2000'} 
                           onChange={() => updateFilters({ minPrice: '2000', maxPrice: '' })} />
                    <span className={`text-sm ${filters.minPrice === '2000' ? 'text-indigo-600 font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>Above ₹2000</span>
                  </label>
                  
                  {/* Slider visualization */}
                  <div className="pt-3 pb-1">
                     <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full relative">
                        <div className="absolute h-full bg-indigo-600 rounded-full left-0 right-1/4"></div>
                        <div className="absolute w-3 h-3 bg-indigo-600 border-2 border-white rounded-full top-1/2 -translate-y-1/2 left-0 shadow"></div>
                        <div className="absolute w-3 h-3 bg-indigo-600 border-2 border-white rounded-full top-1/2 -translate-y-1/2 right-1/4 shadow"></div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-white dark:bg-slate-900 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 flex-1 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span className="text-slate-400">₹</span>
                      <input type="number" className="bg-transparent border-none w-full outline-none p-0 focus:ring-0" placeholder="0" value={filters.minPrice} onChange={(e) => updateFilters({ minPrice: e.target.value })} />
                    </div>
                    <span className="text-slate-400 text-xs font-medium">to</span>
                    <div className="bg-white dark:bg-slate-900 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 flex-1 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span className="text-slate-400">₹</span>
                      <input type="number" className="bg-transparent border-none w-full outline-none p-0 focus:ring-0" placeholder="5000" value={filters.maxPrice} onChange={(e) => updateFilters({ maxPrice: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center justify-between mb-4 cursor-pointer text-sm border-t border-slate-100 dark:border-slate-800 pt-6">
                  Rating
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">expand_less</span>
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {['4', '3', '2'].map((rating) => (
                    <button key={rating} type="button" onClick={() => updateFilters({ minRating: filters.minRating === rating ? '' : rating })} className={`py-1.5 rounded-md font-bold text-xs border transition-colors flex items-center justify-center gap-0.5 ${filters.minRating === rating ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-400' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                      {rating}+ <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </button>
                  ))}
                  <button type="button" onClick={() => updateFilters({ minRating: '' })} className={`py-1.5 rounded-md font-bold text-xs border transition-colors ${!filters.minRating ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-400' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    Any
                  </button>
                </div>
              </div>



              <button onClick={resetFilters} className="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 mt-6">
                Reset Filters
                <span className="material-symbols-outlined text-[16px]">sync</span>
              </button>
            </div>
          </aside>

          {/* Service List Area */}
          <section className="flex-1 min-w-0">
            
            {/* Header & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  All Services
                  {locationNotice && <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-200/50 uppercase tracking-widest">{locationNotice}</span>}
                </h1>
                <p className="text-slate-500 text-sm mt-1">Find the best professionals for your needs</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                   <button className="p-1.5 bg-white dark:bg-slate-700 shadow-sm rounded-md text-slate-900 dark:text-white flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                   <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">grid_view</span></button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-medium">Sort by:</span>
                  <select className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px] shadow-sm" value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value })}>
                    {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-6xl text-rose-300 mb-4">error</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Could not load services</h3>
                <p className="text-rose-500 mt-2">{error}</p>
              </div>
            ) : providers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No services found</h3>
                <p className="text-slate-500 mt-2 text-center max-w-md">Try widening the distance filter, changing location, or clearing filters.</p>
                <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors">Clear Filters</button>
              </div>
            ) : (
              <div className="space-y-4">
                {providers.map((provider) => {
                  const name = providerName(provider);
                  const distance = toFixedDistance(provider.distanceKm);
                  const eta = arrivalEstimate(provider.distanceKm);
                  const service = serviceName(provider);
                  const avatar = providerAvatar(provider) || `https://ui-avatars.com/api/?name=${name}&background=4F46E5&color=fff&size=256`;
                  
                  return (
                    <div key={provider._id} className="group bg-white dark:bg-slate-900 rounded-2xl p-4 flex flex-col md:flex-row gap-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300">
                      
                      {/* Image Column */}
                      <div className="relative w-full md:w-[240px] h-48 md:h-auto shrink-0 rounded-xl overflow-hidden bg-slate-100">
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={name} src={avatar} />
                        {provider.availabilityStatus === 'available' && (
                          <div className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-widest">
                            Available Now
                          </div>
                        )}
                        <button className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm transition-all">
                          <span className="material-symbols-outlined text-[16px]">favorite_border</span>
                        </button>
                      </div>

                      {/* Content Column */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white capitalize leading-tight">{service}</h2>
                          </div>
                          
                          <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2 capitalize">
                             {name}
                             {provider.verificationStatus === 'approved' && (
                               <span className="material-symbols-outlined text-indigo-600 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                             )}
                             <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                             <span className="flex items-center text-amber-500 text-xs font-black gap-0.5">
                               <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                               {provider.rating ? Number(provider.rating).toFixed(1) : 'New'}
                             </span>
                             <span className="text-slate-400 text-xs font-medium">({provider.reviewsCount || 0} Reviews)</span>
                             <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                             <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">{provider.experience || 0}+ Years</span>
                          </p>

                          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed pr-4">
                            Professional {categoryName(provider)} service by {name}. Experienced in all types of {service.toLowerCase()} solutions. Fast, reliable, and affordable services tailored for your home.
                          </p>
                        </div>
                        
                        {/* Features Badges */}
                        <div className="flex flex-wrap gap-4 mt-4">
                           <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                             <span className="material-symbols-outlined text-[16px]">eco</span>
                             Eco Friendly
                           </div>
                           <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                             <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                             Background Verified
                           </div>
                           <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                             <span className="material-symbols-outlined text-[16px]">alarm_on</span>
                             On-time Service
                           </div>
                           <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                             <span className="material-symbols-outlined text-[16px]">near_me</span>
                             {distance}
                           </div>
                        </div>
                      </div>

                      {/* Pricing Column */}
                      <div className="w-full md:w-[160px] shrink-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6 flex flex-col justify-center py-1 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                         <div className="text-left md:text-right md:mb-4">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starting from</p>
                           <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1.5">{formatRate(provider.hourlyRate || 0)}</p>
                           <p className="text-[10px] text-slate-500 font-medium mt-1">Per Session</p>
                         </div>
                         
                         <div className="mt-3 md:mt-0">
                           <Link to={`/provider-details?id=${provider._id}`} className="block w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm transition-all text-sm">
                             Book Now
                           </Link>
                           <p className="text-[10px] text-slate-400 font-medium mt-2 text-center">
                             Usually responds in {eta || '15 mins'}
                           </p>
                         </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Footer */}
            {!loading && !error && providers.length > 0 && (
              <div className="mt-6 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                <p className="text-xs text-slate-500 font-medium mb-4 md:mb-0">
                  Showing {(pagination.page - 1) * 9 + 1} to {Math.min(pagination.page * 9, pagination.total)} of {pagination.total} services
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="w-7 h-7 flex items-center justify-center rounded border border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    {pagination.page}
                  </button>
                  {pagination.pages > pagination.page && (
                     <button onClick={() => handlePageChange(pagination.page + 1)} className="w-7 h-7 flex items-center justify-center rounded border border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium">
                       {pagination.page + 1}
                     </button>
                  )}
                  {pagination.pages > pagination.page + 1 && (
                     <span className="px-1 text-slate-400 text-xs">...</span>
                  )}
                  {pagination.pages > pagination.page + 1 && (
                     <button onClick={() => handlePageChange(pagination.pages)} className="w-7 h-7 flex items-center justify-center rounded border border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium">
                       {pagination.pages}
                     </button>
                  )}
                  <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="w-7 h-7 flex items-center justify-center rounded border border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
            
          </section>
        </div>
      </main>
    </div>
  );
}
