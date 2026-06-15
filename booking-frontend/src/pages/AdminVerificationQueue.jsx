import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminVerificationQueue() {
    return (
        <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex">
            {/* Sidebar Navigation */}
            <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50 dark:bg-slate-950 flex flex-col p-4 gap-2 z-50 border-r border-surface-container">
                <Link to="/" className="flex items-center gap-3 px-2 mb-8 cursor-pointer">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 leading-none">Service Square</h1>
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">Admin Console</p>
                    </div>
                </Link>
                <nav className="flex-1 flex flex-col gap-1">
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-all duration-200" to="/admin-verification-queue">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium tracking-wide">Overview</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm rounded-xl hover:translate-x-1 transition-all duration-200" to="/admin-verification-queue">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                        <span className="text-sm font-medium tracking-wide">Provider Verification</span>
                    </Link>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">group</span>
                        <span className="text-sm font-medium tracking-wide">User Management</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">calendar_month</span>
                        <span className="text-sm font-medium tracking-wide">Bookings</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">analytics</span>
                        <span className="text-sm font-medium tracking-wide">Analytics</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-sm font-medium tracking-wide">Settings</span>
                    </a>
                </nav>
                <div className="mt-auto pt-4">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>
            {/* Main Content Canvas */}
            <main className="ml-64 flex-1 min-h-screen p-8 bg-surface">
                {/* Top Bar */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-on-surface">Provider Verification</h2>
                        <p className="text-on-surface-variant mt-1">Review and manage professional service applications.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
                            <input className="pl-10 pr-4 py-2.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all w-64 text-sm" placeholder="Search providers..." type="text" />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                            <span className="material-symbols-outlined text-sm">download</span>
                            Export Report
                        </button>
                    </div>
                </header>
                {/* Bento Grid Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-primary bg-primary-fixed p-2 rounded-lg">list_alt</span>
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+12%</span>
                        </div>
                        <div>
                            <p className="text-on-surface-variant text-sm font-medium">Total Applications</p>
                            <h3 className="text-2xl font-black text-on-surface">1,284</h3>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-tertiary bg-tertiary-fixed p-2 rounded-lg">pending_actions</span>
                            <span className="text-xs font-bold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded-full">Action Required</span>
                        </div>
                        <div>
                            <p className="text-on-surface-variant text-sm font-medium">Pending Review</p>
                            <h3 className="text-2xl font-black text-on-surface">43</h3>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-secondary bg-secondary-container p-2 rounded-lg">verified</span>
                        </div>
                        <div>
                            <p className="text-on-surface-variant text-sm font-medium">Approved Today</p>
                            <h3 className="text-2xl font-black text-on-surface">18</h3>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-error bg-error-container p-2 rounded-lg">block</span>
                        </div>
                        <div>
                            <p className="text-on-surface-variant text-sm font-medium">Rejected</p>
                            <h3 className="text-2xl font-black text-on-surface">7</h3>
                        </div>
                    </div>
                </div>
                {/* Verification Table Section */}
                <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-surface-container">
                    <div className="px-8 py-6 flex items-center justify-between border-b border-surface-container">
                        <h4 className="font-bold text-lg">Active Verification Queue</h4>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-semibold bg-surface-container-low rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">All Categories</button>
                            <button className="px-4 py-2 text-sm font-semibold bg-surface-container-low rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">Newest First</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-on-surface-variant text-xs uppercase tracking-widest font-bold bg-surface-container-low/30">
                                    <th className="px-8 py-5">Provider Name</th>
                                    <th className="px-8 py-5">Category</th>
                                    <th className="px-8 py-5">Registration Date</th>
                                    <th className="px-8 py-5">Verification Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                <tr className="hover:bg-surface-container-low/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2xDNasi_Oe4kp32YRb5hR-h544K5-UEzOPVLhjtdwYlXM19UsnjDTrkKKXLbX6WsYbV2DqrtNVd_f25iS1YUS6xC9yXHDPEVVX6rX1A4oGEpk0Vfm5bMpWLtFF75ag4NOqg25_GrsXnn2hY6AxZdV23P5RP3-ZPJ0CXLyUgyfmORiIEEaZOqf5ULYC5Tc5BTN-kiPSLSl45sOvMkaqfzcwPQHQGt4W6K_XMholgmGmG_gpYUbujkxUAe8hf8OrQHGgFns0YshjXo" alt="Provider" />
                                            <div>
                                                <p className="font-bold text-on-surface">Alex Rivera</p>
                                                <p className="text-xs text-on-surface-variant">alex.r@profix.com</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                            <span className="text-sm font-medium">Home Maintenance</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-on-surface-variant">Oct 24, 2023</td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-tertiary-fixed text-on-tertiary-fixed-variant">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link to="/admin-verification-detail" className="inline-block px-4 py-2 text-sm font-bold text-primary hover:bg-primary-fixed rounded-lg transition-colors active:scale-[0.98]">View Details</Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-surface-container-low/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS4_UOl1Us4GOcNL87LqiInKiVik-c4XBCkTLZpoYmYWtKjA113FB_LG__WcgsNvVZStOCLTJ8pZXbR5toQpFHc1nsXzfQHrgbC9ZXrqQGUDaUB5wLMTF08oprqa6l8VTHo7g-rnbmirqVsC8O1Nb3N2l5CJ6vEYRO5q__eQrwzOg7y2WmOKVE_J3IR5fynEnOtSgisAwVle1rQxVkBZPrU9wK7jd65RvcOgr4xVerGrucLdC4ihzJIPoy9AdcHBqN4cse-jzD69c" alt="Provider" />
                                            <div>
                                                <p className="font-bold text-on-surface">Sarah Jenkins</p>
                                                <p className="text-xs text-on-surface-variant">sarah.j@sparkle.co</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            <span className="text-sm font-medium">Cleaning Services</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-on-surface-variant">Oct 23, 2023</td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-tertiary-fixed text-on-tertiary-fixed-variant">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link to="/admin-verification-detail" className="inline-block px-4 py-2 text-sm font-bold text-primary hover:bg-primary-fixed rounded-lg transition-colors active:scale-[0.98]">View Details</Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-surface-container-low/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhyVhbGZ3GzgUuwEFy-M_puWzIJpgV0B6jQAeFjlGSRyIfkECH0f-0XjgXVk0p8E1W36wg5-YoDNySnnuAdTFQfi-54BaWbS38woW1jJ0akD-ybQ8CbowEX_AIpN9egj3Oep7TgqtszfnzcxiXgX4qA9CMdXX8XgWs5HPgObAD2ByW83FcZkzJvxisKZgJ4zhHJN79Hv4uUa6IcKN9zmflqpgkz9Tw_W6lLH-WNLvD9-kwxkgLIly9BKPI2b_slwCeiIYuSuGWjCQ" alt="Provider" />
                                            <div>
                                                <p className="font-bold text-on-surface">Michael Chen</p>
                                                <p className="text-xs text-on-surface-variant">m.chen@voltwise.io</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                            <span className="text-sm font-medium">Electrical</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-on-surface-variant">Oct 22, 2023</td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-tertiary-fixed text-on-tertiary-fixed-variant">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link to="/admin-verification-detail" className="inline-block px-4 py-2 text-sm font-bold text-primary hover:bg-primary-fixed rounded-lg transition-colors active:scale-[0.98]">View Details</Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-surface-container-low/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRHD601S7XRxp1GCebYOKfB9m2QBO_F-bVFwUUTBbm8pt-_FC3WfyqUp8kfhTMYZw1G4zfajkrrPxFjo0sxRtEbXw_qNzeljm6-pYlp-PaziAnCkmfp1L1ta6ZjynVnsGICeGN8gyzDR1riUI8Yqh64_7tqv-3yNMBkh6q3KB_AK4Fqs94uksKVR3OwDVxnXIQpNAYSc9NEL8AYJZhQOhZTQq07WkpCB1kNgcVhRYGOkC5oRojfO7ekyAhvkIobR2RnaJRygTaxOg" alt="Provider" />
                                            <div>
                                                <p className="font-bold text-on-surface">Elena Rodriguez</p>
                                                <p className="text-xs text-on-surface-variant">e.rod@greenery.net</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span className="text-sm font-medium">Landscaping</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-on-surface-variant">Oct 21, 2023</td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-tertiary-fixed text-on-tertiary-fixed-variant">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link to="/admin-verification-detail" className="inline-block px-4 py-2 text-sm font-bold text-primary hover:bg-primary-fixed rounded-lg transition-colors active:scale-[0.98]">View Details</Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="px-8 py-6 flex items-center justify-between border-t border-surface-container text-sm text-on-surface-variant bg-surface-container-low/20">
                        <p>Showing 1 to 4 of 43 pending applications</p>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors font-medium">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors font-medium">3</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            {/* Contextual FAB */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    );
}
