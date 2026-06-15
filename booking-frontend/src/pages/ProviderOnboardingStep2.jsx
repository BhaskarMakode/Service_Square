import React from 'react';
import { Link } from 'react-router-dom';

export default function ProviderOnboardingStep2() {
  return (
    <>
      
{/* TopNavBar Shared Component */}
<header className="sticky top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none">
<div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto font-sans antialiased text-slate-900 dark:text-slate-100">
<div className="text-xl font-black tracking-tight text-indigo-700 dark:text-indigo-400">
                Service Square
            </div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-full active:scale-95 duration-200">
<span className="material-symbols-outlined" data-icon="help">help</span>
</button>
<button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-full active:scale-95 duration-200">
<span className="material-symbols-outlined" data-icon="close">close</span>
</button>
</div>
</div>
</header>
<main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
{/* Progress Indicator */}
<div className="max-w-2xl mx-auto mb-16">
<div className="flex items-center justify-between relative">
{/* Progress Line Background */}
<div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-high -translate-y-1/2 z-0"></div>
{/* Progress Line Active */}
<div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"></div>
{/* Step 1: Completed */}
<div className="relative z-10 flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
<span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
</div>
<span className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant">Identity</span>
</div>
{/* Step 2: Active */}
<div className="relative z-10 flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-lowest border-2 border-primary text-primary flex items-center justify-center shadow-xl step-active">
<span className="material-symbols-outlined text-sm" data-icon="handyman">handyman</span>
</div>
<span className="text-[11px] font-bold tracking-widest uppercase text-primary">Service Details</span>
</div>
{/* Step 3: Pending */}
<div className="relative z-10 flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
<span className="material-symbols-outlined text-sm" data-icon="event_available">event_available</span>
</div>
<span className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant opacity-50">Availability</span>
</div>
</div>
</div>
{/* Form Card */}
<div className="max-w-xl mx-auto">
<div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-[0_32px_64px_-12px_rgba(53,37,205,0.06)] border border-outline-variant/10">
<div className="mb-10 text-center">
<h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">Define Your Expertise</h1>
<p className="text-on-surface-variant body-lg leading-relaxed">Tell us about the services you provide and your background in the industry.</p>
</div>
<form className="space-y-8">
{/* Category Dropdown */}
<div className="space-y-2.5">
<label className="block text-sm font-semibold text-on-surface ml-1">Service Category</label>
<div className="relative group">
<select className="w-full bg-surface-container-high border-none rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all appearance-none cursor-pointer">
<option disabled="" selected="" value="">Select your trade...</option>
<option value="electrician">Electrician</option>
<option value="plumber">Plumber</option>
<option value="hvac">HVAC Specialist</option>
<option value="carpenter">Carpenter</option>
<option value="painter">Professional Painter</option>
<option value="landscaper">Landscaper</option>
</select>
<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
<span className="material-symbols-outlined">expand_more</span>
</div>
</div>
</div>
{/* Years of Experience */}
<div className="space-y-2.5">
<label className="block text-sm font-semibold text-on-surface ml-1">Years of Professional Experience</label>
<div className="relative">
<input className="w-full bg-surface-container-high border-none rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all" min="0" placeholder="e.g. 5" type="number"/>
<div className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">Years</div>
</div>
</div>
{/* Service Description */}
<div className="space-y-2.5">
<div className="flex justify-between items-center ml-1">
<label className="block text-sm font-semibold text-on-surface">Service Description</label>
<span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Min 100 characters</span>
</div>
<textarea className="w-full bg-surface-container-high border-none rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all resize-none" placeholder="Highlight your specific skills, certifications, or the areas you specialize in..." rows="5"></textarea>
</div>
{/* Action Buttons */}
<div className="pt-6 flex flex-col sm:flex-row gap-4">
<Link to="/onboarding-1" className="flex-1 order-2 sm:order-1 py-4 px-8 rounded-xl text-on-surface-variant font-semibold hover:bg-surface-container transition-colors active:scale-[0.98] duration-200 block text-center">
                            Back
                        </Link>
<Link to="/onboarding-3" className="flex-[2] order-1 sm:order-2 py-4 px-8 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            Continue to Availability
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
</Link>
</div>
</form>
</div>
{/* Contextual Tip */}
<div className="mt-8 flex gap-4 p-5 bg-secondary-container/10 rounded-xl border border-secondary-container/20">
<div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-on-secondary-container" data-icon="lightbulb" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
</div>
<div>
<h4 className="text-sm font-bold text-on-secondary-container">Pro Tip</h4>
<p className="text-xs text-on-secondary-container/80 leading-relaxed mt-0.5">Providers with detailed descriptions and specific years of experience receive 40% more booking requests on Service Square.</p>
</div>
</div>
</div>
</main>
{/* Navigation Shell Suppression: Form is a task-focused sub-page, no BottomNavBar as per UX mandate */}
{/* Spacer for safe area */}
<div className="h-20 md:hidden"></div>

    </>
  );
}
