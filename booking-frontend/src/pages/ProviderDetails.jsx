import React from 'react';
import { Link } from 'react-router-dom';

export default function ProviderDetails() {
  return (
    <>
      
{/* Top Navigation Bar */}
<nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-['Inter'] antialiased tracking-tight">
<div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
<div className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400">Service Square</div>
<div className="hidden md:flex items-center gap-8">
<a className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" href="#">Home</a>
<a className="text-indigo-700 dark:text-indigo-300 font-bold border-b-2 border-indigo-500 pb-1" href="#">Services</a>
<a className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" href="#">Become a Provider</a>
<a className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" href="#">About</a>
<a className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" href="#">Contact</a>
</div>
<div className="flex items-center gap-4">
<button className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors">Login</button>
<button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-95 transition-all duration-200">Sign Up</button>
</div>
</div>
</nav>
<main className="max-w-7xl mx-auto px-6 py-12">
{/* Hero Profile Section */}
<section className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
{/* Asymmetric Image Layout */}
<div className="lg:col-span-7 relative">
<div className="aspect-[16/10] rounded-xl overflow-hidden bg-surface-container-low shadow-xl">
<img alt="Professional Provider" className="w-full h-full object-cover" data-alt="Professional service provider in a modern office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3ccWq9fJfxRkDfr3iZRxlOvk9PCgwx777XsTAemIPth77PxQaOjcBs1yPFXaBuQvnFjUjxW7zGN5mp0LWya05qGiHIuUHkPOfG2QMGDCGDL8G0BqpyEE09vPSiCRPR7Z257CXh4YzCR6E1LKhRZ8BBbh0Ac8lFPZ368xCoe-7srYVGPhBYgA89hNoUGOclx1zF9AVw52lFQD7XRq1Qvzn2qeK-pQRGTimqBuRA7wF6Z4swm2XUOkW1gqwGXHX-eCHvuGM33yFibY"/>
</div>
{/* Glassmorphic Overlay Chip */}
<div className="absolute -bottom-6 -right-6 md:right-12 bg-white/40 backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-2xl flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
</div>
<div>
<div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Top Rated</div>
<div className="text-lg font-bold text-on-surface">Verified Expert</div>
</div>
</div>
</div>
{/* Provider Identity */}
<div className="lg:col-span-5 flex flex-col justify-center">
<div className="flex items-center gap-2 mb-4">
<div className="flex text-amber-400">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
</div>
<span className="text-on-surface-variant font-medium">(128 Reviews)</span>
</div>
<h1 className="text-5xl font-extrabold tracking-tight mb-4 text-on-surface">Julianne Sterling</h1>
<p className="text-xl text-on-surface-variant leading-relaxed mb-8">
                    Senior Interior Architect &amp; Spatial Planner with over 12 years of experience crafting breathable, modern living environments.
                </p>
<div className="flex flex-wrap gap-4">
<div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg">
<span className="material-symbols-outlined text-primary">location_on</span>
<span className="text-sm font-semibold">Greater London, UK</span>
</div>
<div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg">
<span className="material-symbols-outlined text-primary">language</span>
<span className="text-sm font-semibold">English, French</span>
</div>
</div>
</div>
</section>
{/* Content Grid (Bento Style) */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
{/* About Section (Spans 2) */}
<div className="lg:col-span-2 space-y-8">
<div className="bg-surface-container-low p-10 rounded-xl">
<h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
<span className="material-symbols-outlined text-primary">person</span>
                        About Provider
                    </h2>
<div className="space-y-4 text-on-surface-variant leading-relaxed">
<p>Julianne specializes in residential renovations that prioritize natural light and sustainable materials. Her approach combines editorial aesthetics with functional durability, ensuring every space feels like a curated gallery while remaining highly livable.</p>
<p>Having collaborated with top architectural firms in Paris and London, she now offers her boutique consultancy services through Service Square, bringing high-end design principles to personal home projects.</p>
</div>
</div>
{/* Services & Pricing List */}
<div className="bg-surface-container-lowest p-10 rounded-xl shadow-sm">
<h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
<span className="material-symbols-outlined text-primary">list_alt</span>
                        Services &amp; Pricing
                    </h2>
<div className="space-y-6">
<div className="flex justify-between items-center p-4 hover:bg-surface-container-low rounded-xl transition-colors">
<div className="flex gap-4 items-start">
<div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined">architecture</span>
</div>
<div>
<h4 className="font-bold text-lg">Initial Consultation</h4>
<p className="text-sm text-on-surface-variant">1-hour video call to discuss your vision</p>
</div>
</div>
<div className="text-right">
<div className="text-xl font-bold text-primary">£120</div>
<div className="text-xs text-on-surface-variant">per session</div>
</div>
</div>
<div className="flex justify-between items-center p-4 hover:bg-surface-container-low rounded-xl transition-colors">
<div className="flex gap-4 items-start">
<div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined">brush</span>
</div>
<div>
<h4 className="font-bold text-lg">Color Palette Curation</h4>
<p className="text-sm text-on-surface-variant">Full home scheme with material samples</p>
</div>
</div>
<div className="text-right">
<div className="text-xl font-bold text-primary">£450</div>
<div className="text-xs text-on-surface-variant">fixed rate</div>
</div>
</div>
<div className="flex justify-between items-center p-4 hover:bg-surface-container-low rounded-xl transition-colors">
<div className="flex gap-4 items-start">
<div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined">layers</span>
</div>
<div>
<h4 className="font-bold text-lg">Full Room Redesign</h4>
<p className="text-sm text-on-surface-variant">3D renders and sourcing list</p>
</div>
</div>
<div className="text-right">
<div className="text-xl font-bold text-primary">£1,200</div>
<div className="text-xs text-on-surface-variant">starting price</div>
</div>
</div>
</div>
</div>
</div>
{/* Side Content: Calendar & Contact */}
<div className="space-y-8">
{/* Visual Calendar View */}
<div className="bg-surface-container-low p-8 rounded-xl">
<div className="flex justify-between items-center mb-6">
<h3 className="font-bold">Availability</h3>
<span className="text-xs font-bold text-primary uppercase">October 2024</span>
</div>
<div className="grid grid-cols-7 gap-2 text-center text-xs mb-4">
<span className="font-bold opacity-50">M</span>
<span className="font-bold opacity-50">T</span>
<span className="font-bold opacity-50">W</span>
<span className="font-bold opacity-50">T</span>
<span className="font-bold opacity-50">F</span>
<span className="font-bold opacity-50">S</span>
<span className="font-bold opacity-50">S</span>
<div className="p-2 rounded-lg opacity-20">1</div>
<div className="p-2 rounded-lg opacity-20">2</div>
<div className="p-2 rounded-lg bg-white shadow-sm font-bold">3</div>
<div className="p-2 rounded-lg bg-white shadow-sm font-bold">4</div>
<div className="p-2 rounded-lg bg-primary text-on-primary font-bold">5</div>
<div className="p-2 rounded-lg bg-white shadow-sm font-bold">6</div>
<div className="p-2 rounded-lg bg-white shadow-sm font-bold">7</div>
<div className="p-2 rounded-lg bg-white shadow-sm font-bold">8</div>
<div className="p-2 rounded-lg bg-white shadow-sm font-bold">9</div>
<div className="p-2 rounded-lg bg-white shadow-sm font-bold">10</div>
<div className="p-2 rounded-lg bg-white shadow-sm font-bold">11</div>
<div className="p-2 rounded-lg bg-primary text-on-primary font-bold">12</div>
<div className="p-2 rounded-lg bg-white shadow-sm font-bold">13</div>
<div className="p-2 rounded-lg bg-white shadow-sm font-bold">14</div>
</div>
<p className="text-xs text-on-surface-variant text-center italic">Selected: Oct 5, Oct 12</p>
</div>
{/* Profile Stats Card */}
<div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-xl text-on-primary shadow-xl shadow-indigo-200">
<h3 className="text-xl font-bold mb-4">Quick Stats</h3>
<div className="space-y-6">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined opacity-70">history</span>
<div>
<div className="text-2xl font-bold">842</div>
<div className="text-xs uppercase tracking-wider opacity-70">Projects Completed</div>
</div>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined opacity-70">speed</span>
<div>
<div className="text-2xl font-bold">2h</div>
<div className="text-xs uppercase tracking-wider opacity-70">Avg. Response Time</div>
</div>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined opacity-70">workspace_premium</span>
<div>
<div className="text-2xl font-bold">PRO</div>
<div className="text-xs uppercase tracking-wider opacity-70">Account Status</div>
</div>
</div>
</div>
</div>
</div>
</div>
{/* Reviews Section */}
<section className="mb-32">
<h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
<span className="material-symbols-outlined text-primary">forum</span>
                Client Experiences
            </h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
{/* Review 1 */}
<div className="bg-surface-container-low p-8 rounded-xl space-y-4">
<div className="flex justify-between items-start">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full overflow-hidden bg-slate-300">
<img alt="Client Avatar" className="w-full h-full object-cover" data-alt="Portrait of a female client smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCclaUCSPncjQilXOjlcmYdDsn1V9f4z40HdgONz5FtUbXkEvGpRlyzKcPiFib2Q9Vau2eCR1HT9u1ZhA6Dwxc28vCSIi0_evoI9CyFbkNQuolCMEiSleOZqlWJmVDbZr3GmJPs7Hr48QsKQ1o3UXxI6y0FiJTxNgiG4WJidtK8NchsWNu3krZvMIhXuGXfDfeaESNUqAiF7DZDV3b2MThqTvY61LwUKt2v68nf4br80lEOpUuVT1OOgH8BEHuo2dRh6gcqeY1xNp4"/>
</div>
<div>
<h4 className="font-bold">Elena Rodriguez</h4>
<p className="text-xs text-on-surface-variant">October 2023</p>
</div>
</div>
<div className="flex text-amber-400">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
</div>
<p className="text-on-surface-variant italic">"Julianne transformed our dark basement into a vibrant studio. Her eye for light is unparalleled. She kept the project on budget and the results are truly editorial quality."</p>
</div>
{/* Review 2 */}
<div className="bg-surface-container-low p-8 rounded-xl space-y-4">
<div className="flex justify-between items-start">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full overflow-hidden bg-slate-300">
<img alt="Client Avatar" className="w-full h-full object-cover" data-alt="Portrait of a male client in a casual shirt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD85KXNMNVFYYL5Q2lfa71AP7dSo-1NQJftHMt7yc-0f3quahAEfUIwP_2fJv9tzGQVYeJZAsdwFgEqmTghOgwdWsemNjkiuovFRbdt4LRaW_tUW6xVZkqcjyji4J_Fn7RXzrKv5-R8KMW9aRNNw3r1fRFhp9ohSxBX9xM_SVTp0Ax8ISMeHMC2cqJZVIEXVzvvXDZCzbUAiWTgJc_M9hlAgAu4szGExb8RHcVFdQ7LMTrQZYjfYaWWPH7HF6Ni4queZX-jerpyk_Q"/>
</div>
<div>
<h4 className="font-bold">Marcus Thorne</h4>
<p className="text-xs text-on-surface-variant">September 2023</p>
</div>
</div>
<div className="flex text-amber-400">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined">star</span>
</div>
</div>
<p className="text-on-surface-variant italic">"Highly professional and meticulous. The technical drawings were flawless. Communication was excellent throughout the three-month renovation process."</p>
</div>
</div>
</section>
</main>
{/* Fixed Floating CTA */}
<div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center pointer-events-none">
<div className="pointer-events-auto bg-white/60 backdrop-blur-2xl border border-white/40 p-3 rounded-full shadow-2xl flex items-center gap-6 px-8 max-w-lg mx-auto">
<div className="hidden md:block">
<div className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Next Available</div>
<div className="text-sm font-bold text-on-surface">Oct 5, 10:00 AM</div>
</div>
<div className="w-px h-8 bg-outline-variant/30 hidden md:block"></div>
<Link to="/booking" className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 px-12 rounded-full shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all duration-300 text-center flex items-center justify-center">
                Book Now
            </Link>
</div>
</div>
{/* Footer */}
<footer className="bg-slate-50 dark:bg-slate-950 w-full pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
<div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
<div className="col-span-2">
<div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Service Square</div>
<p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Connecting premium editorial talent with discerning homeowners worldwide.</p>
</div>
<div className="flex flex-col gap-4">
<span className="text-slate-900 dark:text-white font-bold uppercase text-xs tracking-widest">Company</span>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">About Us</a>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Help Center</a>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Legal</a>
</div>
<div className="flex flex-col gap-4">
<span className="text-slate-900 dark:text-white font-bold uppercase text-xs tracking-widest">Platform</span>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Services</a>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Privacy Policy</a>
<a className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" href="#">Contact</a>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
<span className="text-sm text-slate-500 dark:text-slate-400">© 2024 Service Square. Premium Editorial Marketplace.</span>
<div className="flex gap-6">
<span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary">public</span>
<span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary">share</span>
</div>
</div>
</footer>

    </>
  );
}
