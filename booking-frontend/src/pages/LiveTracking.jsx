import React from 'react';
import { Link } from 'react-router-dom';

export default function LiveTracking() {
  return (
    <>
      
{/* TopNavBar */}
<nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none">
<div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
<div className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400 font-headline">Service Square</div>
<div className="hidden md:flex items-center gap-8 font-['Inter'] antialiased tracking-tight">
<Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/">Home</Link>
<a className="text-indigo-700 dark:text-indigo-300 font-bold border-b-2 border-indigo-500 pb-1" href="#">Services</a>
<a className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" href="#">Become a Provider</a>
<a className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" href="#">About</a>
<a className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" href="#">Contact</a>
</div>
<div className="flex items-center gap-4">
<button className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all active:scale-95">Login</button>
<button className="px-5 py-2 text-sm font-semibold bg-primary text-on-primary rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95">Sign Up</button>
</div>
</div>
</nav>
<main className="relative h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col md:flex-row">
{/* Live Map Background */}
<div className="absolute inset-0 z-0 bg-surface-container">
<div className="w-full h-full grayscale opacity-40 mix-blend-multiply" data-alt="Detailed monochromatic city map layout" data-location="San Francisco" >
</div>
{/* Simulated Map Markers */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
<div className="relative">
{/* Provider Marker */}
<div className="absolute -top-12 -left-12 flex flex-col items-center">
<div className="bg-primary text-on-primary p-3 rounded-2xl shadow-2xl animate-bounce">
<span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>electric_bolt</span>
</div>
<div className="mt-2 px-3 py-1 bg-white shadow-md rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">On the way</div>
</div>
{/* Destination Marker */}
<div className="absolute top-20 left-40">
<div className="w-6 h-6 bg-secondary rounded-full border-4 border-white shadow-xl"></div>
<div className="mt-2 px-3 py-1 bg-white shadow-md rounded-full text-[10px] font-bold uppercase tracking-wider text-secondary">Your Location</div>
</div>
{/* Path Simulation */}
<svg className="absolute top-0 left-0 w-[400px] h-[300px] pointer-events-none opacity-40" viewbox="0 0 400 300">
<path d="M 0 0 Q 150 50 200 200" fill="none" stroke="#3525cd" stroke-dasharray="8 8" strokeWidth="4"></path>
</svg>
</div>
</div>
</div>
{/* Tracking Content Shell */}
<div className="relative z-20 flex flex-col justify-end md:justify-start w-full md:w-[450px] p-4 md:p-8 h-full pointer-events-none">
{/* Live Status Progress Card */}
<div className="pointer-events-auto w-full glass-panel rounded-3xl p-6 shadow-2xl mb-6 ring-1 ring-white/20">
<div className="flex items-center justify-between mb-8">
<h2 className="text-xl font-black tracking-tight text-on-surface">Tracking Arrival</h2>
<span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full">LIVE</span>
</div>
{/* Progress Stepper */}
<div className="relative flex items-center justify-between mb-4">
<div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-high -translate-y-1/2"></div>
<div className="absolute top-1/2 left-0 w-2/3 h-1 bg-primary -translate-y-1/2"></div>
<div className="relative z-10 flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg ring-4 ring-white">
<span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
<span className="text-[10px] font-bold text-primary uppercase">Accepted</span>
</div>
<div className="relative z-10 flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg ring-4 ring-white">
<span className="material-symbols-outlined text-xl">directions_run</span>
</div>
<span className="text-[10px] font-bold text-primary uppercase">En Route</span>
</div>
<div className="relative z-10 flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-outline shadow-md ring-4 ring-white">
<span className="material-symbols-outlined text-xl">home_pin</span>
</div>
<span className="text-[10px] font-bold text-on-surface-variant uppercase">Arrived</span>
</div>
</div>
<div className="mt-8 flex items-center gap-4 bg-surface-container-low p-4 rounded-2xl">
<div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-3xl">schedule</span>
</div>
<div>
<p className="text-sm font-medium text-on-surface-variant">Estimated Arrival</p>
<p className="text-2xl font-black text-primary">12-15 mins</p>
</div>
</div>
</div>
{/* Provider Detail Card */}
<div className="pointer-events-auto w-full bg-surface-container-lowest rounded-3xl p-6 shadow-xl border border-outline-variant/10">
<div className="flex items-start gap-4 mb-6">
<div className="relative">
<img alt="Provider Profile" className="w-16 h-16 rounded-2xl object-cover shadow-md" data-alt="Portrait of a friendly male technician" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ2Z0QI3966vcL6QGkwt1pWV9vcVr7wj-ZqwbnfqaDvF1UeEQpksEAF25SqiBEAoxwSVuFLmJ0Vh2BGIkFjhVI9QyVM6BfoPejlt6RgdAKwxvUjZ1TPbOwDjAzJuvSShmSePWIzJzC9q2Pn22c6fqUxdmYpV2u_3Q3sxWNn9Aex8AxuDVn1duRumpYazxx0fzsXKARyGFhZIoze7swQXQhtDGOup7zI7lh6xnJR5i2VyH6RLB9PoQvvBVXtKfZMRq1GgjtML-VR3U"/>
<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-lg flex items-center justify-center border-2 border-white">
<span className="material-symbols-outlined text-[14px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
</div>
<div className="flex-1">
<h3 className="text-lg font-bold text-on-surface">Marcus Sterling</h3>
<p className="text-sm text-on-surface-variant">Master Electrician • 4.9 Rating</p>
<div className="mt-2 flex gap-2">
<span className="px-2 py-0.5 bg-primary-fixed text-primary text-[10px] font-bold rounded">TOP RATED</span>
<span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold rounded">BACKGROUND CHECKED</span>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-3 mb-6">
<button className="flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-2xl font-bold shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95">
<span className="material-symbols-outlined text-xl">call</span>
                        Call
                    </button>
<Link to="/chat" className="flex items-center justify-center gap-2 py-3 bg-surface-container-high text-on-surface-variant rounded-2xl font-bold hover:bg-surface-container-highest transition-all active:scale-95">
<span className="material-symbols-outlined text-xl">chat_bubble</span>
                        Message
                    </Link>
</div>
<div className="pt-6 border-t border-outline-variant/15">
<div className="flex items-center justify-between mb-2">
<span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Service Details</span>
<span className="text-xs font-bold text-primary">#SQ-94203</span>
</div>
<p className="text-sm font-semibold text-on-surface">Electrical Panel Diagnosis &amp; Repair</p>
<p className="text-xs text-on-surface-variant mt-1 italic">"Requesting immediate check for circuit breaker trips."</p>
</div>
</div>
</div>
{/* Float Control (Right Side Desktop) */}
<div className="hidden md:flex flex-col gap-4 absolute top-8 right-8 z-30">
<button className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors pointer-events-auto">
<span className="material-symbols-outlined">my_location</span>
</button>
<button className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors pointer-events-auto">
<span className="material-symbols-outlined">layers</span>
</button>
<button className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors pointer-events-auto">
<span className="material-symbols-outlined">zoom_in</span>
</button>
<button className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors pointer-events-auto">
<span className="material-symbols-outlined">zoom_out</span>
</button>
</div>
</main>
{/* Footer */}
<footer className="w-full pt-20 pb-10 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
<div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
<div className="col-span-2 lg:col-span-1">
<div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 font-headline">Service Square</div>
<p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">Premium Editorial Marketplace connecting you with local service artists.</p>
<div className="flex gap-4">
<span className="material-symbols-outlined text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">public</span>
<span className="material-symbols-outlined text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">alternate_email</span>
<span className="material-symbols-outlined text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">rss_feed</span>
</div>
</div>
<div className="flex flex-col gap-4">
<h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-widest">Platform</h4>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">About Us</a>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Help Center</a>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Careers</a>
</div>
<div className="flex flex-col gap-4">
<h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-widest">Services</h4>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Plumbing</a>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Electrical</a>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Cleaning</a>
</div>
<div className="flex flex-col gap-4">
<h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-widest">Legal</h4>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Privacy Policy</a>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Terms of Service</a>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Cookie Policy</a>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
<p className="text-sm text-slate-500 dark:text-slate-400">© 2024 Service Square. Premium Editorial Marketplace.</p>
<div className="flex gap-6">
<span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">EST. 2024</span>
</div>
</div>
</footer>

    </>
  );
}
