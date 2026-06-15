import React from 'react';
import { Link } from 'react-router-dom';

export default function MyServicesManagement() {
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
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl hover:translate-x-1 transition-transform duration-200" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="text-sm font-medium Inter">Settings</span>
</a>
</nav>
<div className="mt-auto p-4 bg-primary-fixed rounded-xl">
<p className="text-xs text-on-primary-fixed mb-2 font-semibold">Need help?</p>
<Link to="/help" className="block w-full py-2 bg-primary text-on-primary rounded-lg text-xs font-bold transition-transform active:scale-95 text-center">Support Center</Link>
</div>
</aside>
{/* TopNavBar (Authority: JSON) */}
<header className="fixed top-0 w-full z-50 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none h-16">
<div className="flex justify-between items-center px-6 h-full w-full max-w-[1440px] mx-auto">
<div className="flex items-center gap-8 ml-64">
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3 text-on-surface-variant" data-icon="search">search</span>
<input className="pl-10 pr-4 py-2 bg-surface-container-high border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-fixed w-64 transition-all" placeholder="Search services..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-on-surface-variant hover:bg-slate-50 rounded-full transition-colors relative">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-slate-50 rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
</button>
<div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
<div className="text-right">
<p className="text-sm font-bold leading-none">Rahul Sharma</p>
<p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Gold Provider</p>
</div>
<img className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-fixed" data-alt="Provider Profile Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANvmCrfZTpy_UpJoql7P_DUyYMSPJbM-waxjErP9BFqqeMEAwty5Z4OgZkEo__7Mtguh41tEjgoxdnJka8AstOYGqoJGb7kt0RryJkwlCvGFFBsEnFbEU2A_D0G1b-OcYH8RuSbR4hRiQZNL1U-gPyUuMTHRdy3eawkpc-sEzemAur3PnfkPdoh436-opBj0dDSQAFsBwLLHEqnKz49_IXG6GIjeQNnAEYJXmxaS2XPB7E1dQ4RLlVM74XMzCuXBpTaKA4l8Tkl6k"/>
</div>
</div>
</div>
</header>
{/* Main Content Canvas */}
<main className="ml-64 pt-24 pb-12 px-8 max-w-[1440px] mx-auto">
{/* Header Section with Asymmetry */}
<section className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
<div className="max-w-2xl">
<h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3">Service Catalog</h2>
<p className="text-on-surface-variant text-lg leading-relaxed">Manage your professional service offerings, pricing, and availability. Use high-quality descriptions to attract more customers.</p>
</div>
<div className="flex items-center gap-4">
<div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/10">
<span className="material-symbols-outlined text-primary" data-icon="verified_user">verified_user</span>
<span className="text-xs font-bold text-on-surface">Verified Provider</span>
</div>
<button className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
<span className="material-symbols-outlined" data-icon="add">add</span>
                    Add New Service
                </button>
</div>
</section>
{/* Bento Grid Layout for Services */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/* Service Card 1 */}
<div className="bg-surface-container-lowest rounded-xl p-5 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative">
<div className="absolute top-4 right-4 z-10">
<label className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox" value=""/>
<div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex items-start gap-4 mb-6">
<div className="w-16 h-16 rounded-xl bg-secondary-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-on-secondary-container text-3xl" data-icon="electrical_services">electrical_services</span>
</div>
<div>
<span className="inline-block px-2 py-0.5 bg-surface-container text-[10px] font-bold text-on-surface-variant rounded-md mb-1 uppercase tracking-wider">Electrician</span>
<h3 className="text-xl font-bold text-on-surface leading-tight">Ceiling Fan Repair &amp; Installation</h3>
</div>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl mb-6">
<div className="flex flex-col">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Price</span>
<span className="text-lg font-black text-primary">₹599</span>
</div>
<div className="h-8 w-px bg-outline-variant/30"></div>
<div className="flex flex-col">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Duration</span>
<span className="text-sm font-bold">45 mins</span>
</div>
<div className="h-8 w-px bg-outline-variant/30"></div>
<div className="flex flex-col items-end">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Status</span>
<span className="text-[10px] font-bold text-primary flex items-center gap-1">
<span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            ACTIVE
                        </span>
</div>
</div>
<div className="flex items-center justify-end gap-2">
<button className="p-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-xl" data-icon="edit">edit</span>
</button>
<button className="p-2.5 rounded-xl text-error hover:bg-error-container/20 transition-colors">
<span className="material-symbols-outlined text-xl" data-icon="delete">delete</span>
</button>
</div>
</div>
{/* Service Card 2 */}
<div className="bg-surface-container-lowest rounded-xl p-5 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative">
<div className="absolute top-4 right-4 z-10">
<label className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox" value=""/>
<div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex items-start gap-4 mb-6">
<div className="w-16 h-16 rounded-xl bg-tertiary-fixed flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-on-tertiary-fixed text-3xl" data-icon="plumbing">plumbing</span>
</div>
<div>
<span className="inline-block px-2 py-0.5 bg-surface-container text-[10px] font-bold text-on-surface-variant rounded-md mb-1 uppercase tracking-wider">Plumbing</span>
<h3 className="text-xl font-bold text-on-surface leading-tight">Leaking Tap Repair Service</h3>
</div>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl mb-6">
<div className="flex flex-col">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Price</span>
<span className="text-lg font-black text-primary">₹299</span>
</div>
<div className="h-8 w-px bg-outline-variant/30"></div>
<div className="flex flex-col">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Duration</span>
<span className="text-sm font-bold">30 mins</span>
</div>
<div className="h-8 w-px bg-outline-variant/30"></div>
<div className="flex flex-col items-end">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Status</span>
<span className="text-[10px] font-bold text-primary flex items-center gap-1">
<span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            ACTIVE
                        </span>
</div>
</div>
<div className="flex items-center justify-end gap-2">
<button className="p-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-xl" data-icon="edit">edit</span>
</button>
<button className="p-2.5 rounded-xl text-error hover:bg-error-container/20 transition-colors">
<span className="material-symbols-outlined text-xl" data-icon="delete">delete</span>
</button>
</div>
</div>
{/* Service Card 3 (Inactive State) */}
<div className="bg-surface-container-low/50 rounded-xl p-5 border border-dashed border-outline-variant/40 group transition-all duration-300 relative overflow-hidden">
<div className="absolute inset-0 bg-surface-container-highest/20 pointer-events-none"></div>
<div className="absolute top-4 right-4 z-10">
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox" value=""/>
<div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex items-start gap-4 mb-6 opacity-60">
<div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-on-surface-variant text-3xl" data-icon="ac_unit">ac_unit</span>
</div>
<div>
<span className="inline-block px-2 py-0.5 bg-surface-container text-[10px] font-bold text-on-surface-variant rounded-md mb-1 uppercase tracking-wider">AC Service</span>
<h3 className="text-xl font-bold text-on-surface leading-tight">Full AC Maintenance</h3>
</div>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container-high/40 rounded-xl mb-6 opacity-60">
<div className="flex flex-col">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Price</span>
<span className="text-lg font-black text-on-surface-variant">₹1,499</span>
</div>
<div className="h-8 w-px bg-outline-variant/30"></div>
<div className="flex flex-col">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Duration</span>
<span className="text-sm font-bold">120 mins</span>
</div>
<div className="h-8 w-px bg-outline-variant/30"></div>
<div className="flex flex-col items-end">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Status</span>
<span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
<span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full"></span>
                            INACTIVE
                        </span>
</div>
</div>
<div className="flex items-center justify-end gap-2">
<button className="p-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-xl" data-icon="edit">edit</span>
</button>
<button className="p-2.5 rounded-xl text-error hover:bg-error-container/20 transition-colors">
<span className="material-symbols-outlined text-xl" data-icon="delete">delete</span>
</button>
</div>
</div>
{/* Empty State / Add New Card Concept */}
<button className="bg-surface-container rounded-xl p-5 border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center min-h-[280px] group hover:border-primary/50 transition-all">
<div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-on-surface-variant text-4xl" data-icon="add_circle">add_circle</span>
</div>
<h3 className="text-lg font-bold text-on-surface">Expand Your Catalog</h3>
<p className="text-on-surface-variant text-sm text-center px-6 mt-2">Add more services to increase your visibility in the marketplace.</p>
{/* Tooltip for first-time setup */}
<div className="mt-6 relative">
<div className="bg-primary text-on-primary text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse">
<span className="material-symbols-outlined text-xs" data-icon="lightbulb">lightbulb</span>
                        TIP: ADD AT LEAST 5 SERVICES FOR 2X REACH
                    </div>
</div>
</button>
</div>
{/* Secondary Section: Performance Overview (Editorial Asymmetry) */}
<section className="mt-20">
<div className="flex items-center gap-4 mb-8">
<div className="h-px flex-1 bg-outline-variant/30"></div>
<h2 className="text-xl font-black uppercase tracking-widest text-on-surface-variant">Service Performance</h2>
<div className="h-px flex-1 bg-outline-variant/30"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
<div className="md:col-span-1 bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-xl p-6 text-on-primary">
<p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Most Booked</p>
<h4 className="text-2xl font-black mb-4 leading-tight">Fan Repair</h4>
<div className="flex items-baseline gap-2">
<span className="text-4xl font-black">42</span>
<span className="text-sm font-medium opacity-70">bookings / month</span>
</div>
</div>
<div className="md:col-span-3 bg-surface-container-low rounded-xl p-6 flex flex-col md:flex-row items-center gap-8">
<div className="shrink-0 w-32 h-32 relative">
<svg className="w-full h-full transform -rotate-90">
<circle className="text-outline-variant/20" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
<circle className="text-primary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" stroke-dasharray="364.4" stroke-dashoffset="72.8" strokeWidth="8"></circle>
</svg>
<div className="absolute inset-0 flex items-center justify-center flex-col">
<span className="text-2xl font-black text-on-surface">80%</span>
<span className="text-[8px] font-bold uppercase">Efficiency</span>
</div>
</div>
<div>
<h4 className="text-lg font-bold mb-2">Service Completion Rate</h4>
<p className="text-on-surface-variant text-sm leading-relaxed max-w-md">Your services are performing well. Maintaining an 80%+ completion rate keeps you in the "Top Rated" tier, providing higher visibility to local customers.</p>
<div className="flex gap-4 mt-4">
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="text-[10px] font-bold text-on-surface-variant">COMPLETED</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 rounded-full bg-outline-variant"></span>
<span className="text-[10px] font-bold text-on-surface-variant">RECHEDULED</span>
</div>
</div>
</div>
</div>
</div>
</section>
</main>
{/* Floating Action Drawer (Contextual FAB Suppression Followed) */}
{/* Suppressed on "Details" or "Transactional" screens, but highly relevant for Dashboard/List views */}
<div className="fixed bottom-8 right-8 z-50">
<button className="w-14 h-14 bg-surface-container-lowest text-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-outline-variant/10">
<span className="material-symbols-outlined text-2xl" data-icon="chat_bubble">chat_bubble</span>
<span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-[10px] text-white font-bold flex items-center justify-center rounded-full border-2 border-surface">3</span>
</button>
</div>

    </>
  );
}
