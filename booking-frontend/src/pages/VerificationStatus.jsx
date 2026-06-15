import React from 'react';
import { Link } from 'react-router-dom';

export default function VerificationStatus() {
  return (
    <>
      
{/* Top Navigation Bar */}
<nav className="fixed top-0 w-full z-50 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-sans antialiased text-slate-900 dark:text-slate-100">
<div className="flex justify-between items-center px-6 h-16 w-full max-w-[1440px] mx-auto">
<div className="flex items-center gap-8">
<span className="text-xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400">Service Square</span>
<div className="hidden md:flex items-center gap-6">
<a className="text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 px-1 py-4" href="#">Dashboard</a>
<a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors duration-200" href="#">Bookings</a>
<a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors duration-200" href="#">Support</a>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-on-surface-variant hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-full transition-colors">
<span className="material-symbols-outlined">notifications</span>
</button>
<div className="h-8 w-8 rounded-full bg-primary-fixed overflow-hidden">
<img alt="Provider Profile Avatar" className="h-full w-full object-cover" data-alt="Portrait of a smiling professional service provider" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCImNyfkZgUia2ApCJt_mS-Vi3SG9tNdlCNG4jrEVHp8QzVvhWd9KALdgbjHvUOMiGyXzhvJbsm7oFHhWxyqtyvJhA6MDaFhfjWk_2Qip2gpG1biI7TABKuSGO0BcNudbql3TphvBB8QXFw3__suFQg0YSuNvu9VcqAJNXmmBSkBq3Rzw3EBvVzhumL3N1VBD87EExdx9nzLmOL-VdFM4b_zKMBZ9-Te2DIH-4cpKXRmr9vyAdar9dY3DZ4YpiVRzV30Q05RHWNXjI"/>
</div>
</div>
</div>
</nav>
{/* Side Navigation Bar (Hidden on Mobile) */}
<aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-col gap-2 p-4 pt-20">
<div className="px-4 py-6 mb-4">
<h2 className="text-lg font-black text-indigo-700 dark:text-indigo-400 leading-tight">Service Square</h2>
<p className="text-xs font-medium text-on-surface-variant opacity-70">Provider Portal</p>
</div>
<nav className="flex flex-col gap-1">
<a className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-xl shadow-sm hover:translate-x-1 transition-transform duration-200" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl hover:translate-x-1 transition-transform duration-200" href="#">
<span className="material-symbols-outlined">calendar_today</span>
<span className="text-sm font-medium">Bookings</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl hover:translate-x-1 transition-transform duration-200" href="#">
<span className="material-symbols-outlined">build</span>
<span className="text-sm font-medium">My Services</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl hover:translate-x-1 transition-transform duration-200" href="#">
<span className="material-symbols-outlined">event_available</span>
<span className="text-sm font-medium">Availability</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl hover:translate-x-1 transition-transform duration-200" href="#">
<span className="material-symbols-outlined">payments</span>
<span className="text-sm font-medium">Earnings</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl hover:translate-x-1 transition-transform duration-200" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="text-sm font-medium">Settings</span>
</a>
</nav>
<div className="mt-auto p-4 bg-primary-fixed rounded-2xl">
<p className="text-xs font-bold text-on-primary-fixed mb-2">Need help?</p>
<button className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-md active:scale-95 transition-all">Support Center</button>
</div>
</aside>
{/* Main Content Area */}
<main className="md:ml-64 pt-24 pb-20 px-6 max-w-6xl mx-auto">
<header className="mb-12">
<h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Provider Verification</h1>
<p className="text-on-surface-variant max-w-2xl text-lg">Manage your application status and complete your profile to start accepting jobs in your local area.</p>
</header>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
{/* Main Verification States (Stacked for visibility of all 3 states as requested) */}
<div className="lg:col-span-8 space-y-12">
{/* STATE 1: PENDING */}
<section className="relative">
<div className="absolute -top-4 -left-4 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest z-10 shadow-sm">Demo State: Pending</div>
<div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10">
<div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
<div className="w-24 h-24 flex-shrink-0 bg-amber-50 rounded-3xl flex items-center justify-center">
<span className="material-symbols-outlined text-amber-500 text-5xl">hourglass_empty</span>
</div>
<div className="flex-grow text-center md:text-left">
<h3 className="text-2xl font-bold mb-2">Verification in Progress</h3>
<p className="text-on-surface-variant mb-6">Our trust and safety team is currently reviewing your background check and insurance documents. This typically takes 2-3 business days.</p>
<div className="bg-surface-container-low rounded-2xl p-4 inline-flex items-center gap-3 border border-outline-variant/5">
<span className="material-symbols-outlined text-amber-600 text-sm">info</span>
<p className="text-xs font-medium text-on-surface-variant">Dashboard access is restricted until approval.</p>
</div>
</div>
</div>
<div className="mt-10 pt-10 border-t border-surface-container flex flex-wrap gap-4 justify-center md:justify-start">
<div className="flex flex-col items-center gap-2 p-4 bg-surface rounded-2xl w-32">
<span className="material-symbols-outlined text-indigo-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
<span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Identity</span>
</div>
<div className="flex flex-col items-center gap-2 p-4 bg-surface rounded-2xl w-32 animate-pulse">
<span className="material-symbols-outlined text-amber-500">pending</span>
<span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Background</span>
</div>
<div className="flex flex-col items-center gap-2 p-4 bg-surface rounded-2xl w-32 opacity-40">
<span className="material-symbols-outlined">radio_button_unchecked</span>
<span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Payouts</span>
</div>
</div>
</div>
</section>
{/* STATE 2: APPROVED */}
<section className="relative">
<div className="absolute -top-4 -left-4 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest z-10 shadow-sm">Demo State: Approved</div>
<div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10 overflow-hidden relative">
{/* Decorative Gradient */}
<div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/10 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
<div className="relative z-10">
<div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
<div className="w-24 h-24 flex-shrink-0 bg-emerald-50 rounded-3xl flex items-center justify-center">
<span className="material-symbols-outlined text-emerald-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
</div>
<div className="flex-grow text-center md:text-left">
<div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black tracking-widest uppercase mb-4">
                                        Verified Provider
                                    </div>
<h3 className="text-3xl font-black mb-2 text-on-surface">Welcome to the Square!</h3>
<p className="text-on-surface-variant mb-8 text-lg">Your account is fully approved. You can now start listing services and accepting bookings from local clients.</p>
<Link to="/dashboard" className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 active:scale-95 transition-all flex items-center gap-3">
                                        Go to Dashboard
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
</div>
</div>
</div>
</div>
</section>
{/* STATE 3: REJECTED */}
<section className="relative">
<div className="absolute -top-4 -left-4 bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest z-10 shadow-sm">Demo State: Rejected</div>
<div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10">
<div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
<div className="w-24 h-24 flex-shrink-0 bg-rose-50 rounded-3xl flex items-center justify-center">
<span className="material-symbols-outlined text-rose-500 text-5xl">cancel</span>
</div>
<div className="flex-grow text-center md:text-left">
<h3 className="text-2xl font-bold mb-2">Application Needs Attention</h3>
<div className="bg-error-container/30 border-l-4 border-error p-4 rounded-r-xl mb-6">
<p className="text-on-error-container font-medium">Rejection reason: The uploaded proof of insurance has expired. Please provide a current certificate of liability coverage for 2024.</p>
</div>
<div className="flex flex-wrap gap-4 justify-center md:justify-start">
<button className="px-6 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors active:scale-95">
                                        Re-apply
                                    </button>
<button className="px-6 py-3 text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors">
                                        Contact Support
                                    </button>
</div>
</div>
</div>
</div>
</section>
</div>
{/* Sidebar Info / Next Steps */}
<div className="lg:col-span-4 space-y-6">
<div className="bg-surface-container-low rounded-[1.5rem] p-6">
<h4 className="text-lg font-bold mb-4">Application Checklist</h4>
<ul className="space-y-4">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-emerald-500 text-sm mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
<div>
<p className="text-sm font-bold">Profile Details</p>
<p className="text-xs text-on-surface-variant">Completed on Oct 12</p>
</div>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-emerald-500 text-sm mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
<div>
<p className="text-sm font-bold">Government ID</p>
<p className="text-xs text-on-surface-variant">Verified by Onfido</p>
</div>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-amber-500 text-sm mt-1">clock_loader_40</span>
<div>
<p className="text-sm font-bold">Insurance Audit</p>
<p className="text-xs text-on-surface-variant">Pending manual review</p>
</div>
</li>
<li className="flex items-start gap-3 opacity-40">
<span className="material-symbols-outlined text-on-surface-variant text-sm mt-1">radio_button_unchecked</span>
<div>
<p className="text-sm font-bold">Payout Method</p>
<p className="text-xs text-on-surface-variant">Locked until approval</p>
</div>
</li>
</ul>
</div>
<div className="bg-indigo-900 text-white rounded-[1.5rem] p-6 relative overflow-hidden">
<span className="material-symbols-outlined absolute -bottom-6 -right-6 text-9xl opacity-10">lightbulb</span>
<h4 className="text-lg font-bold mb-2 relative z-10">Pro Tip</h4>
<p className="text-indigo-100 text-sm relative z-10 mb-4">Providers with high-quality portfolio photos get 3x more bookings once approved.</p>
<a className="text-secondary-container text-sm font-bold hover:underline relative z-10" href="#">View Photo Guide</a>
</div>
<div className="p-6 border border-outline-variant/20 rounded-[1.5rem]">
<h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Support</h4>
<p className="text-sm text-on-surface-variant mb-4">Questions about your verification? Our team is here to help.</p>
<div className="space-y-2">
<button className="w-full flex items-center justify-between p-3 bg-surface rounded-xl hover:bg-surface-container-low transition-colors group">
<span className="text-sm font-medium">Help Articles</span>
<span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
</button>
<button className="w-full flex items-center justify-between p-3 bg-surface rounded-xl hover:bg-surface-container-low transition-colors group">
<span className="text-sm font-medium">Live Chat</span>
<span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chat_bubble</span>
</button>
</div>
</div>
</div>
</div>
</main>
{/* Mobile Bottom Navigation */}
<nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50 flex justify-around items-center h-16 px-4">
<button className="flex flex-col items-center gap-1 text-indigo-600">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] font-bold">Home</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-400">
<span className="material-symbols-outlined">calendar_today</span>
<span className="text-[10px] font-medium">Bookings</span>
</button>
<button className="flex flex-col items-center gap-1 text-slate-400">
<span className="material-symbols-outlined">account_circle</span>
<span className="text-[10px] font-medium">Profile</span>
</button>
</nav>

    </>
  );
}
