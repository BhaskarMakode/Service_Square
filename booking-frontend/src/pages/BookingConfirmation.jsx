import React from 'react';
import { Link } from 'react-router-dom';

export default function BookingConfirmation() {
  return (
    <>
      
{/* Top Navigation (Reduced for Transactional Context) */}
<nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm h-20">
<div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
<span className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400">Service Square</span>
<div className="flex items-center gap-4">
<span className="text-sm font-medium text-on-surface-variant">Booking Flow</span>
<div className="h-2 w-2 rounded-full bg-secondary-container"></div>
</div>
</div>
</nav>
<main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
{/* Hero Confirmation Section */}
<section className="text-center mb-16">
<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container mb-6 shadow-sm">
<span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
<h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4">Booking Confirmed!</h1>
<p className="text-xl text-on-surface-variant font-medium">Your request has been accepted. We've notified your provider.</p>
<div className="mt-6 inline-block px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant/15">
<span className="text-sm font-bold tracking-widest text-indigo-700 uppercase">Order ID: #SS-12345</span>
</div>
</section>
{/* Bento Layout for Details */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
{/* Provider Card (Featured Artist) */}
<div className="md:col-span-7 bg-surface-container-lowest rounded-xl p-8 shadow-[0_32px_64px_-15px_rgba(53,37,205,0.06)] relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 rounded-bl-full -mr-12 -mt-12"></div>
<h3 className="text-on-surface-variant font-bold text-xs tracking-widest uppercase mb-6">Service Provider</h3>
<div className="flex items-center gap-6">
<div className="relative">
<img alt="Professional service provider profile" className="w-24 h-24 rounded-xl object-cover" data-alt="Professional service provider smiling face" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQXj3bge0p0ivZmd_BxRfvH9zliO9GsqzzsxC2XP82tf-2-vS8zLlfKJNPQ5WtjnhNISWFVT1lnOfs-3lKoSwJLBaVk9Nv44CJ2e4qJRr7X8CIO9rBrzKKl3eZyBGeBvAJMHYdubVf0itQJtbbBbQU5r5c4tz51vVTf9DaEDuwqYaeNerfPMJjaJ87oyp6ibxTDrnk-rIj977jtO3jd6ROUice7tijDYcDKtks5-U7RDVYSvKRELucluP3DBSsR0DQH9-FdGJRBu0"/>
<div className="absolute -top-3 -right-3 glass-card px-2 py-1 rounded-lg shadow-sm border border-outline-variant/15 flex items-center gap-1">
<span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="text-xs font-bold text-on-surface">4.9</span>
</div>
</div>
<div>
<h2 className="text-2xl font-bold text-on-surface">Julian Rivera</h2>
<p className="text-on-surface-variant mb-3">Premium Interior Consultant</p>
<div className="flex gap-2">
<span className="px-3 py-1 bg-surface-container-low text-xs font-semibold rounded-full text-secondary">Verified</span>
<span className="px-3 py-1 bg-surface-container-low text-xs font-semibold rounded-full text-secondary">Top Rated</span>
</div>
</div>
</div>
<div className="mt-8 pt-8 border-t border-outline-variant/10">
<p className="text-sm text-on-surface-variant italic">"I'll bring all the necessary samples for our session. Looking forward to transforming your space!"</p>
</div>
</div>
{/* Logistics Card */}
<div className="md:col-span-5 flex flex-col gap-6">
{/* Time & Date */}
<div className="bg-surface-container-low rounded-xl p-6 flex items-start gap-4">
<div className="p-3 bg-white rounded-xl shadow-sm">
<span className="material-symbols-outlined text-indigo-600">calendar_today</span>
</div>
<div>
<p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Appointment</p>
<p className="text-lg font-bold text-on-surface leading-tight">Monday, Oct 24</p>
<p className="text-sm text-on-surface-variant">10:00 AM - 12:00 PM</p>
</div>
</div>
{/* Location */}
<div className="bg-surface-container-low rounded-xl p-6 flex items-start gap-4">
<div className="p-3 bg-white rounded-xl shadow-sm">
<span className="material-symbols-outlined text-indigo-600">location_on</span>
</div>
<div className="flex-1">
<p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Location</p>
<p className="text-lg font-bold text-on-surface leading-tight">Skyline Heights, 4B</p>
<p className="text-sm text-on-surface-variant">San Francisco, CA 94105</p>
</div>
<div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant/20">
<img alt="Map preview" className="w-full h-full object-cover grayscale opacity-50" data-location="San Francisco" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOfJ-VACYsG_vfUdHgkm_YHyepceewC3dhBndlX4Xbrcp5U-hyNRrLqL5EsA_PgUPKcGbWszJH00vp7fcmXd9Xna1MILiQioDgKa_mkWmgrpCD8mTvvxck1NSrA2Vy1T8t3xbd4j7fOn_bgmkwLqfKAkTYN5IwskfXFtTaCtUFIkp8OpfjNcRqAqC3VsifJ5gU40K5IUbAnAp6_AAO8WYaSLbDIcQKKFBmGHV1V26DsPJgXN1KJA-DlqJHujuDC51P3nKkN-Neho0"/>
</div>
</div>
</div>
{/* Payment Summary (Spanning) */}
<div className="md:col-span-12 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10">
<div className="flex flex-col md:flex-row justify-between items-center gap-6">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
<span className="material-symbols-outlined text-slate-600">payments</span>
</div>
<div>
<p className="text-sm text-on-surface-variant font-medium">Payment Method</p>
<p className="font-bold text-on-surface">Visa ending in •••• 4242</p>
</div>
</div>
<div className="h-px w-full md:h-12 md:w-px bg-outline-variant/20"></div>
<div className="text-center md:text-right">
<p className="text-sm text-on-surface-variant font-medium">Total Amount Paid</p>
<p className="text-3xl font-black text-indigo-700">$185.00</p>
</div>
</div>
</div>
</div>
{/* Call to Actions */}
<div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
<Link to="/tracking" className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200 text-center inline-block">
                Track Service
            </Link>
<Link to="/" className="w-full sm:w-auto px-10 py-4 glass-card border border-outline-variant/30 text-on-surface font-bold rounded-xl hover:bg-surface-container-high active:scale-[0.98] transition-all duration-200 text-center inline-block">
                Back to Home
            </Link>
</div>
{/* Help Section */}
<div className="mt-20 text-center">
<p className="text-on-surface-variant text-sm font-medium">
                Need to make a change? <a className="text-indigo-600 font-bold hover:underline" href="#">Contact Support</a> or <a className="text-indigo-600 font-bold hover:underline" href="#">View Policy</a>
</p>
</div>
</main>
{/* Footer (Simplified) */}
<footer className="w-full pt-20 pb-10 border-t border-slate-200 dark:border-slate-800 bg-slate-50">
<div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
<div className="text-lg font-bold text-slate-900 dark:text-slate-100">Service Square</div>
<p className="text-sm text-slate-500 dark:text-slate-400 font-medium">© 2024 Service Square. Premium Editorial Marketplace.</p>
<div className="flex gap-6">
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">Help Center</a>
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">Privacy Policy</a>
</div>
</div>
</footer>

    </>
  );
}
