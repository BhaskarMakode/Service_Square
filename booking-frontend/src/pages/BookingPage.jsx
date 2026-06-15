import React from 'react';
import { Link } from 'react-router-dom';

export default function BookingPage() {
    return (
        <div className="antialiased text-on-background bg-background font-body min-h-screen">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none h-20 border-b border-surface-container-high/50">
                <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
                    <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400">
                        Service Square
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/">Home</Link>
                        <a className="text-indigo-700 dark:text-indigo-300 font-bold border-b-2 border-indigo-500 pb-1" href="#">Services</a>
                        <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/provider-onboarding-1">Become a Provider</Link>
                        <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" href="#">About</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-5 py-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg active:scale-95 transition-all">Login</Link>
                        <Link to="/signup" className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-primary/20">Sign Up</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Side: Focused Booking Form */}
                    <div className="lg:col-span-8 space-y-10">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-on-background">Confirm Your Appointment</h1>
                            <p className="text-on-surface-variant text-lg max-w-2xl">Complete the details below to secure your professional service. Our providers are vetted and ready to assist.</p>
                        </div>
                        
                        <form className="space-y-8">
                            {/* Section: Service Selection */}
                            <section className="bg-surface-container-low p-8 rounded-3xl space-y-6 border border-surface-container">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight text-on-surface">Service Details</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="block group">
                                        <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Select Service Category</span>
                                        <div className="relative">
                                            <select className="w-full h-14 px-5 bg-surface-container-high dark:bg-slate-800 text-on-surface border-none rounded-xl appearance-none focus:ring-2 focus:ring-primary-fixed transition-all">
                                                <option>Home Cleaning</option>
                                                <option>Electrical Repair</option>
                                                <option>Plumbing Service</option>
                                                <option>HVAC Maintenance</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-4 pointer-events-none text-on-surface-variant">expand_more</span>
                                        </div>
                                    </label>
                                    <label className="block group">
                                        <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Provider Specialty</span>
                                        <div className="relative">
                                            <select className="w-full h-14 px-5 bg-surface-container-high dark:bg-slate-800 text-on-surface border-none rounded-xl appearance-none focus:ring-2 focus:ring-primary-fixed transition-all">
                                                <option>Deep Clean Specialist</option>
                                                <option>General Tidy Up</option>
                                                <option>Post-Construction</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-4 pointer-events-none text-on-surface-variant">expand_more</span>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Section: Date & Time Picker */}
                            <section className="bg-surface-container-low p-8 rounded-3xl space-y-6 border border-surface-container">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight text-on-surface">Schedule</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <span className="block text-sm font-semibold ml-1 text-on-surface-variant">Preferred Date</span>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button className="p-4 rounded-2xl bg-surface-container-lowest border-2 border-primary-container text-center shadow-sm transition-transform active:scale-95" type="button">
                                                <span className="block text-xs uppercase font-bold text-primary">Oct</span>
                                                <span className="block text-xl font-black text-on-surface">24</span>
                                            </button>
                                            <button className="p-4 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest transition-all text-center active:scale-95" type="button">
                                                <span className="block text-xs uppercase font-bold text-on-surface-variant">Oct</span>
                                                <span className="block text-xl font-black text-on-surface">25</span>
                                            </button>
                                            <button className="p-4 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest transition-all text-center active:scale-95" type="button">
                                                <span className="block text-xs uppercase font-bold text-on-surface-variant">Oct</span>
                                                <span className="block text-xl font-black text-on-surface">26</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <span className="block text-sm font-semibold ml-1 text-on-surface-variant">Available Times</span>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-center transition-all active:scale-95" type="button">09:00 AM</button>
                                            <button className="py-3 px-4 rounded-xl bg-primary text-white font-semibold text-center transition-all active:scale-95 shadow-md" type="button">11:30 AM</button>
                                            <button className="py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-center transition-all active:scale-95" type="button">02:00 PM</button>
                                            <button className="py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-center transition-all active:scale-95" type="button">04:30 PM</button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Location */}
                            <section className="bg-surface-container-low p-8 rounded-3xl space-y-6 border border-surface-container">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight text-on-surface">Service Location</h2>
                                </div>
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Street Address</span>
                                        <input className="w-full h-14 px-5 bg-surface-container-high dark:bg-slate-800 text-on-surface border-none rounded-xl focus:ring-2 focus:ring-primary-fixed placeholder:text-outline-variant transition-all" placeholder="123 Editorial Lane, Design District" type="text" />
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="block">
                                            <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Unit / Apt</span>
                                            <input className="w-full h-14 px-5 bg-surface-container-high dark:bg-slate-800 text-on-surface border-none rounded-xl focus:ring-2 focus:ring-primary-fixed transition-all" placeholder="Ste 402" type="text" />
                                        </label>
                                        <label className="block">
                                            <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Zip Code</span>
                                            <input className="w-full h-14 px-5 bg-surface-container-high dark:bg-slate-800 text-on-surface border-none rounded-xl focus:ring-2 focus:ring-primary-fixed transition-all" placeholder="90210" type="text" />
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Notes */}
                            <section className="bg-surface-container-low p-8 rounded-3xl space-y-6 border border-surface-container">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight text-on-surface">Additional Notes</h2>
                                </div>
                                <label className="block">
                                    <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Special Instructions</span>
                                    <textarea className="w-full p-5 bg-surface-container-high dark:bg-slate-800 text-on-surface border-none rounded-2xl focus:ring-2 focus:ring-primary-fixed placeholder:text-outline-variant transition-all resize-none" placeholder="Any specific requirements or access details for the provider..." rows="4"></textarea>
                                </label>
                            </section>
                        </form>
                    </div>

                    {/* Right Side: Sticky Summary Sidebar */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-32 pb-10">
                        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl shadow-slate-200 dark:shadow-none border border-surface-container">
                            <h3 className="text-2xl font-black tracking-tight mb-6 text-on-surface">Order Summary</h3>
                            
                            {/* Selected Provider Mini-Card */}
                            <div className="flex items-center gap-4 mb-8 p-3 bg-surface-container-low rounded-2xl border border-surface-container">
                                <img className="w-16 h-16 rounded-xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAITkfDl93KYkBcRZUuuwWUuHneIt4_kfkqiEUQqkprRYhtDCXr2Ucinorwe3vHQjQ__piro_QhUl8bq6zJ2Mh_W8AA-QdVzn2pdYg55-4YjQt12Uxdg8_E2q_uwaVXS5EN7BP3771GpVCXXmwLKAE91vJMrl8pwiehBF-UwhSf-pbxHvgcOuwd7PsOhID95ahyCrdrd4kYjCs2kmX5bWZHxOgpS_u64gahbo5Y2Xu67fIXOaqqpEeab3I9edrZ49X6Kp7DUw--7_M" alt="Elena Rodriguez" />
                                <div>
                                    <p className="font-bold text-on-surface">Elena Rodriguez</p>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="text-sm font-bold text-on-surface-variant">4.9 (128 reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-on-surface-variant font-medium">
                                    <span>Base Service Fee</span>
                                    <span className="text-on-surface">$85.00</span>
                                </div>
                                <div className="flex justify-between items-center text-on-surface-variant font-medium">
                                    <span>Equipment &amp; Supplies</span>
                                    <span className="text-on-surface">$15.00</span>
                                </div>
                                <div className="flex justify-between items-center text-on-surface-variant font-medium">
                                    <span>Processing Tax (8%)</span>
                                    <span className="text-on-surface">$8.00</span>
                                </div>
                                <div className="h-px bg-surface-container-high my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-black text-on-surface">Total Due</span>
                                    <span className="text-2xl font-black text-primary">$108.00</span>
                                </div>
                            </div>

                            <Link 
                                to="/booking-confirmation" 
                                className="block w-full py-5 bg-gradient-to-r from-primary to-primary-container text-white text-center text-lg font-black rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all mb-4"
                            >
                                Confirm Booking
                            </Link>
                            <p className="text-center text-xs text-on-surface-variant font-medium leading-relaxed">
                                By confirming, you agree to our Terms of Service. No charge will be made until service completion.
                            </p>
                        </div>

                        {/* Trust Badge */}
                        <div className="mt-8 flex items-center justify-center gap-3 p-4 bg-surface-container-low rounded-2xl border border-surface-container">
                            <span className="material-symbols-outlined text-secondary">verified_user</span>
                            <span className="text-sm font-bold text-on-surface-variant">Secure 256-bit Encryption</span>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-950 w-full pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    <div className="col-span-2">
                        <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Service Square</div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs">
                            The curated marketplace for premium professional services. From artisanal home care to expert technical support.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">About Us</a></li>
                            <li><a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Help Center</a></li>
                            <li><a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Services</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Legal</a></li>
                            <li><a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 Service Square. Premium Editorial Marketplace.</p>
                    <div className="flex gap-6">
                        <span className="material-symbols-outlined text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors">brand_awareness</span>
                        <span className="material-symbols-outlined text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors">public</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
