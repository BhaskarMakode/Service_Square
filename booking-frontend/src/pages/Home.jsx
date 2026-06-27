import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { formatCurrency } from '../utils/currency';

function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/search/trending?limit=3');
        if (res.data.success) {
          setTrending(res.data.data.providers || []);
        }
      } catch (err) {
        console.error('Failed to load trending professionals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <h1 className="text-6xl md:text-7xl font-black tracking-tight text-on-surface leading-[1.1] mb-6">
              Find Trusted <span className="text-primary">Services</span> Near You
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed mb-10 max-w-lg">
              Connect with verified professionals for your home, car, and lifestyle needs. Expert help is just a few clicks away.
            </p>
            <div className="bg-surface-container-lowest editorial-shadow rounded-2xl p-3 flex flex-col md:flex-row gap-3 max-w-2xl border border-outline-variant/10">
              <div className="flex-1 flex items-center px-4 py-3 bg-surface-container-high rounded-xl gap-3">
                <span className="material-symbols-outlined text-outline">search</span>
                <input
                  className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline"
                  placeholder="What service do you need?"
                  type="text"
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-3 bg-surface-container-high rounded-xl gap-3">
                <span className="material-symbols-outlined text-outline">location_on</span>
                <input
                  className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline"
                  placeholder="Your location"
                  type="text"
                />
              </div>
              <Link to="/service-listing" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold tracking-tight hover:brightness-110 active:scale-[0.98] transition-all text-center">
                Book Now
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden editorial-shadow transform rotate-3 scale-105">
              <img
                className="w-full h-[600px] object-cover"
                alt="Professional electrician working on a circuit board"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHNBhG_jSXW2Y1BomWHo7JcmcXmSJQGRo7JjwDHLghSGi4feHVSNICGiIF5i2ElYuYsJGudMQWarobzaqOX6lMaRkqQ-wrIhF6X_tuZJPmbZ6vHLT2kX4SHhaHvOjZSelFYb0jfEi_P4IjwjLaBKrQrbJS9bUwIVXsPWnWDBYgr75zfhQpIxSaNqJ11aywjf8PwYTyOTFlPNO0h9K6azWGot5f3yy2bWoaozWNbpr2rNxj3xRiduTFpn_cE3T1gQqcNjtYOCXpcSc"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-surface-container-lowest p-6 rounded-2xl editorial-shadow max-w-xs border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">verified</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Verified Experts</p>
                  <p className="text-sm text-on-surface-variant">100% Background checked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent"></div>
      </section>

      {/* Service Categories */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-4">Popular Categories</h2>
              <p className="text-on-surface-variant text-lg">Browse through our most requested professional services.</p>
            </div>
            <Link to="/services" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View all services <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Electrician */}
            <Link to="/service-listing" className="bg-surface-container-lowest p-8 rounded-[2rem] editorial-shadow text-center group hover:-translate-y-2 transition-all cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary-container/30 text-secondary mx-auto mb-6 organic-square flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">bolt</span>
              </div>
              <h3 className="font-bold text-on-surface">Electrician</h3>
            </Link>
            {/* Plumber */}
            <Link to="/service-listing" className="bg-surface-container-lowest p-8 rounded-[2rem] editorial-shadow text-center group hover:-translate-y-2 transition-all cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary-container/30 text-secondary mx-auto mb-6 organic-square flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">plumbing</span>
              </div>
              <h3 className="font-bold text-on-surface">Plumber</h3>
            </Link>
            {/* Cleaning */}
            <Link to="/service-listing" className="bg-surface-container-lowest p-8 rounded-[2rem] editorial-shadow text-center group hover:-translate-y-2 transition-all cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary-container/30 text-secondary mx-auto mb-6 organic-square flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">cleaning_services</span>
              </div>
              <h3 className="font-bold text-on-surface">Cleaning</h3>
            </Link>
            {/* Mechanic */}
            <Link to="/service-listing" className="bg-surface-container-lowest p-8 rounded-[2rem] editorial-shadow text-center group hover:-translate-y-2 transition-all cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary-container/30 text-secondary mx-auto mb-6 organic-square flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">build</span>
              </div>
              <h3 className="font-bold text-on-surface">Mechanic</h3>
            </Link>
            {/* Carpenter */}
            <Link to="/service-listing" className="bg-surface-container-lowest p-8 rounded-[2rem] editorial-shadow text-center group hover:-translate-y-2 transition-all cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary-container/30 text-secondary mx-auto mb-6 organic-square flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">carpenter</span>
              </div>
              <h3 className="font-bold text-on-surface">Carpenter</h3>
            </Link>
            {/* Painter */}
            <Link to="/service-listing" className="bg-surface-container-lowest p-8 rounded-[2rem] editorial-shadow text-center group hover:-translate-y-2 transition-all cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary-container/30 text-secondary mx-auto mb-6 organic-square flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">format_paint</span>
              </div>
              <h3 className="font-bold text-on-surface">Painter</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight mb-20">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Step 1 */}
            <div className="relative">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-black">1</div>
              <h3 className="text-2xl font-bold mb-4">Search</h3>
              <p className="text-on-surface-variant">Find the right professional based on your needs, location, and budget.</p>
            </div>
            {/* Step 2 */}
            <div className="relative">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-black">2</div>
              <h3 className="text-2xl font-bold mb-4">Book</h3>
              <p className="text-on-surface-variant">Select a time slot that works for you and confirm your booking instantly.</p>
            </div>
            {/* Step 3 */}
            <div className="relative">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-black">3</div>
              <h3 className="text-2xl font-bold mb-4">Get Service</h3>
              <p className="text-on-surface-variant">Sit back while our verified professional takes care of the job.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Professionals */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Top Rated Professionals</h2>
            <p className="text-on-surface-variant text-lg">The highest-rated experts in your community.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-12 text-slate-500 font-bold animate-pulse">
                Loading Top Rated Professionals...
              </div>
            ) : trending.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-500 font-semibold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                No verified professionals found in your area yet.
              </div>
            ) : (
              trending.map((p) => {
                const u = p.user || {};
                return (
                  <div key={p._id} className="bg-surface-container-lowest rounded-3xl overflow-hidden editorial-shadow group border border-outline-variant/5 flex flex-col justify-between">
                    <div>
                      <div className="relative h-64 overflow-hidden bg-indigo-50">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={u.name || 'Professional'}
                          src={u.avatar || `https://ui-avatars.com/api/?name=${u.name || 'Provider'}&background=4F46E5&color=fff`}
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-sm font-bold">{p.rating ? p.rating.toFixed(1) : '5.0'}</span>
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-xl font-bold text-on-surface mb-1 capitalize">{u.name || 'Service Partner'}</h3>
                        <p className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider capitalize">{p.category} Specialist</p>
                        <p className="text-on-surface-variant mb-6 line-clamp-2 text-sm leading-relaxed">
                          Expert {p.category} services with {p.experience}+ years of professional experience. High-quality work guaranteed.
                        </p>
                      </div>
                    </div>
                    <div className="p-8 pt-0">
                      <div className="flex items-center justify-between border-t border-outline-variant/10 pt-6">
                        <span className="text-on-surface font-bold">{formatCurrency(p.hourlyRate)}/hr</span>
                        <Link to={`/booking?providerId=${p._id}`} className="text-primary font-bold flex items-center gap-2">
                          Book Now <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Customer Testimonials</h2>
            <p className="text-on-surface-variant text-lg">Hear from thousands of happy homeowners.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-10 rounded-[2rem] editorial-shadow border border-outline-variant/5">
              <div className="flex gap-1 text-yellow-500 mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <p className="text-lg italic text-on-surface mb-8">"Service Square made finding a plumber so easy. Within two hours, someone was at my door fixing a major leak. Incredible service!"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Portrait of a satisfied customer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-SWJlEv3sHb2Sl3rYLU3WBNQaa0UGOQ-ywKvwlpLpNFPMBbDh9SMeSS3TrL0DftPmIorlPRPgqpCJwu2b04zbLPPCt-1Suaivq2UnkhlBr46wdykyPfXaQcb_uSG30UqPs9B1XEonkoQCuX7w4EblL-J8_kUWrDA-ZTISJIHbcKO3MpKrcfKS5TYk2ebQaC2V1WvGIgtiF7bee-sEbyOAAcBRZCM_j6ChCfqBzpUc02Yl4og5Sn6qYQ-lxHwxUT20NJIAiKpIfVs"
                  />
                </div>
                <div>
                  <p className="font-bold">Emily Watson</p>
                  <p className="text-sm text-on-surface-variant">Homeowner in Seattle</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-[2rem] editorial-shadow border border-outline-variant/5">
              <div className="flex gap-1 text-yellow-500 mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <p className="text-lg italic text-on-surface mb-8">"I've used several providers for cleaning and painting. The quality of professionals on this platform is consistently high."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Portrait of a male client"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb1yMtuR08101MMVaRIHDdePp9xrULQIQBvPXtP8Va2I2WofNJGnvZW8RC6ZWoDmNgmzR0RLUZ2Ro0Ex0yFiHMe3U_DpVt16thrIwfqarr6V97mZN45c7gxXMjMv6X3a8a7eWaLo-8qfBN-QlYPpYdFZ8Xegyb6Y1bVS2HaXMNdx4fJkBPfDaUxGygDK8KS1aULwhFLA573-oDI13o-WgdWfYKTgPZwyoHavcbo7ZwZJS2LfEod5xYIIEWcAywT9aE5SfrHCdRF1E"
                  />
                </div>
                <div>
                  <p className="font-bold">Jason Miller</p>
                  <p className="text-sm text-on-surface-variant">Real Estate Agent</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-[2rem] editorial-shadow border border-outline-variant/5">
              <div className="flex gap-1 text-yellow-500 mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <p className="text-lg italic text-on-surface mb-8">"The background check and rating system gave me peace of mind. Marcus did an amazing job with our living room painting."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Portrait of a young professional"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiHE1qDWBFrKu7VC5PGLRiwjyemTkuYXb6bABPH8HDZRhSHiqcEpdP4v56lPvOPIuHFKjON70rQ91e81CVmMBzNd3FU4PFjt9Frs7c8JBiPBLkc2fmlcQolnWXpsSKBs4sd3WCspIv7_54s4PJcBhTiWb-ic9cEh028-3CvfGEocfSvHT0w3JHbztJxiSNi7vuwpT1wcvpEqug-vJAvqMp6zijlObd8-rP3y7zuAS2ceNTqn6e0VOCpuxM5dtzK3VGI1AbYa6duz8"
                  />
                </div>
                <div>
                  <p className="font-bold">Sophia Garcia</p>
                  <p className="text-sm text-on-surface-variant">New Homeowner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
          <div className="z-10 relative max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-on-primary mb-6 leading-tight">Ready to join the Service Square community?</h2>
            <p className="text-on-primary-container text-xl mb-10 opacity-90">Start your first booking today and get 20% off your first service. Verified experts are waiting to help you.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="bg-white text-primary font-extrabold px-10 py-5 rounded-2xl hover:bg-opacity-90 active:scale-95 transition-all text-center">Get Started Now</Link>
              <Link to="/provider" className="bg-transparent border border-on-primary text-on-primary font-extrabold px-10 py-5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-center">Become a Provider</Link>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute right-20 top-0 hidden lg:block">
            <span className="material-symbols-outlined text-[300px] text-white/10 select-none">handshake</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
