import React from 'react';
import { Link } from 'react-router-dom';

export default function ProviderPanel() {
  return (
    <>
      
{/* TopNavBar */}
<header className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none">
<div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
<Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400">
                Service Square
            </Link>
<nav className="hidden md:flex items-center gap-8">
<Link className="text-indigo-700 dark:text-indigo-300 font-bold border-b-2 border-indigo-500 pb-1" to="/provider-panel">Dashboard</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/my-services">My Services</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/provider-panel">Jobs</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/provider-earnings">Earnings</Link>
</nav>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined p-2 hover:bg-slate-100/50 rounded-lg transition-transform active:scale-95">notifications</button>
<div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">JD</div>
</div>
</div>
</header>
<div className="flex max-w-7xl mx-auto">
{/* SideNavBar - Desktop */}
<aside className="hidden lg:flex flex-col p-6 gap-4 h-[calc(100vh-80px)] w-72 bg-slate-50 dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 sticky top-20">
<div className="mb-6">
<h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Navigation</h3>
</div>
<nav className="space-y-2">
<Link className="bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm rounded-xl px-4 py-3 flex items-center gap-3 transition-all hover:translate-x-1 active:scale-[0.98]" to="/provider-panel">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
<span className="font-medium">Dashboard</span>
</Link>
<Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl transition-all hover:translate-x-1 active:scale-[0.98]" to="/provider-portfolio">
<span className="material-symbols-outlined">account_box</span>
<span className="font-medium">My Portfolio</span>
</Link>
<Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl transition-all hover:translate-x-1 active:scale-[0.98]" to="/provider-subscription">
<span className="material-symbols-outlined">card_membership</span>
<span className="font-medium">Premium Plan</span>
</Link>
<Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl transition-all hover:translate-x-1 active:scale-[0.98]" to="/provider-availability">
<span className="material-symbols-outlined">calendar_today</span>
<span className="font-medium">Availability</span>
</Link>
<Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl transition-all hover:translate-x-1 active:scale-[0.98]" to="/chat">
<span className="material-symbols-outlined">chat_bubble</span>
<span className="font-medium">Messages</span>
</Link>
</nav>
<div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
<div className="bg-indigo-600 rounded-2xl p-4 text-white">
<p className="text-xs font-medium opacity-80 mb-1">Status</p>
<div className="flex items-center gap-2">
<span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
<span className="font-bold">Accepting Jobs</span>
</div>
</div>
</div>
</aside>
{/* Main Content */}
<main className="flex-1 p-6 md:p-10">
{/* Header Section */}
<div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Provider Panel</h1>
<p className="text-on-surface-variant body-lg">Welcome back, John. You have 3 new job requests waiting.</p>
</div>
<div className="flex gap-3">
<button className="bg-surface-container-low px-6 py-3 rounded-xl font-semibold text-indigo-600 hover:bg-surface-container-high transition-all active:scale-95 border border-outline-variant/15">
                        Download Report
                    </button>
<Link to="/provider-availability" className="bg-gradient-to-br from-primary to-primary-container px-6 py-3 rounded-xl font-semibold text-white shadow-lg shadow-primary/20 transition-all active:scale-95">
                        New Availability
                    </Link>
</div>
</div>
{/* Bento Grid Layout */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
{/* Metrics Grid */}
<div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col justify-between border border-outline-variant/10">
<div>
<p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Earnings</p>
<h2 className="text-3xl font-black text-on-surface">$12,480.50</h2>
</div>
<div className="mt-6 h-32 w-full flex items-end gap-1">
{/* Simple Visual Chart Placeholder */}
<div className="flex-1 bg-indigo-100 rounded-t-lg h-1/2"></div>
<div className="flex-1 bg-indigo-200 rounded-t-lg h-2/3"></div>
<div className="flex-1 bg-indigo-300 rounded-t-lg h-1/3"></div>
<div className="flex-1 bg-indigo-400 rounded-t-lg h-3/4"></div>
<div className="flex-1 bg-indigo-500 rounded-t-lg h-2/3"></div>
<div className="flex-1 bg-primary rounded-t-lg h-full"></div>
<div className="flex-1 bg-indigo-500 rounded-t-lg h-4/5"></div>
</div>
</div>
<div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
<div className="flex flex-col h-full justify-between">
<div>
<span className="material-symbols-outlined text-secondary text-3xl mb-4">star</span>
<p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Rating</p>
<h2 className="text-3xl font-black text-on-surface">4.9/5</h2>
</div>
<div className="text-xs text-emerald-600 font-bold bg-emerald-50 self-start px-2 py-1 rounded-full">+0.2 this month</div>
</div>
</div>
</div>
{/* Job Requests (Asymmetric sidebar) */}
<div className="lg:col-span-4 lg:row-span-2 space-y-6">
<div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
<div className="flex items-center justify-between mb-6">
<h3 className="font-extrabold text-xl">Job Requests</h3>
<span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">3 New</span>
</div>
<div className="space-y-4">
{/* Job Card */}
<div className="p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container transition-colors">
<div className="flex justify-between items-start mb-2">
<div className="font-bold text-on-surface">Deep Clean - Residence</div>
<div className="text-primary font-black text-lg">$120</div>
</div>
<div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
<span className="material-symbols-outlined text-sm">location_on</span>
<span>Downtown Brooklyn, NY</span>
</div>
<div className="grid grid-cols-2 gap-2">
<button className="bg-white text-on-surface py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-all">Decline</button>
<button className="bg-primary text-white py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-all">Accept</button>
</div>
</div>
{/* Job Card */}
<div className="p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container transition-colors">
<div className="flex justify-between items-start mb-2">
<div className="font-bold text-on-surface">AC Maintenance</div>
<div className="text-primary font-black text-lg">$85</div>
</div>
<div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
<span className="material-symbols-outlined text-sm">location_on</span>
<span>Greenwich Village, NY</span>
</div>
<div className="grid grid-cols-2 gap-2">
<button className="bg-white text-on-surface py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-all">Decline</button>
<button className="bg-primary text-white py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-all">Accept</button>
</div>
</div>
</div>
</div>
<div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
<h3 className="font-extrabold text-xl mb-4">Support</h3>
<p className="text-sm text-on-surface-variant mb-4">Need help with a job or payment issue? Contact our 24/7 provider support.</p>
<button className="w-full flex items-center justify-center gap-2 text-indigo-600 font-bold py-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">
<span className="material-symbols-outlined">headset_mic</span>
                            Open Support Chat
                        </button>
</div>
</div>
{/* Upcoming Schedule (Wide component) */}
<div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
<div className="flex items-center justify-between mb-8">
<h3 className="font-extrabold text-2xl tracking-tight">Upcoming Schedule</h3>
<Link to="/provider-availability" className="text-primary font-bold flex items-center gap-1 hover:underline">
                            Full Calendar
                            <span className="material-symbols-outlined">arrow_forward</span>
</Link>
</div>
<div className="space-y-6">
{/* Schedule Row */}
<div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-surface-container-low transition-colors">
<div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-secondary-container text-on-secondary-container rounded-xl">
<span className="text-xs font-bold uppercase">Oct</span>
<span className="text-xl font-black leading-none">12</span>
</div>
<div className="flex-1">
<h4 className="font-bold text-lg">Electrical Repair - Kitchen</h4>
<p className="text-on-surface-variant text-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">schedule</span>
                                    09:00 AM - 11:30 AM
                                </p>
</div>
<div className="hidden md:flex items-center -space-x-3">
<img className="w-10 h-10 rounded-full border-2 border-white object-cover" data-alt="Client profile picture placeholder" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx2skQeOj2LG_fI-MwSLUWybjOdx33RLRPlxolGCG8Ns-2XxetB6LK-SZfuZ2p-4wdsmilYiSBGS2L-AYqK1kU_3QI_5vAw1Hdcz99G9MuNEQenIvaxAgSN9JkMamNbTyMt5fmiUgL86LvYFVKkZwZWDpWMbhWU4F7xiusXfQGYBiJyHRQCchfdNtTSGux9nFmGgyERxjygH_G0YeA8ASu-iRp8ZYWaLVaZLifJd5DeUMi4RDH2evTcnE-blNhiRzWmcDT7z_sSqI"/>
<div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold">+2</div>
</div>
<button className="bg-surface-container-high px-4 py-2 rounded-lg text-sm font-bold text-on-surface active:scale-95 transition-all">Details</button>
</div>
{/* Schedule Row */}
<div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-surface-container-low transition-colors">
<div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-primary-fixed text-on-primary-fixed rounded-xl">
<span className="text-xs font-bold uppercase">Oct</span>
<span className="text-xl font-black leading-none">12</span>
</div>
<div className="flex-1">
<h4 className="font-bold text-lg">General Plumbing Checkup</h4>
<p className="text-on-surface-variant text-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">schedule</span>
                                    02:00 PM - 04:00 PM
                                </p>
</div>
<div className="hidden md:flex items-center -space-x-3">
<img className="w-10 h-10 rounded-full border-2 border-white object-cover" data-alt="Client profile picture placeholder" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnrr6wETSDehT2lxyqXzCuWhr57yNzbs-H_1bi8r-hAGqnlcN992uA7VH5lJhrUr3_au3h2mOF6RqLtLSbPzxA_7WhYHVzgNcx1dn_rg193E17CAvnFRSGXp9oBFRUywEj2xQHHM4y5gWIisE3uFtQbuzF8dBA6an3Yx6Tz5X23TLB4p6Dwn2PAoYObsO1SOrZI8aVsbEpsTROdVignYZEe57dWF23KNoe_8zdE4rmqCQ07HQA-cspH4Qcr6pu71aMgWOhOgepcUc"/>
</div>
<button className="bg-surface-container-high px-4 py-2 rounded-lg text-sm font-bold text-on-surface active:scale-95 transition-all">Details</button>
</div>
{/* Schedule Row */}
<div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-surface-container-low transition-colors">
<div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-tertiary-fixed text-on-tertiary-fixed rounded-xl">
<span className="text-xs font-bold uppercase">Oct</span>
<span className="text-xl font-black leading-none">13</span>
</div>
<div className="flex-1">
<h4 className="font-bold text-lg">Furniture Assembly</h4>
<p className="text-on-surface-variant text-sm flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">schedule</span>
                                    10:00 AM - 01:00 PM
                                </p>
</div>
<div className="hidden md:flex items-center -space-x-3">
<img className="w-10 h-10 rounded-full border-2 border-white object-cover" data-alt="Client profile picture placeholder" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYwV6XSYl7FoR0Bhxg5P5uU010n2dKBHgqppOz5DwZY1iFofxyJeaNjSR4ZOLKgv6lewdPK-0gma2SrNrQR8viiXnoBYhjvt0T7oDB4L2E-n2mosTX16FBotFx2Sj2JvisU9Ve6iZ8uKmXWH85fRPqz-xmAWojtawTEY32bYz-Z9tqnt_k2Ix1dZ4_5i2vjovNY2kTnpizGEddJzv6Er5MQ83YxB2Ylnd7d50E5HZTXXLQwu8WB9PNvXelOr5M0FWRYq-lEzZxOL8"/>
</div>
<button className="bg-surface-container-high px-4 py-2 rounded-lg text-sm font-bold text-on-surface active:scale-95 transition-all">Details</button>
</div>
</div>
</div>
</div>
</main>
</div>
{/* Footer */}
<footer className="w-full pt-20 pb-10 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-20">
<div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
<div className="col-span-2">
<div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Service Square</div>
<p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Connecting elite service professionals with the world's most discerning clients. Premium Editorial Marketplace.</p>
</div>
<div>
<h4 className="font-bold mb-4">Marketplace</h4>
<ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
<li><a className="hover:text-indigo-500 transition-colors" href="#">About Us</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Services</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Become a Provider</a></li>
</ul>
</div>
<div>
<h4 className="font-bold mb-4">Resources</h4>
<ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
<li><a className="hover:text-indigo-500 transition-colors" href="#">Help Center</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Safety</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Guidelines</a></li>
</ul>
</div>
<div>
<h4 className="font-bold mb-4">Legal</h4>
<ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
<li><a className="hover:text-indigo-500 transition-colors" href="#">Privacy Policy</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Legal</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Terms of Service</a></li>
</ul>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
<p className="text-sm text-slate-500 dark:text-slate-400">© 2024 Service Square. Premium Editorial Marketplace.</p>
<div className="flex gap-6">
<span className="material-symbols-outlined text-slate-400 hover:text-indigo-500 cursor-pointer">language</span>
<span className="material-symbols-outlined text-slate-400 hover:text-indigo-500 cursor-pointer">share</span>
</div>
</div>
</footer>

    </>
  );
}
