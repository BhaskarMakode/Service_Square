import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { formatCurrency, formatRate } from '../utils/currency';

export default function ProviderDetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProviderDetails();
      fetchProviderReviews();
      fetchProviderPortfolio();
    } else {
      setError("No provider ID specified.");
      setLoading(false);
    }
  }, [id]);

  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/providers/${id}`);
      if (res.data.success) {
        setProvider(res.data.data.provider);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch provider details');
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await apiClient.get(`/reviews/provider/${id}`);
      if (res.data.success) {
        setReviews(res.data.data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchProviderPortfolio = async () => {
    try {
      setPortfolioLoading(true);
      const res = await apiClient.get(`/portfolio/${id}`);
      if (res.data.success) {
        setPortfolio(res.data.data.portfolio || []);
      }
    } catch (err) {
      console.error('Failed to fetch portfolio:', err);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-32 flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-slate-500 animate-pulse">Loading Provider Details...</div>
      </main>
    );
  }

  if (error || !provider) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-32 flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-500 p-8 rounded-2xl shadow-sm text-center">
          <span className="material-symbols-outlined text-4xl mb-2">error</span>
          <h2 className="text-xl font-bold">{error || "Provider not found"}</h2>
          <Link to="/services" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">Back to Services</Link>
        </div>
      </main>
    );
  }

  const name = provider.userId?.name || provider.fullName || "Professional Provider";
  const avatarUrl = provider.userId?.avatar || `https://ui-avatars.com/api/?name=${name}&background=4F46E5&color=fff&size=512`;

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Profile Section */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Asymmetric Image Layout */}
          <div className="lg:col-span-7 relative">
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-indigo-50 shadow-xl">
              <img alt={name} className="w-full h-full object-cover" src={avatarUrl}/>
            </div>
            {/* Glassmorphic Overlay Chip */}
            <div className="absolute -bottom-6 -right-6 md:right-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 rounded-xl shadow-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">{provider.verificationStatus || 'Verified'} Expert</div>
              </div>
            </div>
          </div>
          {/* Provider Identity */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-400">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-bold text-slate-800 dark:text-white ml-1">{provider.rating || 'New'}</span>
              </div>
              <span className="text-slate-500 font-medium">({provider.reviewsCount || 0} Reviews)</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white capitalize">{name}</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8 capitalize">
                Senior {provider.category} Specialist with over {provider.experience || 1} years of experience crafting exceptional solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <span className="material-symbols-outlined text-indigo-600">location_on</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{provider.address || 'Location Not Provided'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid (Bento Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* About Section (Spans 2) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-50 dark:bg-slate-800 p-10 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-indigo-600">person</span>
                  About Provider
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>{provider.bio || `${name} specializes in ${provider.category || 'home'} services. With a focus on quality and customer satisfaction, they have successfully completed numerous projects in their career.`}</p>
                {provider.skills && provider.skills.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-3">Core Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services & Pricing List */}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-indigo-600">list_alt</span>
                  Services & Pricing
              </h2>
              <div className="space-y-6">
                {provider.services && provider.services.filter(s => s.isActive).length > 0 ? (
                  provider.services.filter(s => s.isActive).map((service) => (
                    <div key={service._id} className="flex justify-between items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <span className="material-symbols-outlined">work</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900 dark:text-white capitalize">{service.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{service.description || `Professional ${provider.category || 'service'} assistance`}</p>
                          <span className="text-xs text-slate-400 font-semibold">{service.duration} mins duration</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="text-xl font-bold text-indigo-600">{formatCurrency(service.price)}</div>
                        <Link to={`/booking?providerId=${provider._id}&serviceId=${service._id}`} className="mt-3 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors">Book Now</Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <span className="material-symbols-outlined">work</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white capitalize">Standard Service</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Professional {provider.category || 'service'} assistance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-indigo-600">{formatCurrency(provider.hourlyRate || 50)}</div>
                      <div className="text-xs text-slate-500">per hour</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Showcase Portfolio Section */}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-indigo-600">photo_library</span>
                  Projects & Work Showcase
              </h2>
              {portfolioLoading ? (
                <div className="text-slate-500 animate-pulse font-medium">Loading portfolio...</div>
              ) : portfolio.length === 0 ? (
                <div className="text-slate-500 p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center">
                  <p>No showcase projects uploaded by this provider yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {portfolio.map((item, idx) => {
                    const imageUrl = item.images && item.images[0] ? getImageUrl(item.images[0].url) : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
                    return (
                      <div 
                        key={item._id || idx} 
                        onClick={() => setSelectedProject(item)}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 cursor-pointer"
                      >
                        <img src={imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.title || "Portfolio Work"}/>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                          <button className="w-10 h-10 bg-white rounded-full text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform mb-2">
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          <span className="text-white font-bold text-sm px-2 text-center drop-shadow-md">{item.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-amber-500">reviews</span>
                  Customer Reviews
              </h2>
              {reviewsLoading ? (
                <div className="text-slate-500 animate-pulse font-medium">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-slate-500 p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center">
                  <p>No reviews yet for this provider.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-slate-100 dark:border-slate-700 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={review.customerId?.avatar || `https://ui-avatars.com/api/?name=${review.customerId?.name || 'Customer'}&background=random`} 
                            alt="Customer avatar" 
                            className="w-10 h-10 rounded-full object-cover bg-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm capitalize">{review.customerId?.name || 'Customer'}</div>
                            <div className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex text-amber-400 text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Side Content */}
          <div className="space-y-8">
            {/* Profile Stats Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-xl text-white shadow-xl shadow-indigo-200 dark:shadow-none">
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined opacity-70">history</span>
                  <div>
                    <div className="text-2xl font-bold">{provider.experience * 15 || 42}</div>
                    <div className="text-xs uppercase tracking-wider opacity-70">Projects Completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined opacity-70">schedule</span>
                  <div>
                    <div className="text-2xl font-bold capitalize">{provider.availabilityStatus || 'Available'}</div>
                    <div className="text-xs uppercase tracking-wider opacity-70">Current Status</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined opacity-70">workspace_premium</span>
                  <div>
                    <div className="text-2xl font-bold uppercase">{provider.verificationStatus || 'Pending'}</div>
                    <div className="text-xs uppercase tracking-wider opacity-70">Account Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Floating CTA */}
      <div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-slate-700/50 p-3 rounded-full shadow-2xl flex items-center gap-6 px-8 max-w-lg mx-auto">
          <div className="hidden md:block">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Hourly Rate</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{formatRate(provider.hourlyRate || 50)}</div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
          <Link to={`/booking?providerId=${provider._id}`} className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-4 px-12 rounded-full shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all duration-300 text-center flex items-center justify-center">
            Book Now
          </Link>
        </div>
      </div>

      {/* View Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white capitalize">{selectedProject.title}</h3>
              <button 
                type="button" 
                onClick={() => setSelectedProject(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-slate-500 dark:text-slate-300"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 dark:border-slate-700">
                <img 
                  src={selectedProject.images && selectedProject.images[0] ? getImageUrl(selectedProject.images[0].url) : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'} 
                  className="w-full h-full object-cover" 
                  alt={selectedProject.title}
                />
              </div>
              
              {selectedProject.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Project Description</h4>
                  <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/40">
                    {selectedProject.description}
                  </p>
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
