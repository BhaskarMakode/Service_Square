import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminVerificationDetail() {
    return (
        <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex">
            {/* Sidebar Navigation */}
            <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/15 bg-slate-50 dark:bg-slate-950 flex flex-col p-4 gap-2 z-50">
                <Link to="/" className="flex items-center gap-3 px-2 py-4 mb-4">
                    <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary">
                        <span className="material-symbols-outlined">grid_view</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">Service Square</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Admin Console</p>
                    </div>
                </Link>
                <nav className="flex-1 space-y-1">
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200 hover:translate-x-1 group" to="/admin-verification-queue">
                        <span className="material-symbols-outlined text-xl">dashboard</span>
                        <span className="text-sm font-medium tracking-wide">Overview</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm rounded-xl transition-all duration-200" to="/admin-verification-queue">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                        <span className="text-sm font-semibold tracking-wide">Provider Verification</span>
                    </Link>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all duration-200 hover:translate-x-1 group" href="#">
                        <span className="material-symbols-outlined text-xl">group</span>
                        <span className="text-sm font-medium tracking-wide">User Management</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all duration-200 hover:translate-x-1 group" href="#">
                        <span className="material-symbols-outlined text-xl">calendar_month</span>
                        <span className="text-sm font-medium tracking-wide">Bookings</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all duration-200 hover:translate-x-1 group" href="#">
                        <span className="material-symbols-outlined text-xl">analytics</span>
                        <span className="text-sm font-medium tracking-wide">Analytics</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all duration-200 hover:translate-x-1 group" href="#">
                        <span className="material-symbols-outlined text-xl">settings</span>
                        <span className="text-sm font-medium tracking-wide">Settings</span>
                    </a>
                </nav>
                <div className="pt-4 border-t border-outline-variant/15">
                    <button className="w-full bg-primary-container text-on-primary py-3 rounded-xl font-semibold shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">ios_share</span>
                        Export Report
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-3 mt-2 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all duration-200">
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <span className="text-sm font-medium tracking-wide">Logout</span>
                    </button>
                </div>
            </aside>
            {/* Main Content Canvas */}
            <main className="ml-64 flex-1 min-h-screen bg-surface">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-4 border-b border-outline-variant/15 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/admin-verification-queue" className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-on-surface tracking-tight">Provider Verification</h2>
                            <p className="text-sm text-on-surface-variant">Application ID: #APP-882190-24</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-xs font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                            Pending Review
                        </div>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
                            <img alt="Admin" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYUEUaDiLYEPaWNCE2vGsjGGL-5ATWUN2XPhKE9NGZFc48xwd2Ckztcsr-4gzz9KWZgdHZeXvhLICdsPrvdC9D6tj3wVpMDwUAu-bOZFgsUWFaw6c5vmCAv7rHSJ13AD3vH37rMA6mkpeIltuC9xDySouiJkRLMpEb5bLQnl4aYOxv8Iw7hpyZXPd3LTwQ51v-NGJOuQbka2ESNVrcMnP05H6ef1b9O6WjV7TGz8zasoZkkYkbmvNaSgdZoDsOn2W6-mV8TfjnYBA" />
                        </div>
                    </div>
                </header>
                {/* Layout Wrapper */}
                <div className="p-8 flex flex-col lg:flex-row gap-8">
                    {/* Left: Profile Details */}
                    <div className="flex-1 space-y-8">
                        {/* Personal Info & Experience Bento */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Hero Card */}
                            <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/5 flex items-start gap-6">
                                <div className="relative">
                                    <img className="w-32 h-32 rounded-2xl object-cover shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeW5gdLhoq3qpyi_iBU116YJtC0_fH_Mk-LPey5-K2r9EZ31CpA_1QfTj_Z9XrNOzABI8ZGoFGv6SsCWvw0mQnsR-0wOdbD9ui5IYftH4XR-AcnmVKCLTAPEPZun4_lrqicGVgLO1i0EJfKPZEPEmgltoqHX8oxugZFp-foeLXgPyJJm3sCm9AiPxj6PaoWHSnbUU6xhBWXc0O5VTMJYA3J8lcCj14magXnZ3GT-jdZaEIB_3pWTnQ_DggaPpLwot2admSziVtQfc" alt="Provider" />
                                    <div className="absolute -top-3 -right-3 bg-white/40 backdrop-blur-xl border border-white/40 p-2 rounded-xl shadow-lg">
                                        <div className="bg-secondary-container p-1 rounded-lg">
                                            <span className="material-symbols-outlined text-on-secondary-container text-lg">plumbing</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold tracking-tight text-on-surface">Julian Alexander</h3>
                                    <p className="text-on-surface-variant font-medium">Professional Plumbing Expert</p>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Location</p>
                                            <p className="text-sm font-semibold">Brooklyn, NY</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Member Since</p>
                                            <p className="text-sm font-semibold">Oct 12, 2023</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Email</p>
                                            <p className="text-sm font-semibold truncate">j.alex@example.com</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Phone</p>
                                            <p className="text-sm font-semibold">+1 202-555-0143</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Experience Card */}
                            <div className="col-span-12 lg:col-span-5 bg-surface-container-low p-6 rounded-3xl border border-outline-variant/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary">history_edu</span>
                                    <h4 className="font-bold text-on-surface">Experience Detail</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-surface-container-lowest p-3 rounded-2xl flex items-center justify-between">
                                        <span className="text-sm font-medium text-on-surface-variant">Years of Practice</span>
                                        <span className="text-sm font-bold text-primary">8+ Years</span>
                                    </div>
                                    <div className="bg-surface-container-lowest p-3 rounded-2xl flex items-center justify-between">
                                        <span className="text-sm font-medium text-on-surface-variant">Specialization</span>
                                        <span className="text-sm font-bold text-primary">Master Plumber</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-outline mb-2">Primary Services</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-white dark:bg-slate-800 dark:border-slate-700 rounded-full text-[11px] font-bold border border-outline-variant/20 shadow-sm text-on-surface">Leak Repair</span>
                                            <span className="px-3 py-1 bg-white dark:bg-slate-800 dark:border-slate-700 rounded-full text-[11px] font-bold border border-outline-variant/20 shadow-sm text-on-surface">Pipe Install</span>
                                            <span className="px-3 py-1 bg-white dark:bg-slate-800 dark:border-slate-700 rounded-full text-[11px] font-bold border border-outline-variant/20 shadow-sm text-on-surface">Gas Fitting</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Documents Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-on-surface tracking-tight">Verification Documents</h4>
                                <button className="text-xs font-bold text-primary flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                    View All (4)
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* ID Document */}
                                <div className="group relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                                    <div className="h-40 bg-surface-container-highest relative">
                                        <img className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500 opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlaPVwVaUGgXK8pomF6Uqo3bFzakS89b3Th30Mb_ELT3px4CIba6RMNelLK2CiGHAu9zr55t1y2imhj5ZXgl0SvK-cPBGvr3UBYFBgUyC_eiQMZQm50yYz5B3svf7jzJZ41kByRXMZ9zaoGbzJAZ2js-qeYShmNVVyylX8M7Wzhlq7M_vejbjapzVRp_srThBG9k2mUNS1BpbjpFspEl41QgnavkQLuAy15zN9nZPqQ9fKiMFeGmCULZHxapqVHdhj2DrWmRvXdt0" alt="Identity Doc" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-outline-variant">lock</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-bold text-on-surface">Government Photo ID</p>
                                        <p className="text-xs text-on-surface-variant">Verified by AI Engine</p>
                                    </div>
                                </div>
                                {/* Certification */}
                                <div className="group relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm cursor-pointer">
                                    <div className="h-40 bg-surface-container-highest relative">
                                        <img className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-X_e8PIFgwTxctUNDuP6brhLghzSJCdWaszSLr9TfUFZrxp4xr7q4Mr6X4ZHc7WCdFSD3jWlgn3GnNx_6aNHnFQJtKv7qtY1i1-C72wPgF2FIhQU1uH2WVTuA0JhUAgIg3MMN1NWvpGFrd7LVFywQvVEpvXEpGIuqT4cBD7x1oNKaNg8wyPiu7d05Kl-PmEr_nd_-GCrDFQlyTCuHwQVCM4fRZjSWo2TDw_Z9I704TizG7uNAYcvhop2lorUlwCei6O9IguLamTQ" alt="License Doc" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/30 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">zoom_in</span>
                                                Preview
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-bold text-on-surface">Plumbing License #P-1120</p>
                                        <p className="text-xs text-on-surface-variant">Expires Dec 2026</p>
                                    </div>
                                </div>
                                {/* Insurance */}
                                <div className="group relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm cursor-pointer">
                                    <div className="h-40 bg-surface-container-highest relative">
                                        <img className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBpi5YDi-MzsPsQ8BDoNTgqex2OL10kN8fbKpklxKJUZF-K7Bg8Yug2x16lX0ahxjfYVYeS7cyoYCJRWR_RGR5i9QsZrwNoMViP8YG_WxFP3F_bCeTzVWB6mRRir70Jin1BPlcKZ3Dfl1er0bfYt5HldyMlPaE5ynltZ1-9GeXV73tEieF10S-hiYKbyz2c-kDOmhrTYAr33ne4QF12sji2NoBUd5KFrQNPX0KhN8zlg7Bnh50X4kaJoNg1_hL68fM0VbT7Ox85cs" alt="Insurance Doc" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/30 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">zoom_in</span>
                                                Preview
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-bold text-on-surface">General Liability Ins.</p>
                                        <p className="text-xs text-on-surface-variant">Coverage up to $1M</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Location Map */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">map</span>
                                <h4 className="text-lg font-bold text-on-surface tracking-tight">Service Radius</h4>
                            </div>
                            <div className="h-[300px] w-full bg-surface-container rounded-[2rem] overflow-hidden border border-outline-variant/20 relative shadow-inner">
                                <img className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXl-EtxmzONfbO0hTCNeRfB2kJ-2asfJrmud0y_pyYCXEdBrZupYQGBQtFHdo89c7bsJrS8Y5kO3nNppj1ayN1WC8li0u8l7QXavTz2-D4Cg4R4aExe32al1G-dv-M-A4h3WU-kIOMFDPWT7b_KWIgEFCDF93rwTE6tTe3Ye_jpnQw8oGtA9EP2YyIVyVhcrrVfBxjgx0mBcgAK4Ysfer1MJU0wLSxNsWm0MAfP8PY7uMd-JWZOc47N-po8fhDsj6Pb9CPS00JgvY" alt="Map" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-48 h-48 rounded-full border-4 border-primary/20 bg-primary/10 flex items-center justify-center animate-pulse">
                                        <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(53,37,205,0.5)]"></div>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-lg flex items-center gap-3 border border-white/20">
                                    <div className="bg-primary/10 p-2 rounded-xl">
                                        <span className="material-symbols-outlined text-primary">location_on</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface">15-mile radius</p>
                                        <p className="text-[10px] text-on-surface-variant font-medium">Brooklyn &amp; Queens area</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* Right: Action Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0 sticky top-[88px] h-fit mb-8">
                        <div className="bg-surface-container-lowest p-6 rounded-[2.5rem] shadow-sm border border-outline-variant/10 space-y-6">
                            <div>
                                <h5 className="text-base font-bold text-on-surface mb-1">Moderation Hub</h5>
                                <p className="text-xs text-on-surface-variant">Take action on this provider application.</p>
                            </div>
                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link to="/admin-verification-queue" className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl font-bold flex items-center justify-between group active:scale-95 transition-all shadow-md hover:brightness-110">
                                    <span>Approve Provider</span>
                                    <span className="material-symbols-outlined text-white/50 group-hover:text-white transition-colors">check_circle</span>
                                </Link>
                                <button className="w-full py-4 px-6 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-2xl font-bold flex items-center justify-between group active:scale-95 transition-all hover:brightness-105">
                                    <span>Request Info</span>
                                    <span className="material-symbols-outlined text-on-tertiary-fixed-variant/50 group-hover:text-on-tertiary-fixed-variant transition-colors">help_center</span>
                                </button>
                                <Link to="/admin-verification-queue" className="w-full py-4 px-6 bg-error-container text-on-error-container rounded-2xl font-bold flex items-center justify-between group active:scale-95 transition-all hover:brightness-105">
                                    <span>Reject Application</span>
                                    <span className="material-symbols-outlined text-on-error-container/50 group-hover:text-on-error-container transition-colors">cancel</span>
                                </Link>
                            </div>
                            {/* Rejection Reason */}
                            <div className="pt-6 border-t border-outline-variant/10">
                                <label className="block text-xs font-bold text-outline uppercase tracking-widest mb-2" htmlFor="rejection-reason">Internal Review Note</label>
                                <textarea className="w-full bg-surface-container-high border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary-fixed focus:bg-white dark:focus:bg-slate-800 transition-all resize-none text-on-surface" id="rejection-reason" placeholder="Enter reason for rejection or details requested..." rows="4"></textarea>
                            </div>
                            {/* Quick Tools */}
                            <div className="bg-surface-container-low rounded-2xl p-4">
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">Auditor Metadata</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-on-surface-variant">Profile Score</span>
                                        <span className="font-bold text-secondary">92% Match</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-on-surface-variant">Duplicate Check</span>
                                        <span className="font-bold text-secondary">No Conflicts</span>
                                    </div>
                                    <div className="w-full bg-outline-variant/20 h-1.5 rounded-full overflow-hidden mt-2">
                                        <div className="bg-secondary h-full w-[92%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
