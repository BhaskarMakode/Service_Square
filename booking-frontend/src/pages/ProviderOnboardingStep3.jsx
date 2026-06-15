import React from 'react';
import { Link } from 'react-router-dom';

export default function ProviderOnboardingStep3() {
  return (
    <>
      
{/* TopNavBar Implementation from JSON */}
<nav className="sticky top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-sans antialiased text-slate-900 dark:text-slate-100">
<div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
<div className="text-xl font-black tracking-tight text-indigo-700 dark:text-indigo-400">Service Square</div>
<div className="flex items-center gap-4">
<button className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200 text-slate-500 dark:text-slate-400">
<span className="material-symbols-outlined">help</span>
</button>
<button className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors active:scale-95 duration-200 text-slate-500 dark:text-slate-400">
<span className="material-symbols-outlined">close</span>
</button>
</div>
</div>
</nav>
<main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
{/* Progress Indicator Section */}
<div className="mb-16">
<div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
{/* Step 1: Identity */}
<div className="flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
<span className="text-label text-on-surface-variant text-sm font-medium tracking-wide">Identity</span>
</div>
<div className="h-[2px] flex-1 mx-4 bg-primary-fixed"></div>
{/* Step 2: Services */}
<div className="flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
<span className="text-label text-on-surface-variant text-sm font-medium tracking-wide">Services</span>
</div>
<div className="h-[2px] flex-1 mx-4 bg-primary-fixed"></div>
{/* Step 3: Availability */}
<div className="flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20">
<span className="material-symbols-outlined">event_available</span>
</div>
<span className="text-label text-on-surface font-bold text-sm tracking-wide">Availability</span>
</div>
</div>
<div className="text-center">
<h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface mb-4">Set your rhythm.</h1>
<p className="text-on-surface-variant body-lg max-w-lg mx-auto">Configure when you're available to accept bookings. You can always refine these later.</p>
</div>
</div>
{/* Selection Canvas */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
{/* Left: Day Selection (Bento Style) */}
<div className="lg:col-span-5 space-y-6">
<h2 className="text-xl font-headline font-bold text-on-surface px-2">Work Days</h2>
<div className="grid grid-cols-1 gap-3">
{/* Day Card: Monday (Active) */}
<div className="group p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between transition-all hover:shadow-md cursor-pointer ring-2 ring-primary">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined">calendar_today</span>
</div>
<div>
<p className="font-bold text-on-surface">Monday</p>
<p className="text-xs text-on-surface-variant">09:00 AM - 05:00 PM</p>
</div>
</div>
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
{/* Day Card: Tuesday (Active) */}
<div className="group p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between transition-all hover:shadow-md cursor-pointer ring-2 ring-primary">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined">calendar_today</span>
</div>
<div>
<p className="font-bold text-on-surface">Tuesday</p>
<p className="text-xs text-on-surface-variant">09:00 AM - 05:00 PM</p>
</div>
</div>
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
{/* Day Card: Wednesday (Inactive) */}
<div className="group p-5 rounded-xl bg-surface-container-low border border-transparent flex items-center justify-between transition-all hover:bg-surface-container cursor-pointer">
<div className="flex items-center gap-4 opacity-60">
<div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined">calendar_today</span>
</div>
<div>
<p className="font-bold text-on-surface">Wednesday</p>
<p className="text-xs text-on-surface-variant">Unavailable</p>
</div>
</div>
<span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_unchecked</span>
</div>
{/* Day Card: Thursday (Active) */}
<div className="group p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 flex items-center justify-between transition-all hover:shadow-md cursor-pointer ring-2 ring-primary">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined">calendar_today</span>
</div>
<div>
<p className="font-bold text-on-surface">Thursday</p>
<p className="text-xs text-on-surface-variant">09:00 AM - 05:00 PM</p>
</div>
</div>
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
{/* Day Card: Weekend (Inactive) */}
<div className="group p-5 rounded-xl bg-surface-container-low border border-transparent flex items-center justify-between transition-all hover:bg-surface-container cursor-pointer">
<div className="flex items-center gap-4 opacity-60">
<div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined">weekend</span>
</div>
<div>
<p className="font-bold text-on-surface">Weekend</p>
<p className="text-xs text-on-surface-variant">Default Off</p>
</div>
</div>
<span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_unchecked</span>
</div>
</div>
</div>
{/* Right: Time Slot Selector (Editorial Grid) */}
<div className="lg:col-span-7 bg-surface-container-low rounded-3xl p-8 md:p-12 relative overflow-hidden">
<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
<header className="relative z-10 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Configure Hours</span>
<h2 className="text-3xl font-headline font-extrabold text-on-surface">Active Slots</h2>
</div>
<div className="flex items-center gap-2 bg-surface-container-lowest p-1.5 rounded-full shadow-sm">
<button className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold transition-all">AM</button>
<button className="px-4 py-1.5 rounded-full text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-all">PM</button>
</div>
</header>
<div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
{/* Slot: Morning */}
<button className="p-4 rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/20 flex flex-col items-center gap-2 transition-transform active:scale-95">
<span className="text-sm font-bold">08:00</span>
<span className="text-[10px] opacity-80 uppercase tracking-tighter">Selected</span>
</button>
<button className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/15 flex flex-col items-center gap-2 hover:bg-primary-fixed transition-colors group">
<span className="text-sm font-bold text-on-surface group-hover:text-primary">09:00</span>
<span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Available</span>
</button>
<button className="p-4 rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/20 flex flex-col items-center gap-2 transition-transform active:scale-95">
<span className="text-sm font-bold">10:00</span>
<span className="text-[10px] opacity-80 uppercase tracking-tighter">Selected</span>
</button>
{/* Slot: Midday */}
<button className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/15 flex flex-col items-center gap-2 hover:bg-primary-fixed transition-colors group">
<span className="text-sm font-bold text-on-surface group-hover:text-primary">11:00</span>
<span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Available</span>
</button>
<button className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/15 flex flex-col items-center gap-2 hover:bg-primary-fixed transition-colors group">
<span className="text-sm font-bold text-on-surface group-hover:text-primary">12:00</span>
<span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Available</span>
</button>
<button className="p-4 rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/20 flex flex-col items-center gap-2 transition-transform active:scale-95">
<span className="text-sm font-bold">13:00</span>
<span className="text-[10px] opacity-80 uppercase tracking-tighter">Selected</span>
</button>
{/* Slot: Afternoon */}
<button className="p-4 rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/20 flex flex-col items-center gap-2 transition-transform active:scale-95">
<span className="text-sm font-bold">14:00</span>
<span className="text-[10px] opacity-80 uppercase tracking-tighter">Selected</span>
</button>
<button className="p-4 rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/20 flex flex-col items-center gap-2 transition-transform active:scale-95">
<span className="text-sm font-bold">15:00</span>
<span className="text-[10px] opacity-80 uppercase tracking-tighter">Selected</span>
</button>
<button className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/15 flex flex-col items-center gap-2 hover:bg-primary-fixed transition-colors group">
<span className="text-sm font-bold text-on-surface group-hover:text-primary">16:00</span>
<span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Available</span>
</button>
</div>
<div className="mt-12 relative z-10 flex flex-col gap-6">
<div className="p-6 rounded-2xl bg-surface-container-highest/50 backdrop-blur-sm">
<div className="flex items-center gap-3 mb-2">
<span className="material-symbols-outlined text-secondary">info</span>
<p className="text-sm font-bold text-on-surface">Smart Buffer</p>
</div>
<p className="text-xs text-on-surface-variant leading-relaxed">We automatically add 30 minutes between appointments to ensure you're never rushed.</p>
</div>
<Link to="/verification-status" className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] block text-center">
                        Complete Registration
                    </Link>
<Link to="/onboarding-2" className="w-full text-on-surface-variant font-medium text-sm hover:text-on-surface transition-colors block text-center">
                        Go back to Service Details
                    </Link>
</div>
</div>
</div>
</main>
{/* Contextual Bottom Navigation (Suppressing based on focus-task rules, but providing for Identity reference) */}
{/* The prompt requires shared TopNavBar for Service Square, and we exclude BottomNavBar as this is a focused transactional registration flow */}
<footer className="max-w-7xl mx-auto px-6 py-12 border-t border-surface-container-high mt-12">
<div className="flex flex-col md:flex-row justify-between items-center gap-6">
<div className="text-sm text-on-surface-variant">© 2024 Service Square Inc. All rights reserved.</div>
<div className="flex items-center gap-8">
<a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
<a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
</div>
</div>
</footer>

    </>
  );
}
