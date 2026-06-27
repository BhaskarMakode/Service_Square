import React from 'react';
import { Link } from 'react-router-dom';

export default function AddNewService() {
  return (
    <>
      
{/* Top Navigation Anchor (Shared Component Logic) */}
<header className="fixed top-0 w-full z-50 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none">
<div className="flex justify-between items-center px-6 h-16 w-full max-w-[1440px] mx-auto">
<div className="flex items-center gap-8">
<span className="text-xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400">Service Square</span>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
</button>
<button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden">
<img alt="Provider Profile Avatar" className="h-full w-full object-cover" data-alt="Close up of professional service provider portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzXxZU70m_Xk96z31nC9AFvJRrB9lw66bqGSgcGdge3YqayNvHgvt_4b-eQ-tJOj7PtQ_TShDR1sIfzq5rKXozuv7HShYwXO2KMPHQZz4wOmI8oHxc5_LqmoI3suW3amlVeC-uEHpU-4MZD0wybcJIWV6JRXK2fUKuNiJ9SOgSSnYvPOo5rPEeIOg9D8ezfMFBzlv3-0MxjAnYUWoCSNaGsol1dXWjELCGCgwECFiShrkAjekixM7UKlT7IWdX8tnSEsZywLhNjj8"/>
</div>
</div>
</div>
</header>
{/* Sidebar Navigation (Shared Component Logic) */}
<nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-col gap-2 p-4 pt-20">
<div className="mb-6 px-4">
<h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/50">Main Menu</h2>
</div>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-transform hover:translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-transform hover:translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span className="text-sm font-medium">Bookings</span>
</a>
{/* Active Tab: My Services */}
<a className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-xl shadow-sm transition-transform hover:translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined" data-icon="build" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
<span className="text-sm font-semibold">My Services</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-transform hover:translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined" data-icon="event_available">event_available</span>
<span className="text-sm font-medium">Availability</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-transform hover:translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined" data-icon="payments">payments</span>
<span className="text-sm font-medium">Earnings</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-transform hover:translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="text-sm font-medium">Settings</span>
</a>
<div className="mt-auto p-4 bg-primary-fixed/30 rounded-2xl">
<p className="text-xs text-on-primary-fixed-variant font-semibold mb-2">Need assistance?</p>
<button className="w-full py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                Support Center
            </button>
</div>
</nav>
{/* Main Content Canvas */}
<main className="md:ml-64 pt-24 pb-12 px-6 md:px-12 max-w-5xl mx-auto">
<div className="mb-10">
<nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
<span>My Services</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span className="text-primary font-medium">Add New Service</span>
</nav>
<h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Service Details</h1>
<p className="text-on-surface-variant body-lg">Define your offering to help customers understand your value and expertise.</p>
</div>
{/* Form Layout: Asymmetric Editorial Approach */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
{/* Left Side: Form Fields */}
<div className="lg:col-span-7 space-y-8">
{/* Section 1: Basic Info */}
<section className="bg-surface-container-low p-8 rounded-3xl space-y-6">
<div className="space-y-2">
<label className="text-sm font-bold tracking-wide uppercase text-on-surface-variant" htmlFor="service-title">Service Title</label>
<input className="w-full h-14 px-5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all duration-200 outline-none text-on-surface placeholder:text-outline" id="service-title" placeholder="e.g., Premium Interior Deep Cleaning" type="text"/>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-sm font-bold tracking-wide uppercase text-on-surface-variant" htmlFor="category">Category</label>
<div className="relative">
<select className="w-full h-14 px-5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest appearance-none transition-all duration-200 outline-none text-on-surface" id="category">
<option>Select a Category</option>
<option>Home Maintenance</option>
<option>Professional Cleaning</option>
<option>IT &amp; Technical Support</option>
<option>Personal Care</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-4 text-outline pointer-events-none">expand_more</span>
</div>
</div>
<div className="space-y-2">
<label className="text-sm font-bold tracking-wide uppercase text-on-surface-variant" htmlFor="est-time">Estimated Time</label>
<div className="relative">
<select className="w-full h-14 px-5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest appearance-none transition-all duration-200 outline-none text-on-surface" id="est-time">
<option>Under 1 Hour</option>
<option>1-2 Hours</option>
<option>2-4 Hours</option>
<option>Full Day</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-4 text-outline pointer-events-none">schedule</span>
</div>
</div>
</div>
</section>
{/* Section 2: Pricing & Description */}
<section className="bg-surface-container-low p-8 rounded-3xl space-y-6">
<div className="space-y-2">
<label className="text-sm font-bold tracking-wide uppercase text-on-surface-variant" htmlFor="description">Service Description</label>
<textarea className="w-full p-5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all duration-200 outline-none text-on-surface placeholder:text-outline resize-none" id="description" placeholder="Detail what is included in this service, your methodology, and any requirements..." rows="5"></textarea>
</div>
<div className="space-y-2">
<label className="text-sm font-bold tracking-wide uppercase text-on-surface-variant" htmlFor="price">Starting Price</label>
<div className="relative">
<span className="absolute left-5 top-4 font-bold text-primary">₹</span>
<input className="w-full h-14 pl-10 pr-5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all duration-200 outline-none text-on-surface placeholder:text-outline" id="price" placeholder="0.00" type="number"/>
</div>
</div>
</section>
{/* Action Buttons */}
<div className="flex items-center gap-4 pt-4">
<button className="flex-1 h-14 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/10 hover:opacity-95 active:scale-[0.98] transition-all">
                        Save Service
                    </button>
<button className="flex-1 h-14 bg-transparent border-2 border-outline-variant/30 text-on-surface-variant font-bold rounded-xl hover:bg-surface-container transition-all active:scale-[0.98]">
                        Cancel
                    </button>
</div>
</div>
{/* Right Side: Image Upload & Preview */}
<div className="lg:col-span-5 sticky top-24">
<div className="relative">
<div className="bg-surface-container-low p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-6">
<div className="w-full aspect-video rounded-2xl bg-surface-container-high flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/50 overflow-hidden relative group cursor-pointer">
<img alt="Service Preview" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700" data-alt="High quality photography of a clean modern home interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdFVLcrAvS2n6MGMB4vh-2iSdJ3VrLc5rIfvLPz2NI91zLso5FkxzQnPEAfHHVl5NNa4KBelqPNJIBppB65beNnGStkOV85qVghfwpEzLHSAf1X71CXuHJpUTALGciXrObF6wVuQV3g5g62v8TxtneVO4TuqPdA-ZauCHeId-phr-Yzfk3_VBYuGG3KTlJfndZg0r7veVr7a0DzMpFGw6lLPK_1bPpXQw0MQQNIpnWolvEZ5pyJytYCI9I9S03w81TGPWj1mErsyY"/>
<div className="z-10 flex flex-col items-center gap-3">
<div className="w-16 h-16 rounded-2xl bg-secondary-container/30 flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined text-3xl" data-icon="add_a_photo">add_a_photo</span>
</div>
<div className="space-y-1">
<p className="font-bold text-on-surface">Upload Cover Image</p>
<p className="text-xs text-on-surface-variant px-12 leading-relaxed">Drag and drop or click to browse. Recommendation: 1600x900px JPG or PNG.</p>
</div>
</div>
</div>
{/* Info Card: Tips */}
<div className="w-full bg-surface-container-lowest p-6 rounded-2xl text-left border border-outline-variant/10 shadow-sm">
<h3 className="flex items-center gap-2 font-bold text-sm text-primary mb-3">
<span className="material-symbols-outlined text-lg" data-icon="lightbulb">lightbulb</span>
                                PRO TIPS
                            </h3>
<ul className="space-y-3">
<li className="flex gap-3 items-start text-xs text-on-surface-variant leading-relaxed">
<span className="material-symbols-outlined text-xs mt-0.5 text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    Use high-resolution photos of your actual work to build trust.
                                </li>
<li className="flex gap-3 items-start text-xs text-on-surface-variant leading-relaxed">
<span className="material-symbols-outlined text-xs mt-0.5 text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    Be specific in the description to reduce repetitive questions.
                                </li>
<li className="flex gap-3 items-start text-xs text-on-surface-variant leading-relaxed">
<span className="material-symbols-outlined text-xs mt-0.5 text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    Set clear time expectations to manage your calendar effectively.
                                </li>
</ul>
</div>
</div>
{/* Floating Badge Aesthetic Overlay */}
<div className="absolute -top-4 -right-4 glass-effect p-4 rounded-2xl border border-white/50 shadow-xl hidden xl:block">
<div className="flex items-center gap-3">
<div className="h-10 w-10 bg-secondary-container rounded-xl flex items-center justify-center">
<span className="material-symbols-outlined text-on-secondary-container" data-icon="verified_user" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
</div>
<div>
<p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Profile Status</p>
<p className="text-xs font-bold text-on-surface">Premium Provider</p>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
{/* Success Feedback (Ghost Layering for UX context) */}
<div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] opacity-0 pointer-events-none transition-all duration-300 transform translate-y-4">
<div className="glass-effect px-6 py-4 rounded-2xl shadow-2xl border border-white/40 flex items-center gap-4">
<div className="bg-secondary-container h-8 w-8 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-on-secondary-container text-sm" data-icon="check">check</span>
</div>
<p className="text-sm font-bold text-on-surface">Service draft saved successfully</p>
</div>
</div>

    </>
  );
}
