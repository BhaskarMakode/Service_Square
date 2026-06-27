import React from 'react';
import { formatCurrency } from '../utils/currency';
import { Link } from 'react-router-dom';

export default function Booking() {
  return (
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
            <section className="bg-surface-container-low p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">Service Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block group">
                  <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Select Service Category</span>
                  <div className="relative">
                    <select className="w-full h-14 px-5 bg-surface-container-high border-none rounded-xl appearance-none focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all">
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
                    <select className="w-full h-14 px-5 bg-surface-container-high border-none rounded-xl appearance-none focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all">
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
            <section className="bg-surface-container-low p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">Schedule</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <span className="block text-sm font-semibold ml-1 text-on-surface-variant">Preferred Date</span>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-4 rounded-2xl bg-surface-container-lowest border-2 border-primary-container text-center shadow-sm" type="button">
                      <span className="block text-xs uppercase font-bold text-primary">Oct</span>
                      <span className="block text-xl font-black">24</span>
                    </button>
                    <button className="p-4 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest transition-colors text-center" type="button">
                      <span className="block text-xs uppercase font-bold text-on-surface-variant">Oct</span>
                      <span className="block text-xl font-black">25</span>
                    </button>
                    <button className="p-4 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest transition-colors text-center" type="button">
                      <span className="block text-xs uppercase font-bold text-on-surface-variant">Oct</span>
                      <span className="block text-xl font-black">26</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <span className="block text-sm font-semibold ml-1 text-on-surface-variant">Available Times</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest font-semibold text-center transition-all" type="button">09:00 AM</button>
                    <button className="py-3 px-4 rounded-xl bg-primary text-white font-semibold text-center transition-all" type="button">11:30 AM</button>
                    <button className="py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest font-semibold text-center transition-all" type="button">02:00 PM</button>
                    <button className="py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest font-semibold text-center transition-all" type="button">04:30 PM</button>
                  </div>
                </div>
              </div>
            </section>
            {/* Section: Location */}
            <section className="bg-surface-container-low p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">Service Location</h2>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Street Address</span>
                  <input className="w-full h-14 px-5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant" placeholder="123 Editorial Lane, Design District" type="text" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Unit / Apt</span>
                    <input className="w-full h-14 px-5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all" placeholder="Ste 402" type="text" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Zip Code</span>
                    <input className="w-full h-14 px-5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all" placeholder="90210" type="text" />
                  </label>
                </div>
              </div>
            </section>
            {/* Section: Notes */}
            <section className="bg-surface-container-low p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">Additional Notes</h2>
              </div>
              <label className="block">
                <span className="block text-sm font-semibold mb-2 ml-1 text-on-surface-variant">Special Instructions</span>
                <textarea className="w-full p-5 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all resize-none placeholder:text-outline-variant" placeholder="Any specific requirements or access details for the provider..." rows="4"></textarea>
              </label>
            </section>
          </form>
        </div>
        {/* Right Side: Sticky Summary Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-32">
          <div className="bg-surface-container-lowest rounded-3xl shadow-2xl shadow-primary/5 p-8 border border-outline-variant/10">
            <h3 className="text-2xl font-black tracking-tight mb-6">Order Summary</h3>
            {/* Selected Provider Mini-Card */}
            <div className="flex items-center gap-4 mb-8 p-3 bg-surface-container-low rounded-2xl">
              <img className="w-16 h-16 rounded-xl object-cover" alt="Professional service provider headshot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAITkfDl93KYkBcRZUuuwWUuHneIt4_kfkqiEUQqkprRYhtDCXr2Ucinorwe3vHQjQ__piro_QhUl8bq6zJ2Mh_W8AA-QdVzn2pdYg55-4YjQt12Uxdg8_E2q_uwaVXS5EN7BP3771GpVCXXmwLKAE91vJMrl8pwiehBF-UwhSf-pbxHvgcOuwd7PsOhID95ahyCrdrd4kYjCs2kmX5bWZHxOgpS_u64gahbo5Y2Xu67fIXOaqqpEeab3I9edrZ49X6Kp7DUw--7_M" />
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
                <span className="text-on-surface">{formatCurrency(85)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant font-medium">
                <span>Equipment & Supplies</span>
                <span className="text-on-surface">{formatCurrency(15)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant font-medium">
                <span>Processing Tax (8%)</span>
                <span className="text-on-surface">{formatCurrency(8)}</span>
              </div>
              <div className="h-px bg-surface-container-high my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-black">Total Due</span>
                <span className="text-2xl font-black text-primary">{formatCurrency(108)}</span>
              </div>
            </div>
            <Link to="/confirmation" className="w-full block text-center py-5 primary-gradient text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all mb-4">
              Confirm Booking
            </Link>
            <p className="text-center text-xs text-on-surface-variant font-medium">
              By confirming, you agree to our Terms of Service. No charge will be made until service completion.
            </p>
          </div>
          {/* Trust Badge */}
          <div className="mt-8 flex items-center justify-center gap-3 p-4 bg-surface-container-low rounded-2xl">
            <span className="material-symbols-outlined text-secondary">verified_user</span>
            <span className="text-sm font-bold text-on-surface-variant">Secure 256-bit Encryption</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
