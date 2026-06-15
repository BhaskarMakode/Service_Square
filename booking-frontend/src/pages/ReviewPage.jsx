import React from 'react';
import { Link } from 'react-router-dom';

export default function ReviewPage() {
  return (
    <>
      
{/* Top Navigation Bar */}
<nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none">
<div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
<Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400 font-headline">Service Square</Link>
<div className="hidden md:flex gap-8 items-center">
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/">Home</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/service-listing">Services</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/provider">Become a Provider</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/about">About</Link>
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/contact">Contact</Link>
</div>
<div className="flex items-center gap-4">
<Link to="/signup" className="px-5 py-2.5 bg-primary-container text-on-primary-container rounded-xl font-semibold active:scale-95 transition-transform duration-200">Sign Up</Link>
</div>
</div>
</nav>
<main className="min-h-screen pt-12 pb-24 px-6">
<div className="max-w-3xl mx-auto">
{/* Header Section with Asymmetric Layout */}
<header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
<div className="max-w-lg">
<span className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-4">Post-Service Feedback</span>
<h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6">How was your service today?</h1>
<p className="text-on-surface-variant text-lg leading-relaxed">Your feedback helps our artists improve and helps other community members find the best professionals.</p>
</div>
</header>
<div className="grid grid-cols-1 gap-8">
{/* Feedback Canvas (Main Card) */}
<section className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(53,37,205,0.06)] relative overflow-hidden">
{/* Provider Snippet - Editorial Style */}
<div className="flex items-center gap-6 mb-12 p-4 bg-surface-container-low rounded-2xl">
<div className="relative">
<img alt="Provider Portrait" className="w-20 h-20 rounded-2xl object-cover" data-alt="Close up portrait of a professional service provider" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY-SUkudPMPW4L1BNxIek3dr8Q9UwQwk3EEUygv94nmJA_9Snw-lcYG6dQXJ-2P6SpPdnERN-yvJjTP_dopmBaJ0eLBtlyd0u8rNGxv7CjB4P33Ngai7ummWzELMOOmwejEEZHngSkXyy55bv7RRBTOuAwV13KK73PmsZldp-U5CZcVN38TO-TWlRcSRID5SZ42lbK9EnwUl83AW6bTD8nfbXN1IzsWZVUbjvnzfr6p6feOZrQRAIiypY1k69Q1a-vO4uzD792TZo"/>
<div className="absolute -top-2 -right-2 bg-white/40 backdrop-blur-md p-1.5 rounded-lg border border-white/20 shadow-sm">
<div className="bg-secondary-container p-1 rounded-md">
<span className="material-symbols-outlined text-xs text-on-secondary-container block" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
</div>
</div>
</div>
<div>
<h3 className="text-xl font-bold tracking-tight">Elena Rodriguez</h3>
<p className="text-on-surface-variant font-medium">Professional Interior Stylist</p>
<div className="flex items-center gap-2 mt-1">
<span className="text-xs bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-bold">PREMIUM</span>
<span className="text-xs text-on-surface-variant/60">Service ID: #4492-SX</span>
</div>
</div>
</div>
{/* Star Rating System */}
<div className="mb-12 text-center md:text-left">
<label className="block text-sm font-bold tracking-widest uppercase text-on-surface-variant mb-6">Your Rating</label>
<div className="flex items-center justify-center md:justify-start gap-3">
<button className="group p-2 focus:outline-none">
<span className="material-symbols-outlined text-5xl text-primary star-active" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</button>
<button className="group p-2 focus:outline-none">
<span className="material-symbols-outlined text-5xl text-primary star-active" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</button>
<button className="group p-2 focus:outline-none">
<span className="material-symbols-outlined text-5xl text-primary star-active" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</button>
<button className="group p-2 focus:outline-none">
<span className="material-symbols-outlined text-5xl text-primary star-active" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</button>
<button className="group p-2 focus:outline-none">
<span className="material-symbols-outlined text-5xl text-outline-variant hover:text-primary transition-colors" data-icon="star">star</span>
</button>
</div>
<p className="mt-4 text-primary font-semibold tracking-tight">4.0 - Very Good</p>
</div>
{/* Feedback Text Area */}
<div className="space-y-4 mb-12">
<label className="block text-sm font-bold tracking-widest uppercase text-on-surface-variant" htmlFor="feedback">Share your experience</label>
<div className="relative">
<textarea className="w-full bg-surface-container-high border-none rounded-2xl p-6 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all duration-300 resize-none" id="feedback" placeholder="What stood out during your appointment? Was the communication clear?" rows="5"></textarea>
<div className="absolute bottom-4 right-6 text-xs text-outline/60 font-medium">0 / 500</div>
</div>
</div>
{/* Actions */}
<div className="flex flex-col sm:flex-row items-center gap-6">
<Link to="/dashboard" className="w-full sm:w-auto px-10 py-4 flex items-center justify-center bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Submit Review
                        </Link>
<Link to="/dashboard" className="text-on-surface-variant font-bold hover:text-on-surface transition-colors px-6 py-4 flex items-center justify-center">
                            Skip for now
                        </Link>
</div>
{/* Artistic Element (Organic Square Pattern) */}
<div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary-container/10 rounded-[48px] -rotate-12 pointer-events-none"></div>
<div className="absolute -top-12 -left-12 w-32 h-32 bg-primary-fixed/20 rounded-[32px] rotate-45 pointer-events-none"></div>
</section>
{/* Helpful Tips (Editorial Sidebar) */}
<aside className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="bg-surface-container-low p-6 rounded-3xl">
<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
<span className="material-symbols-outlined text-indigo-600" data-icon="photo_camera">photo_camera</span>
</div>
<h4 className="font-bold mb-2">Add Photos</h4>
<p className="text-sm text-on-surface-variant leading-relaxed">Reviews with photos are 3x more helpful to other customers.</p>
</div>
<div className="bg-surface-container-low p-6 rounded-3xl">
<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
<span className="material-symbols-outlined text-indigo-600" data-icon="tips_and_updates" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
</div>
<h4 className="font-bold mb-2">Be Specific</h4>
<p className="text-sm text-on-surface-variant leading-relaxed">Mentioning specific details helps Elena grow her professional practice.</p>
</div>
</aside>
</div>
</div>
</main>
{/* Footer */}
<footer className="w-full pt-20 pb-10 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
<div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
<div className="col-span-2">
<div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Service Square</div>
<p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">Curating the world's finest service providers into an editorial marketplace of excellence.</p>
</div>
<div>
<h5 className="font-bold mb-4">Marketplace</h5>
<ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
<li><a className="hover:text-indigo-500 transition-colors" href="#">Services</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Categories</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Top Rated</a></li>
</ul>
</div>
<div>
<h5 className="font-bold mb-4">Company</h5>
<ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
<li><a className="hover:text-indigo-500 transition-colors" href="#">About Us</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Help Center</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Legal</a></li>
</ul>
</div>
<div>
<h5 className="font-bold mb-4">Support</h5>
<ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
<li><a className="hover:text-indigo-500 transition-colors" href="#">Privacy Policy</a></li>
<li><a className="hover:text-indigo-500 transition-colors" href="#">Terms of Service</a></li>
</ul>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-sm text-slate-500 dark:text-slate-400">© 2024 Service Square. Premium Editorial Marketplace.</p>
<div className="flex gap-6">
<span className="material-symbols-outlined text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" data-icon="public">public</span>
<span className="material-symbols-outlined text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" data-icon="share">share</span>
</div>
</div>
</footer>

    </>
  );
}
