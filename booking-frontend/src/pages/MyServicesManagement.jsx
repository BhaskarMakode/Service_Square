import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriesApi, providersApi } from '../services/serviceApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/currency';
import BackButton from '../components/BackButton';

const getCategoryIcon = (categorySlug) => {
  const mapping = {
    'electrician': 'electrical_services',
    'hair-beauty': 'content_cut',
    'mechanic': 'build',
    'puncture-tyre': 'tire_repair',
    'plumbing': 'plumbing',
    'ac-service': 'ac_unit'
  };
  return mapping[categorySlug?.toLowerCase()] || 'work';
};

const getCategoryBgColor = (categorySlug) => {
  const mapping = {
    'electrician': 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
    'hair-beauty': 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    'mechanic': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    'puncture-tyre': 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    'plumbing': 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    'ac-service': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
  };
  return mapping[categorySlug?.toLowerCase()] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
};

export default function MyServicesManagement() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [providerProfile, setProviderProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null); // null for Add, service object for Edit
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    isActive: true
  });

  useEffect(() => {
    if (!user || user.role !== 'provider') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [profileRes, categoriesRes] = await Promise.all([
        providersApi.myProfile(),
        categoriesApi.list({ limit: 100 })
      ]);

      if (profileRes.data.success) {
        const profile = profileRes.data.data.providerProfile;
        if (!profile) {
          navigate('/onboarding-1');
          return;
        }
        setProviderProfile(profile);
        setServices(profile.services || []);
      }

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data.categories || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (serviceId) => {
    try {
      const updatedServices = services.map(s => 
        s._id === serviceId ? { ...s, isActive: !s.isActive } : s
      );
      
      const res = await providersApi.update({ services: updatedServices });
      if (res.data.success) {
        setServices(updatedServices);
        addToast("Service availability status updated.", "success");
      }
    } catch (err) {
      addToast(err.response?.data?.message || err.message || "Failed to update status.", "error");
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const updatedServices = services.filter(s => s._id !== serviceId);
      const res = await providersApi.update({ services: updatedServices });
      if (res.data.success) {
        setServices(updatedServices);
        addToast("Service removed from catalog.", "success");
      }
    } catch (err) {
      addToast(err.response?.data?.message || err.message || "Failed to delete service.", "error");
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setForm({
      title: '',
      description: '',
      price: '',
      duration: '',
      isActive: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setForm({
      title: service.title,
      description: service.description || '',
      price: String(service.price),
      duration: String(service.duration),
      isActive: service.isActive
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      addToast("Service title is required.", "error");
      return;
    }
    if (!form.price || Number(form.price) < 0) {
      addToast("Please enter a valid price.", "error");
      return;
    }
    if (!form.duration || Number(form.duration) < 1) {
      addToast("Please enter a valid duration (minimum 1 minute).", "error");
      return;
    }

    try {
      let updatedServices;
      if (editingService) {
        updatedServices = services.map(s => 
          s._id === editingService._id 
            ? { 
                ...s, 
                title: form.title.trim(), 
                description: form.description.trim(), 
                price: Number(form.price), 
                duration: Number(form.duration), 
                isActive: form.isActive 
              } 
            : s
        );
      } else {
        const newService = {
          title: form.title.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          duration: Number(form.duration),
          isActive: form.isActive
        };
        updatedServices = [...services, newService];
      }

      const res = await providersApi.update({ services: updatedServices });
      if (res.data.success) {
        // Backend returns updated profile in res.data.data.provider
        const updatedProfile = res.data.data.provider;
        setServices(updatedProfile.services || updatedServices);
        addToast(editingService ? "Service updated successfully." : "Service added successfully.", "success");
        setModalOpen(false);
      }
    } catch (err) {
      addToast(err.response?.data?.message || err.message || "Failed to save service.", "error");
    }
  };

  const providerName = providerProfile?.userId?.name || user?.name || 'Rahul Sharma';
  const providerAvatar = providerProfile?.userId?.avatar || user?.avatar || 'https://ui-avatars.com/api/?name=Provider&background=4F46E5&color=fff';
  const providerRoleLabel = providerProfile?.isPremium ? 'Gold Provider' : 'Standard Provider';

  return (
    <>
      {/* SideNavBar (Authority: JSON) */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col gap-2 p-4 pt-20 z-40">
        <div className="mb-8 px-4">
          <h1 className="text-lg font-black text-indigo-700 dark:text-indigo-400">Service Square</h1>
          <p className="text-xs text-on-surface-variant font-medium">Provider Portal</p>
        </div>
        <nav className="flex flex-col gap-2">
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl hover:translate-x-1 transition-transform duration-200" to="/provider-panel">
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
            <span className="text-sm font-medium Inter">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl hover:translate-x-1 transition-transform duration-200" to="/provider-panel">
            <span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
            <span className="text-sm font-medium Inter">Bookings</span>
          </Link>
          {/* Active State: My Services */}
          <Link className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-xl shadow-sm hover:translate-x-1 transition-transform duration-200 font-semibold" to="/my-services">
            <span className="material-symbols-outlined" data-icon="build">build</span>
            <span className="text-sm font-medium Inter">My Services</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl hover:translate-x-1 transition-transform duration-200" to="/provider-availability">
            <span className="material-symbols-outlined" data-icon="event_available">event_available</span>
            <span className="text-sm font-medium Inter">Availability</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl hover:translate-x-1 transition-transform duration-200" to="/provider-earnings">
            <span className="material-symbols-outlined" data-icon="payments">payments</span>
            <span className="text-sm font-medium Inter">Earnings</span>
          </Link>
        </nav>
        <div className="mt-auto p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <p className="text-xs text-indigo-900 dark:text-indigo-300 mb-2 font-semibold">Need help?</p>
          <Link to="/help" className="block w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold transition-transform active:scale-95 text-center">Support Center</Link>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-30 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none h-16">
        <div className="flex justify-between items-center px-6 h-full w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8 ml-64">
            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Service Square Provider</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4">
              <div className="text-right">
                <p className="text-sm font-bold leading-none capitalize">{providerName}</p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-bold mt-1">{providerRoleLabel}</p>
              </div>
              <img className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900" alt="Provider Avatar" src={providerAvatar} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-24 pb-12 px-8 max-w-[1440px] mx-auto min-h-screen bg-slate-50 dark:bg-slate-900/40">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">Service Catalog</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">Manage your professional service offerings, pricing, and availability. Use high-quality descriptions to attract more customers.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-100/30">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400" data-icon="verified_user">verified_user</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">{providerProfile?.verificationStatus || 'Pending'} Provider</span>
            </div>
            <button onClick={handleOpenAdd} className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <span className="material-symbols-outlined" data-icon="add">add</span>
              Add New Service
            </button>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-500 font-bold animate-pulse">Loading catalog...</div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center font-medium max-w-xl mx-auto">
            <span className="material-symbols-outlined text-4xl mb-2 text-red-500">error</span>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Bento Grid Layout for Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {services.map((service) => {
                const categorySlug = providerProfile?.category || '';
                const icon = getCategoryIcon(categorySlug);
                const bgColors = getCategoryBgColor(categorySlug);

                return (
                  <div key={service._id} className={`rounded-3xl p-6 group transition-all duration-300 relative border flex flex-col justify-between ${
                    service.isActive 
                      ? 'bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 border-slate-100 dark:border-slate-700' 
                      : 'bg-slate-100/50 dark:bg-slate-800/30 border-dashed border-slate-200 dark:border-slate-700 opacity-70'
                  }`}>
                    {/* Toggle Switch */}
                    <div className="absolute top-6 right-6 z-10">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={service.isActive} 
                          onChange={() => handleToggleStatus(service._id)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div>
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${bgColors}`}>
                          <span className="material-symbols-outlined text-2xl">{icon}</span>
                        </div>
                        <div>
                          <span className="inline-block px-2.5 py-1 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold rounded-md mb-2 uppercase tracking-wider">
                            {providerProfile?.category || 'Service'}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight capitalize">
                            {service.title}
                          </h3>
                          {service.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                              {service.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Detail Metrics */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl mb-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Price</span>
                          <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Duration</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {service.duration} mins
                          </span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Status</span>
                          <span className={`text-[10px] font-extrabold flex items-center gap-1.5 ${service.isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${service.isActive ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                            {service.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700/50 pt-4">
                      <button onClick={() => handleOpenEdit(service)} className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                        <span className="material-symbols-outlined text-xl" data-icon="edit">edit</span>
                      </button>
                      <button onClick={() => handleDelete(service._id)} className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors">
                        <span className="material-symbols-outlined text-xl" data-icon="delete">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add New Card Slot */}
              <button onClick={handleOpenAdd} className="bg-transparent hover:bg-white dark:hover:bg-slate-800/40 rounded-3xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center min-h-[280px] group transition-all duration-300 hover:border-indigo-600/50">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-3xl" data-icon="add">add</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Expand Your Catalog</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm text-center px-6 mt-2">Add more specific services to increase your booking potential.</p>
              </button>

            </div>

            {/* Performance overview placeholders or sections */}
            <section className="mt-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Service Performance</h2>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-3xl p-8 text-white shadow-lg shadow-indigo-900/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Total Services Offered</p>
                  <h4 className="text-3xl font-black mb-4 leading-tight">{services.length}</h4>
                  <div className="text-sm font-medium opacity-70">
                    {services.filter(s => s.isActive).length} active, {services.filter(s => !s.isActive).length} inactive
                  </div>
                </div>
                <div className="md:col-span-3 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8">
                  <div className="shrink-0 w-32 h-32 relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-slate-100 dark:text-slate-700" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                      <circle className="text-indigo-600 dark:text-indigo-400" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="72.8" strokeWidth="8"></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">80%</span>
                      <span className="text-[8px] font-bold uppercase text-slate-500">Efficiency</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Service Completion Rate</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md">Your services are performing well. Maintaining an 80%+ completion rate keeps you in the "Top Rated" tier, providing higher visibility to local customers.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Modern sliding Add/Edit Modal (Glassmorphism Dialog) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 max-w-lg w-full overflow-hidden transform scale-100 transition-all duration-300">
            <header className="px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingService ? 'Edit Service Details' : 'Add New Service'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)} 
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wide uppercase text-slate-500" htmlFor="modal-title">
                  Service Title *
                </label>
                <input 
                  id="modal-title"
                  type="text"
                  required
                  placeholder="e.g., Ceiling Fan Repair & Installation"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wide uppercase text-slate-500" htmlFor="modal-price">
                    Price (₹) *
                  </label>
                  <input 
                    id="modal-price"
                    type="number"
                    min="0"
                    required
                    placeholder="599"
                    value={form.price}
                    onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wide uppercase text-slate-500" htmlFor="modal-duration">
                    Duration (mins) *
                  </label>
                  <input 
                    id="modal-duration"
                    type="number"
                    min="1"
                    required
                    placeholder="45"
                    value={form.duration}
                    onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wide uppercase text-slate-500" htmlFor="modal-desc">
                  Description
                </label>
                <textarea 
                  id="modal-desc"
                  rows="3"
                  placeholder="Detail what is included in this service..."
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  id="modal-active"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 accent-indigo-600 rounded"
                />
                <label htmlFor="modal-active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 select-none">
                  Service is active and open for booking
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 h-12 bg-transparent border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]">
                  Cancel
                </button>
                <button type="submit" className="flex-1 h-12 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:brightness-110 active:scale-[0.98] transition-all">
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
