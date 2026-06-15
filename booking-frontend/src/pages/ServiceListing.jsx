import React from 'react';
import { Link } from 'react-router-dom';

function ServiceListing() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 flex gap-10">
      <aside className="hidden lg:flex flex-col w-72 shrink-0 gap-8">
        <div className="bg-surface-container-low p-6 rounded-3xl sticky top-28">
          <div className="mb-8">
            <h2 className="text-xl font-extrabold tracking-tight text-on-surface">Filters</h2>
            <p className="text-on-surface-variant text-sm mt-1">Refine your search</p>
          </div>
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 text-indigo-600 font-bold mb-4">
                <span className="material-symbols-outlined">category</span>
                <span className="text-sm">Categories</span>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm cursor-pointer border-2 border-transparent hover:border-primary/10 transition-all">
                  <input defaultChecked className="rounded text-primary focus:ring-primary border-slate-200" type="checkbox" />
                  <span className="text-sm font-medium text-slate-700">Home Cleaning</span>
                </label>
                <label className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                  <input className="rounded text-primary focus:ring-primary border-slate-200" type="checkbox" />
                  <span className="text-sm font-medium text-slate-500">Plumbing</span>
                </label>
                <label className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                  <input className="rounded text-primary focus:ring-primary border-slate-200" type="checkbox" />
                  <span className="text-sm font-medium text-slate-500">Electrician</span>
                </label>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">payments</span>
                <span className="text-sm">Price Range</span>
              </div>
              <input className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" type="range" />
              <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                <span>$20</span>
                <span>$500+</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">star</span>
                <span className="text-sm">Rating</span>
              </div>
              <div className="flex gap-1">
                <button className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-400 font-bold border-2 border-primary/20">4+</button>
                <button className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-amber-400 transition-colors">3+</button>
                <button className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-amber-400 transition-colors">2+</button>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 text-slate-500 font-medium mb-4">
                <span className="material-symbols-outlined">distance</span>
                <span className="text-sm">Distance</span>
              </div>
              <select className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary-fixed transition-all">
                <option>Within 5 miles</option>
                <option>Within 15 miles</option>
                <option>Anywhere</option>
              </select>
            </div>
            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98]">Apply Filters</button>
          </div>
        </div>
      </aside>
      <section className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-on-surface">Home Services</h1>
            <p className="text-on-surface-variant mt-2 font-medium">128 professional providers found in your area.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sort By</span>
            <div className="relative group">
              <select className="appearance-none bg-surface-container-low border-none rounded-2xl py-3 pl-6 pr-12 text-sm font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-primary/20 hover:bg-surface-container-high transition-colors">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Highest Rating</option>
                <option>Distance</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Provider Card 1 */}
          <div className="group bg-surface-container-lowest rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
            <div className="relative overflow-hidden rounded-[1.5rem] mb-6">
              <img className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" alt="Professional smiling male service provider portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPuJzPr39eRrso_TMGCiIwOE2ES1IV8Eqo6PCCr2a4i_rsxpIZLC5I9h9DXjWsSrwRMmwGwk0NGOdL7e5t3ODaHXkRhCqMFhX-MfHqD1rFarPVW0wFDPoFJ1C2NJ-Rf1An8j4lo9dvWmi2ZxvKj5crzfAgZtpalwN5wai2QTNxdgh_vc34LN_7VOJ9UMfgBgagCIid7ar6d2kPRojRcfmI7BGnIbT-HjttYw_RQwO0BTixnpk7UjPhwGxx4-nrGhm8YTgLOgc7_zg" />
              <div className="absolute top-4 right-4 backdrop-blur-md bg-white/40 px-4 py-1.5 rounded-full border border-white/40 flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-slate-900">4.9</span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Top Rated</span>
              </div>
            </div>
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-extrabold text-slate-900">Marcus Wright</h3>
                <span className="text-2xl font-black text-indigo-700">$45<span className="text-sm font-medium text-slate-400">/hr</span></span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-6">Premium Interior Painting & Restoration Specialist</p>
              <div className="flex items-center gap-6 mb-8 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">work_history</span>
                  <span className="text-xs font-bold">8+ yrs Exp</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">location_on</span>
                  <span className="text-xs font-bold">1.2 miles</span>
                </div>
              </div>
              <Link to="/provider-details" className="block w-full py-4 text-center bg-surface-container-low text-indigo-600 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300">View Details</Link>
            </div>
          </div>

          {/* Provider Card 2 */}
          <div className="group bg-surface-container-lowest rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
            <div className="relative overflow-hidden rounded-[1.5rem] mb-6">
              <img className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" alt="Confident female tech specialist professional headshot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVS8XH4jm1L8NHmgyMR25rVWUlF6zmxF7B8jTwKN-vKwwvPjIs6cxmUV7FpedGM8gVk_Xr4LA5rQfJtEC7EtstFt54jJ1T4dI0B2ZHh-BdfbyCDLFrF4wukdKckQOSBKPLRDDGfU-fvCKHl3Tn87zWQ4X0oFmhN8LeN_dQKn61HEHF0qG2LvoMOiyyakc4LFAL0mfiesIk7l5XDm7NjKvTq9CQ-Z_p4hb6XvBjq3gPwfCf7BA2-_LK2bCrxtNOUzvzrVNMxrZGxb4" />
              <div className="absolute top-4 right-4 backdrop-blur-md bg-white/40 px-4 py-1.5 rounded-full border border-white/40 flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-slate-900">5.0</span>
              </div>
            </div>
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-extrabold text-slate-900">Sarah Jenkins</h3>
                <span className="text-2xl font-black text-indigo-700">$65<span className="text-sm font-medium text-slate-400">/hr</span></span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-6">Master Electrician & Smart Home Integration</p>
              <div className="flex items-center gap-6 mb-8 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">work_history</span>
                  <span className="text-xs font-bold">12+ yrs Exp</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">location_on</span>
                  <span className="text-xs font-bold">0.8 miles</span>
                </div>
              </div>
              <Link to="/provider-details" className="block w-full py-4 text-center bg-surface-container-low text-indigo-600 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300">View Details</Link>
            </div>
          </div>

          {/* Provider Card 3 */}
          <div className="group bg-surface-container-lowest rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
            <div className="relative overflow-hidden rounded-[1.5rem] mb-6">
              <img className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" alt="Skilled male technician in uniform working" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmAbQ4MFswYvq_Prw56Ao5RmfPU8DlASyk5PM3VyFk4xeGv7RGf_nBCAh6inSXNN9oJtNmZd8u5v-BXRKDiOMIoMHC5u57rDwgFc5hc2NF6ZMdVTGYZAaIS8JNwB332Y-_9OH3rLsDqVZ5CsFiT2uV3ra5NSVoTqwpvpFqgIvxQPlkblwLRHhZ_aopOi4L4zkjNZF9F-wjdTntDeoQDtRN4emG209FMQmg_yXpmcqpx4nJT8ImorHFRkl-9V2nPiqMmEW9NEJrNkk" />
              <div className="absolute top-4 right-4 backdrop-blur-md bg-white/40 px-4 py-1.5 rounded-full border border-white/40 flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-slate-900">4.7</span>
              </div>
            </div>
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-extrabold text-slate-900">David Chen</h3>
                <span className="text-2xl font-black text-indigo-700">$38<span className="text-sm font-medium text-slate-400">/hr</span></span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-6">Eco-Friendly Residential Cleaning Expert</p>
              <div className="flex items-center gap-6 mb-8 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">work_history</span>
                  <span className="text-xs font-bold">5+ yrs Exp</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">location_on</span>
                  <span className="text-xs font-bold">3.5 miles</span>
                </div>
              </div>
              <Link to="/provider-details" className="block w-full py-4 text-center bg-surface-container-low text-indigo-600 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300">View Details</Link>
            </div>
          </div>

          {/* Provider Card 4 */}
          <div className="group bg-surface-container-lowest rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
            <div className="relative overflow-hidden rounded-[1.5rem] mb-6">
              <img className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" alt="Experienced plumber professional portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdctgXJYmrld75f3z-dWRxjanjVDUoL9HS1lUL9jKw-NxlNHvHRcqT3S5kO9U8qHLKPpujAG8yWeD02B-PwythCfnc43n5j79Twgj7mbmg1lfuxvzPHPGk7vCMVhk_yMuG_RPswDC5fNBxoRPMPFeWxqUQwnvr53AKkp2t1UN4yjfYIuoxWqg4tyQFw_7WM75R5P228aXrrnJk6alO20OoZIj7MMHasZ7bGjQ9e6P6OYjszVRvXAdNeizG4ES5PvwGfYuUCu7Tfo4" />
              <div className="absolute top-4 right-4 backdrop-blur-md bg-white/40 px-4 py-1.5 rounded-full border border-white/40 flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-slate-900">4.8</span>
              </div>
            </div>
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-extrabold text-slate-900">James Wilson</h3>
                <span className="text-2xl font-black text-indigo-700">$55<span className="text-sm font-medium text-slate-400">/hr</span></span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-6">Licensed Plumber & Emergency Repair Specialist</p>
              <div className="flex items-center gap-6 mb-8 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">work_history</span>
                  <span className="text-xs font-bold">15+ yrs Exp</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">location_on</span>
                  <span className="text-xs font-bold">2.1 miles</span>
                </div>
              </div>
              <Link to="/provider-details" className="block w-full py-4 text-center bg-surface-container-low text-indigo-600 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300">View Details</Link>
            </div>
          </div>

          {/* Provider Card 5 */}
          <div className="group bg-surface-container-lowest rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
            <div className="relative overflow-hidden rounded-[1.5rem] mb-6">
              <img className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" alt="Smiling home repairman specialist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4Nws-I6D4emkA5ZUJHZX0rBq8kWaP9KT_AfmM0WNwpp1kl6kptskNfXsT0CohD0qVm22g_mpvKwsppQ-UHzMPvnYhIa1v4b_nHrZTWRKEGI50jXVf7U6s3I6XycJJAlDmSlKntyHI1Lc7XrcrmwYz0D-4JlQRmLdF8TIh-BkHhdM811PHwdlu_iE5VOisPWCw1CDpI9UJ9HFdV666eLekKsWwYdmWQENo8-956uajZo40poX5kKVnnP28Cls7oHOJvYY5hzLQxYs" />
              <div className="absolute top-4 right-4 backdrop-blur-md bg-white/40 px-4 py-1.5 rounded-full border border-white/40 flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-slate-900">4.6</span>
              </div>
            </div>
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-extrabold text-slate-900">Alex Thompson</h3>
                <span className="text-2xl font-black text-indigo-700">$32<span className="text-sm font-medium text-slate-400">/hr</span></span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-6">Expert Handyman & Assembly Services</p>
              <div className="flex items-center gap-6 mb-8 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">work_history</span>
                  <span className="text-xs font-bold">4+ yrs Exp</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">location_on</span>
                  <span className="text-xs font-bold">4.2 miles</span>
                </div>
              </div>
              <Link to="/provider-details" className="block w-full py-4 text-center bg-surface-container-low text-indigo-600 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300">View Details</Link>
            </div>
          </div>

          {/* Provider Card 6 */}
          <div className="group bg-surface-container-lowest rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
            <div className="relative overflow-hidden rounded-[1.5rem] mb-6">
              <img className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" alt="HVAC technician working on ventilation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhzbaPtFCpYhUefIppwcpCjXyrcLuiijDGtVuuxaS8Qp4Po1yVBgvKeiTHa_-iRHC42eSdjjW0_VuIbxUAvA56IhsaEGhy5fQp_uz5yKZZr3ZHi_tL4UGhRLuvPyz2pzXe2LSMf8IGh3Ejpcp1av7Bv2av6Zbpmz7KYxQ5Lo12NbPqJlzANyBZ25suZQ5Tj7biDY8GMUaHqPO0NUdwuepgL4TrT6k7gl915RsHomcL_ZgHXoH801J48JoBOdrxGpjZ_q32tCieNSg" />
              <div className="absolute top-4 right-4 backdrop-blur-md bg-white/40 px-4 py-1.5 rounded-full border border-white/40 flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-slate-900">4.9</span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Top Rated</span>
              </div>
            </div>
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-extrabold text-slate-900">Ryan G.</h3>
                <span className="text-2xl font-black text-indigo-700">$72<span className="text-sm font-medium text-slate-400">/hr</span></span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-6">HVAC System Design & Ventilation Maintenance</p>
              <div className="flex items-center gap-6 mb-8 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">work_history</span>
                  <span className="text-xs font-bold">10+ yrs Exp</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">location_on</span>
                  <span className="text-xs font-bold">5.8 miles</span>
                </div>
              </div>
              <Link to="/provider-details" className="block w-full py-4 text-center bg-surface-container-low text-indigo-600 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300">View Details</Link>
            </div>
          </div>
        </div>
        <div className="mt-20 flex justify-center items-center gap-4">
          <button className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="w-12 h-12 rounded-full bg-primary text-white font-bold">1</button>
            <button className="w-12 h-12 rounded-full hover:bg-slate-100 font-bold text-slate-600">2</button>
            <button className="w-12 h-12 rounded-full hover:bg-slate-100 font-bold text-slate-600">3</button>
            <span className="px-2 text-slate-400">...</span>
            <button className="w-12 h-12 rounded-full hover:bg-slate-100 font-bold text-slate-600">12</button>
          </div>
          <button className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default ServiceListing;
