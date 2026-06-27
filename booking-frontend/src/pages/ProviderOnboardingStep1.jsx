import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProviderOnboardingStep1() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    localStorage.setItem('onboarding_name', name);
    localStorage.setItem('onboarding_email', email);
    navigate('/onboarding-2');
  };

  return (
    <>
      {/* TopNavBar */}
      <header className="sticky top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-sans antialiased text-slate-900 dark:text-slate-100">
        <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-indigo-700 dark:text-indigo-400">Service Square</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">help</span>
            </button>
            <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">close</span>
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 py-12 lg:py-20">
        {/* Progress Indicator */}
        <div className="w-full max-w-lg mb-12">
          <div className="relative flex justify-between items-center">
            {/* Line Background */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-high -translate-y-1/2 z-0"></div>
            {/* Step 1: Identity (Active) */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary ring-4 ring-surface ring-offset-0">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>person_pin</span>
              </div>
              <span className="absolute -bottom-7 text-[11px] font-bold tracking-wider text-primary uppercase whitespace-nowrap">Identity</span>
            </div>
            {/* Step 2: Services */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface-container-highest flex items-center justify-center text-on-surface-variant ring-4 ring-surface ring-offset-0">
                <span className="material-symbols-outlined text-[20px]">handyman</span>
              </div>
              <span className="absolute -bottom-7 text-[11px] font-medium tracking-wider text-on-surface-variant uppercase whitespace-nowrap">Services</span>
            </div>
            {/* Step 3: Availability */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface-container-highest flex items-center justify-center text-on-surface-variant ring-4 ring-surface ring-offset-0">
                <span className="material-symbols-outlined text-[20px]">event_available</span>
              </div>
              <span className="absolute -bottom-7 text-[11px] font-medium tracking-wider text-on-surface-variant uppercase whitespace-nowrap">Availability</span>
            </div>
          </div>
        </div>

        {/* Registration Card */}
        <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-12px_rgba(53,37,205,0.06)] overflow-hidden border border-outline-variant/10">
          <div className="p-8 lg:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold tracking-tight text-on-surface mb-2">Create your account</h1>
              <p className="text-on-surface-variant text-sm">Join the marketplace as a verified service professional.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-fixed text-on-surface placeholder:text-outline/60 transition-all duration-200" 
                    id="name" 
                    placeholder="Alex Johnson" 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-fixed text-on-surface placeholder:text-outline/60 transition-all duration-200" 
                    id="email" 
                    placeholder="alex@example.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="phone">Phone Number</label>
                <div className="relative group opacity-70">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">call</span>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl text-on-surface placeholder:text-outline/60 transition-all duration-200 cursor-not-allowed" 
                    id="phone" 
                    type="tel"
                    value={phone}
                    disabled
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="group relative w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden">
                <span className="relative z-10">Continue to Service Details</span>
                <span className="material-symbols-outlined relative z-10 text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>
          </div>
          {/* Footer Context */}
          <div className="px-8 py-5 bg-surface-container-low border-t border-outline-variant/10 flex justify-center items-center gap-2">
            <span className="text-sm text-on-surface-variant">Your phone number is verified via OTP.</span>
          </div>
        </div>
      </main>
    </>
  );
}
