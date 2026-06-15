import React from 'react';
import { Link } from 'react-router-dom';

export default function ProviderOnboardingStep1() {
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
<button className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200">
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
<form className="space-y-6">
{/* Full Name */}
<div className="space-y-2">
<label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
<div className="relative group">
<span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">person</span>
<input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-fixed text-on-surface placeholder:text-outline/60 transition-all duration-200" id="name" placeholder="Alex Johnson" type="text"/>
</div>
</div>
{/* Email Address */}
<div className="space-y-2">
<label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
<div className="relative group">
<span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">mail</span>
<input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-fixed text-on-surface placeholder:text-outline/60 transition-all duration-200" id="email" placeholder="alex@example.com" type="email"/>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Phone Number */}
<div className="space-y-2">
<label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="phone">Phone Number</label>
<div className="relative group">
<span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">call</span>
<input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-fixed text-on-surface placeholder:text-outline/60 transition-all duration-200" id="phone" placeholder="+1 (555) 000-0000" type="tel"/>
</div>
</div>
{/* Password */}
<div className="space-y-2">
<label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="password">Password</label>
<div className="relative group">
<span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock</span>
<input className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-xl focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-fixed text-on-surface placeholder:text-outline/60 transition-all duration-200" id="password" placeholder="••••••••" type="password"/>
</div>
</div>
</div>
{/* Terms Checkbox */}
<div className="flex items-start gap-3 pt-2">
<div className="flex items-center h-5">
<input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-fixed transition-all duration-200" id="terms" type="checkbox"/>
</div>
<label className="text-sm text-on-surface-variant leading-tight" htmlFor="terms">
                            I agree to the <a className="text-primary font-semibold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>.
                        </label>
</div>
{/* Submit Button */}
<Link to="/onboarding-2" className="group relative w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden">
<span className="relative z-10">Continue to Service Details</span>
<span className="material-symbols-outlined relative z-10 text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
<div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
</Link>
</form>
</div>
{/* Footer Context */}
<div className="px-8 py-5 bg-surface-container-low border-t border-outline-variant/10 flex justify-center items-center gap-2">
<span className="text-sm text-on-surface-variant">Already have an account?</span>
<a className="text-sm font-bold text-primary hover:text-primary-container transition-colors" href="#">Sign In</a>
</div>
</div>
{/* Security/Trust Badges */}
<div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant">verified_user</span>
<span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Bank-grade Security</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant">encrypted</span>
<span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">256-bit Encryption</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant">privacy_tip</span>
<span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">GDPR Compliant</span>
</div>
</div>
</main>
{/* Navigation Shell Placeholder (Not visible on linear flow per instructions) */}
<nav className="hidden">
{/* Suppressed as per the "Destination" Rule for transactional/linear onboarding */}
</nav>

    </>
  );
}
