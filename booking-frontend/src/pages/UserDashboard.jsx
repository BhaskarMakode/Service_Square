import React from 'react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  return (
    <>
      
{/* Top Navigation Anchor */}
<header className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-['Inter'] antialiased tracking-tight">
<div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
<Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400">
                Service Square
            </Link>
<nav className="hidden md:flex gap-8 items-center">
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/">Home</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/service-listing">Services</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/provider">Become a Provider</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/about">About</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/contact">Contact</Link>
</nav>
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="User profile avatar smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsn2Pbjby8pZlPNMhhOTQEFiwmqTKX1w4ziU1v9RS05RU1HO0CyBS7Xz8_9rvvP2kXS7NKmre6Tm2uQlM9cPj-LrSE6arIn147OBWdnGiWlzgVmZjd5dPRTouKsUWZOSA_4mDPFV7yUayYgG1_LFTyTG5hZXCqZMo6jL-ysBZT2SJqV4sIw4GFd2xPIkVWvxcTUbQvfm7uG6KD8UdCqVBKwDHBGJwimGt8qNHexCA4kUcjKRDdVg2VKw1R5Ft_I9ZppxvwPn0sluw"/>
</div>
</div>
</div>
</header>
<div className="flex min-h-screen">
{/* Sidebar Navigation (Destinations) */}
<aside className="hidden lg:flex fixed left-0 top-20 flex-col p-6 gap-4 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 h-screen w-72 rounded-r-3xl font-['Inter'] text-sm font-medium">
<div className="mb-6 px-4">
<h2 className="text-on-surface font-bold text-lg">My Account</h2>
<p className="text-on-surface-variant text-xs">Manage your interactions</p>
</div>
<nav className="space-y-2">
<Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl hover:translate-x-1 transition-all active:scale-[0.98] duration-150" to="/dashboard">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span>Dashboard Overview</span>
</Link>
<Link className="bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm rounded-xl px-4 py-3 flex items-center gap-3 hover:translate-x-1 transition-all active:scale-[0.98] duration-150" to="/dashboard">
<span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span>Bookings</span>
</Link>
<Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl hover:translate-x-1 transition-all active:scale-[0.98] duration-150" to="/address-book">
<span className="material-symbols-outlined" data-icon="location_on">location_on</span>
<span>Address Book</span>
</Link>
<Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl hover:translate-x-1 transition-all active:scale-[0.98] duration-150" to="/invoices">
<span className="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
<span>Invoices</span>
</Link>
<Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl hover:translate-x-1 transition-all active:scale-[0.98] duration-150" to="/support">
<span className="material-symbols-outlined" data-icon="help_center">help_center</span>
<span>Support</span>
</Link>
</nav>
<div className="mt-auto pt-6 px-4">
<Link to="/service-listing" className="w-full inline-flex justify-center py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform duration-200">
                    Book New Service
</Link>
</div>
</aside>
{/* Main Content Canvas */}
<main className="flex-1 lg:ml-72 p-6 md:p-12 max-w-7xl">
{/* Header Section */}
<header className="mb-12">
<h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Your Bookings</h1>
<p className="text-on-surface-variant text-lg">Manage your active and previous service appointments.</p>
</header>
{/* Stats Bento Grid (Visual Interest) */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
<div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container opacity-20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
<p className="text-on-surface-variant text-sm font-semibold mb-1">Active Now</p>
<p className="text-3xl font-black text-on-surface">02</p>
</div>
<div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container opacity-20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
<p className="text-on-surface-variant text-sm font-semibold mb-1">Completed</p>
<p className="text-3xl font-black text-on-surface">24</p>
</div>
<div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container opacity-20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
<p className="text-on-surface-variant text-sm font-semibold mb-1">Pending Reviews</p>
<p className="text-3xl font-black text-on-surface">03</p>
</div>
</section>
{/* Bookings List */}
<div className="space-y-12">
{/* Section: In Progress */}
<section>
<div className="flex items-center gap-3 mb-6">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<h3 className="text-xl font-bold tracking-tight">Active Appointments</h3>
</div>
<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
{/* Active Booking Card 1 */}
<Link to="/tracking" className="bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row gap-6 relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-slate-100 cursor-pointer group">
<div className="w-full md:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 group-hover:opacity-90 transition-opacity">
<img className="w-full h-full object-cover" data-alt="Professional cleaner working in modern apartment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdozKCYQ1TajzKjYHeSuwxNlx5sF2n9i9RIyATIQVp2niF9KRE8dx2KDi5ta8qG__jIMOCgBvIMaasT5NsY8Z6uxlWYde6TYmXZGstEZXryKfWK3C53HnNODH2DYO850Wrszoy06slRP3AA7EhbGUpD8r4SJtj_gU0HBW_YazKdMp27NEKQhTdXby0W8VzZuiQ9EAPiGqLllszGCfeKUO0uB6ot5z6ekjVF4PSzkNOLc2rQOCPrJla1iI95s4EVDhUOMtCLyxoSnE"/>
</div>
<div className="flex-1 flex flex-col">
<div className="flex justify-between items-start mb-2">
<div className="bg-emerald-100 dark:bg-emerald-900/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                                        Track Live
                                    </div>
<p className="font-black text-lg text-primary">$120.00</p>
</div>
<h4 className="text-xl font-bold text-on-surface leading-tight group-hover:text-indigo-600 transition-colors">Premium Deep Cleaning</h4>
<p className="text-on-surface-variant text-sm mb-4">Assigned to: <span className="text-on-surface font-semibold">Sarah Jenkins</span></p>
<div className="mt-auto flex items-center gap-4 text-xs text-on-surface-variant">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-sm" data-icon="event">event</span>
                                        Oct 24, 2024
                                    </div>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
                                        10:00 AM
                                    </div>
</div>
</div>
</Link>
{/* Active Booking Card 2 */}
<div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row gap-6 relative transition-all duration-300">
<div className="w-full md:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover" data-alt="Electrician fixing a panel circuit board" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNDNR6guWedqfvzaAoMgaXhXDPoWBN9Y1eIOgOROnDi3vZ_krAX_U-VYGpoQAgpKIiQ_HIE5tGHkL3n1BuohnGthFuKk3oc9z6iloXUfjMqVf59hXbMqv8WJpsNw7cm8PJ3wm139K7ytFbEJIqyh13BgAvDCbT7AeHCg_xGg6KewBKazvU8ud0gSepIIQAMgNSyWlk1way-8QIh28GXQw7VOkZcCGJqI1O0uQTMzUHuVzAD6CiIcJRI-PCpybBeo8ayEX3lSv0iwk"/>
</div>
<div className="flex-1 flex flex-col">
<div className="flex justify-between items-start mb-2">
<div className="bg-secondary-container/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-on-secondary-container uppercase tracking-widest">
                                        Arriving Soon
                                    </div>
<p className="font-black text-lg text-primary">$85.00</p>
</div>
<h4 className="text-xl font-bold text-on-surface leading-tight">Electrical Safety Audit</h4>
<p className="text-on-surface-variant text-sm mb-4">Assigned to: <span className="text-on-surface font-semibold">Marcello Rossi</span></p>
<div className="mt-auto flex items-center gap-4 text-xs text-on-surface-variant">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-sm" data-icon="event">event</span>
                                        Oct 25, 2024
                                    </div>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
                                        02:30 PM
                                    </div>
</div>
</div>
</div>
</div>
</section>
{/* Section: Completed */}
<section>
<div className="flex items-center gap-3 mb-6">
<span className="w-2 h-2 rounded-full bg-outline-variant"></span>
<h3 className="text-xl font-bold tracking-tight">Previous Services</h3>
</div>
<div className="grid grid-cols-1 gap-4">
{/* Horizontal Completed Row 1 */}
<div className="bg-surface-container-low hover:bg-surface-container-high transition-colors p-4 rounded-xl flex items-center gap-6">
<div className="w-16 h-16 rounded-lg bg-surface-container-highest flex-shrink-0 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Plumbing repair tools on white tile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn23_7AcWOpBHUsI36oqmmqRaN0Z8hondxetZQrBLHoGU9xvYnn4E62ONBQLTmCIIJ2BKpIVMPEgdjWbLCt6Db8ZvwHQAw3uuU89tSLHIF1ce8xN1D4Pcz4qBTvuXWD5cHQGIaR3_NtzYT_obMbq2Mp4VKT3tA5a_LLJqpgnNcM_Vcw2FVSkS1xre1Nbv4iRuIZwMl5hBQvzYBJ9LI8thB-zKf3llG0EwalciIUWWna-u6zEqd7fzrhctpzG3xf3PZV6dM9vvG3EY"/>
</div>
<div className="flex-1">
<h5 className="font-bold text-on-surface">Emergency Pipe Leak Repair</h5>
<p className="text-xs text-on-surface-variant">David Miller • Sep 12, 2024</p>
</div>
<div className="hidden md:block px-3 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                Completed
                            </div>
<div className="text-right">
<p className="font-bold text-on-surface">$145.00</p>
<Link to="/review" className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">Write Review</Link>
</div>
</div>
{/* Horizontal Completed Row 2 */}
<div className="bg-surface-container-low hover:bg-surface-container-high transition-colors p-4 rounded-xl flex items-center gap-6">
<div className="w-16 h-16 rounded-lg bg-surface-container-highest flex-shrink-0 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="AC unit maintenance and repair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiJu5yLhZZ15saL-PEBFyXU5bV_eDwWkYfpIfHCHgruXQ8UuvIPykewoqNSZvTAcuoJGPQGOSdP9FLg2EePCQLEjuZmo-6MpiMRdeEKSPuor-LGrHjKlZt2yYvCKACRbQbaGvrHhnNs2Wl83llw88pggKYyPuv2tF7e2e-hmnysc4XtOjphPwpzJXFNVq1OYV4nBgXAZx8Nofs4a75O_GAFPn4VCIqL9OHKzmSYVFG24_Cxl4JGJz2UT4oJmkYAhgWXTOLLYS0c_s"/>
</div>
<div className="flex-1">
<h5 className="font-bold text-on-surface">AC Annual Maintenance</h5>
<p className="text-xs text-on-surface-variant">CoolAir Systems • Aug 28, 2024</p>
</div>
<div className="hidden md:block px-3 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                Completed
                            </div>
<div className="text-right">
<p className="font-bold text-on-surface">$210.00</p>
<Link to="/review" className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">Write Review</Link>
</div>
</div>
{/* Horizontal Completed Row 3 */}
<div className="bg-surface-container-low hover:bg-surface-container-high transition-colors p-4 rounded-xl flex items-center gap-6">
<div className="w-16 h-16 rounded-lg bg-surface-container-highest flex-shrink-0 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Handyman assembling furniture with drill" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgry2GsiC_8nbgsbnw1Br5dv5902trSn8UnvYLG6uhFMCVUcUS7WXjhYB-g-ooYybqJ4FZH5miHM2uvY8UjJnG1hRi-HkkHrG4nNmO7erm-fUY7R2UWqw6h5WWO7IewxuMzrL8fxfjC2MGnodLlJYG1M5FeTCfTy5i_mdD3Y80JJorAb6aW3PpMHfWgVa5mSSBS2sISL5Uw_wzPqrxmqRtG8lj9aAWcNVQzZe2O2IdW5eDCxLCIrv7N8PfoYyHpUiHiVbllRV0wGI"/>
</div>
<div className="flex-1">
<h5 className="font-bold text-on-surface">Custom Shelving Installation</h5>
<p className="text-xs text-on-surface-variant">Fix-It Brothers • Aug 14, 2024</p>
</div>
<div className="hidden md:block px-3 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                Completed
                            </div>
<div className="text-right">
<p className="font-bold text-on-surface">$350.00</p>
<Link to="/review" className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">Write Review</Link>
</div>
</div>
</div>
</section>
</div>
</main>
</div>
{/* Footer Cluster */}
<footer className="w-full pt-20 pb-10 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
<div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 font-['Inter']">
<div className="col-span-2">
<div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Service Square</div>
<p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">Curating the finest local service providers into a premium editorial gallery for the modern home.</p>
<div className="flex gap-4">
<span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" data-icon="share">share</span>
<span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" data-icon="thumb_up">thumb_up</span>
<span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" data-icon="alternate_email">alternate_email</span>
</div>
</div>
<div>
<h6 className="font-bold text-on-surface mb-4">Company</h6>
<ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
<li className="hover:text-indigo-500 transition-colors cursor-pointer">About Us</li>
<li className="hover:text-indigo-500 transition-colors cursor-pointer">Careers</li>
<li className="hover:text-indigo-500 transition-colors cursor-pointer">Press</li>
</ul>
</div>
<div>
<h6 className="font-bold text-on-surface mb-4">Resources</h6>
<ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
<li className="hover:text-indigo-500 transition-colors cursor-pointer">Help Center</li>
<li className="hover:text-indigo-500 transition-colors cursor-pointer">Safety</li>
<li className="hover:text-indigo-500 transition-colors cursor-pointer">Community</li>
</ul>
</div>
<div>
<h6 className="font-bold text-on-surface mb-4">Legal</h6>
<ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
<li className="hover:text-indigo-500 transition-colors cursor-pointer">Privacy Policy</li>
<li className="hover:text-indigo-500 transition-colors cursor-pointer">Terms of Service</li>
</ul>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-xs text-slate-500 dark:text-slate-400">© 2024 Service Square. Premium Editorial Marketplace.</p>
<div className="flex gap-6">
<a className="text-xs text-slate-500 hover:text-indigo-500" href="#">Instagram</a>
<a className="text-xs text-slate-500 hover:text-indigo-500" href="#">Twitter</a>
<a className="text-xs text-slate-500 hover:text-indigo-500" href="#">LinkedIn</a>
</div>
</div>
</footer>
{/* Mobile Navigation Shell */}
<nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t-0 py-4 px-8 flex justify-between items-center z-50">
<a className="flex flex-col items-center gap-1 text-slate-400" href="#">
<span className="material-symbols-outlined" data-icon="home">home</span>
<span className="text-[10px] font-medium">Home</span>
</a>
<a className="flex flex-col items-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined" data-icon="calendar_month" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
<span className="text-[10px] font-bold">Bookings</span>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400" href="#">
<span className="material-symbols-outlined" data-icon="explore">explore</span>
<span className="text-[10px] font-medium">Explore</span>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400" href="#">
<span className="material-symbols-outlined" data-icon="person_outline">person_outline</span>
<span className="text-[10px] font-medium">Profile</span>
</a>
</nav>

    </>
  );
}
