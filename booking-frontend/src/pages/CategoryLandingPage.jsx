import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryLandingPage() {
  return (
    <>
      
{/* TopNavBar */}
<nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-[20px] shadow-[0_32px_32px_rgba(79,70,229,0.06)]">
<div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
<div className="flex items-center gap-8">
<a className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400" href="#">Service Square</a>
<div className="hidden md:flex gap-6 items-center">
<a className="text-indigo-700 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 pb-1 font-inter tracking-tight text-sm" href="#">Browse Services</a>
<a className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200 font-inter tracking-tight text-sm font-medium" href="#">How it Works</a>
<a className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200 font-inter tracking-tight text-sm font-medium" href="#">For Pros</a>
</div>
</div>
<div className="flex items-center gap-4">
<button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors">Log In</button>
<button className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 scale-98-on-press transition-all">Sign Up</button>
</div>
</div>
</nav>
<main>
{/* Hero Section */}
<section className="relative pt-20 pb-28 px-6 overflow-hidden">
<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
<div className="z-10">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary font-semibold text-xs mb-6">
<span className="material-symbols-outlined text-[16px]">electric_bolt</span>
<span>CERTIFIED PROFESSIONALS</span>
</div>
<h1 className="text-[2.75rem] font-black leading-tight tracking-tight text-on-surface mb-6">Electrician Services</h1>
<p className="text-body-lg text-on-surface-variant leading-relaxed max-w-lg mb-10">
                        Expert electrical solutions for modern living. From intricate residential wiring to large-scale commercial installations, our verified pros bring safety and precision to every wire.
                    </p>
<div className="flex flex-wrap gap-4">
<button className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 scale-98-on-press transition-all">Book an Electrician</button>
<button className="px-8 py-4 glass-card border border-outline-variant/15 text-on-surface rounded-xl font-bold scale-98-on-press transition-all">View Pricing Guide</button>
</div>
</div>
<div className="relative">
<div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative z-10 group">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Professional electrician working on a modern electrical panel" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSJjYPuZ3w6Idp11mRVeTVilnkGtgahFyr0y3Zt_AHoOeRiICX2rNo4nB8NtRNRk7LkMrMM7JDabyhDmCijw_27xf5eE2TTM-a1oenX6eAxicj0u3jP_GA26ZW7xgP3MjhMO6LT3gRJeRvxsPVE_fa2wj1TcIS3gST0XD5Vp9o4MpTioH-PaFiJE7cAbn4GzKypn2qq38m58UvkBulAFkUNOPkQQ1QEotbZI5j_4p7r4gRfJWLY0qU69FRfne9kPO291s2AerPG-g"/>
<div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
</div>
{/* Decorative Element */}
<div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary-container/40 rounded-full blur-[100px] -z-10"></div>
<div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary-container/20 rounded-full blur-[100px] -z-10"></div>
</div>
</div>
</section>
{/* Featured Sub-Specialties (Organic Bento) */}
<section className="py-24 bg-surface-container-low px-6">
<div className="max-w-7xl mx-auto">
<div className="mb-16">
<h2 className="text-3xl font-bold tracking-tight mb-4">Our Specializations</h2>
<p className="text-on-surface-variant max-w-md">Tailored electrical expertise for every specific requirement, backed by our quality guarantee.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/* Item 1 */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
<div className="organic-square w-12 h-12 bg-secondary-container flex items-center justify-center mb-6 text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined">home</span>
</div>
<h3 className="font-bold text-lg mb-2">Residential Wiring</h3>
<p className="text-sm text-on-surface-variant leading-relaxed">Full home circuits, renovations, and smart home integrations.</p>
</div>
{/* Item 2 */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
<div className="organic-square w-12 h-12 bg-secondary-container flex items-center justify-center mb-6 text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined">business</span>
</div>
<h3 className="font-bold text-lg mb-2">Commercial Installations</h3>
<p className="text-sm text-on-surface-variant leading-relaxed">Heavy-duty power systems for offices and industrial spaces.</p>
</div>
{/* Item 3 */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
<div className="organic-square w-12 h-12 bg-secondary-container flex items-center justify-center mb-6 text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined">warning</span>
</div>
<h3 className="font-bold text-lg mb-2">Emergency Repair</h3>
<p className="text-sm text-on-surface-variant leading-relaxed">24/7 rapid response for outages, shorts, and safety hazards.</p>
</div>
{/* Item 4 */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
<div className="organic-square w-12 h-12 bg-secondary-container flex items-center justify-center mb-6 text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined">lightbulb</span>
</div>
<h3 className="font-bold text-lg mb-2">Lighting Solutions</h3>
<p className="text-sm text-on-surface-variant leading-relaxed">Custom LED design, landscape lighting, and ambiance control.</p>
</div>
</div>
</div>
</section>
{/* Top-Rated Electricians */}
<section className="py-28 px-6 bg-surface">
<div className="max-w-7xl mx-auto">
<div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
<div>
<h2 className="text-3xl font-black tracking-tight mb-4">Top-Rated Electricians</h2>
<p className="text-on-surface-variant">The highest performing professionals in your area this month.</p>
</div>
<button className="text-primary font-bold flex items-center gap-2 hover:underline underline-offset-8">
                        View All Professionals <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{/* Provider Card 1 */}
<div className="bg-surface-container-lowest rounded-xl p-4 transition-all duration-300 hover:-translate-y-1">
<div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6">
<img className="w-full h-full object-cover" data-alt="Portrait of a smiling professional electrician" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGqa9nnl7f24Wlx4B5sUIWyHPVXf3-gY8cc0eDdIRcAj-pHa6X4DAPayTlhmO9kB6v1bHxP7rRtp3ujKRhfZoSF62OfMPxWETBHV97NlSoObKX_ewVhr_1VFPXe5Wsy3fJhIKyA-oKFeh_aLMg1T8J3OnzOgIhkXbj_IUHq89Tsw6ejpORNbCV59lS_HlQNe1bp5vmKp14Aw_auz4pbQ8vY9KMIR4Baj9sxRuqpCO4faau-Y3fd1EUMqtb9bPhruFvrG0mpaXmRQE"/>
<div className="absolute top-4 right-4 glass-card px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm">
<span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span>4.9 (124 reviews)</span>
</div>
</div>
<div className="px-2">
<h3 className="text-xl font-bold mb-1">Marcus Thorne</h3>
<p className="text-on-surface-variant text-sm mb-6 flex items-center gap-1">
<span className="material-symbols-outlined text-sm">verified</span> Master Electrician • 12 years exp.
                            </p>
<button className="w-full py-3 glass-card border border-outline-variant/15 text-primary font-bold rounded-lg hover:bg-primary-container/10 transition-colors">View Profile</button>
</div>
</div>
{/* Provider Card 2 */}
<div className="bg-surface-container-lowest rounded-xl p-4 transition-all duration-300 hover:-translate-y-1">
<div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6">
<img className="w-full h-full object-cover" data-alt="Expert electrical technician in professional gear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOUDcLvreS-Un0DHIAbBb-wX2C5I21ZMe7M06i99Xh-l3T1ZS5JnrJGaKAlgHKnTDC17tjODDxUkigO92nSLnpnpcVPDhxLQ6lOWDqbq6kpBJdbLdkTW8rYG3M-9832gmByDT6TiXKFkr552VD3phdKbocVGY5Fysk7ptUgAZYfOKl4qghXhuFImvZE7ADW4_GQdDi2h2noU69ubsi1SbVbcrXK4GC9x4578K1_JKUYCavS57vVLAIWyjemUvCxqTCO33y07XQJGI"/>
<div className="absolute top-4 right-4 glass-card px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm">
<span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span>5.0 (88 reviews)</span>
</div>
</div>
<div className="px-2">
<h3 className="text-xl font-bold mb-1">Elena Rodriguez</h3>
<p className="text-on-surface-variant text-sm mb-6 flex items-center gap-1">
<span className="material-symbols-outlined text-sm">verified</span> Smart Home Specialist
                            </p>
<button className="w-full py-3 glass-card border border-outline-variant/15 text-primary font-bold rounded-lg hover:bg-primary-container/10 transition-colors">View Profile</button>
</div>
</div>
{/* Provider Card 3 */}
<div className="bg-surface-container-lowest rounded-xl p-4 transition-all duration-300 hover:-translate-y-1">
<div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6">
<img className="w-full h-full object-cover" data-alt="Experienced commercial electrician" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqiE7a-u6Fsv3m0niN0onZNd_cOMSc1Nldry3yk2p5OT8YQPGigYHfhPOOBoPQ22JNTfvwuRPQV0USFl0k56HQVZaQBcLLZBSxnNR-Dr6xlkS7IK-Fotpm00oW3bVYvTTNldh6JWWXziHhxLD5nfL0ytaAEqR46Ca369Zvbq0Y_81PuNSEWIYpgPYRWYBfE8gkBRxmDs7af8tdKJnZhAXSfTMoTumZvAvVAL4JuZ7Ndw0C-a413HQZH0asJg1Y-QPKFYcwe2JiOdo"/>
<div className="absolute top-4 right-4 glass-card px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm">
<span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span>4.8 (210 reviews)</span>
</div>
</div>
<div className="px-2">
<h3 className="text-xl font-bold mb-1">David Chen</h3>
<p className="text-on-surface-variant text-sm mb-6 flex items-center gap-1">
<span className="material-symbols-outlined text-sm">verified</span> Commercial Power Systems
                            </p>
<button className="w-full py-3 glass-card border border-outline-variant/15 text-primary font-bold rounded-lg hover:bg-primary-container/10 transition-colors">View Profile</button>
</div>
</div>
</div>
</div>
</section>
{/* Promotional Section */}
<section className="py-24 px-6">
<div className="max-w-7xl mx-auto bg-primary-container rounded-[2.5rem] overflow-hidden relative">
<div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent opacity-50"></div>
<div className="relative z-10 grid lg:grid-cols-2 gap-12 p-12 lg:p-20 items-center">
<div>
<h2 className="text-white text-[2.25rem] font-bold leading-tight mb-8">Why Book with Service Square?</h2>
<ul className="space-y-6">
<li className="flex gap-4 items-start">
<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-white text-[20px]">check</span>
</div>
<div>
<h4 className="text-white font-bold mb-1">Strict Vetting Process</h4>
<p className="text-white/70 text-sm">Every pro undergoes background checks and license verification.</p>
</div>
</li>
<li className="flex gap-4 items-start">
<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-white text-[20px]">check</span>
</div>
<div>
<h4 className="text-white font-bold mb-1">Upfront Pricing</h4>
<p className="text-white/70 text-sm">No hidden fees or surprise surcharges. You pay what we quote.</p>
</div>
</li>
<li className="flex gap-4 items-start">
<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-white text-[20px]">check</span>
</div>
<div>
<h4 className="text-white font-bold mb-1">Satisfaction Guarantee</h4>
<p className="text-white/70 text-sm">We're not happy until you are. Insurance coverage on all jobs.</p>
</div>
</li>
</ul>
</div>
<div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20">
<div className="text-center">
<div className="inline-flex h-20 w-20 bg-white rounded-full items-center justify-center mb-6">
<span className="material-symbols-outlined text-primary text-4xl">security</span>
</div>
<h3 className="text-2xl font-bold text-white mb-4">Peace of Mind, Guaranteed.</h3>
<p className="text-white/80 mb-8 leading-relaxed">Join thousands of homeowners who trust Service Square for their most critical home systems.</p>
<button className="w-full py-4 bg-white text-primary font-bold rounded-xl scale-98-on-press transition-all hover:bg-surface-bright">Book Your Consultation</button>
</div>
</div>
</div>
</div>
</section>
{/* Final Call-to-Action Buttons */}
<section className="py-24 px-6 text-center">
<div className="max-w-2xl mx-auto">
<h2 className="text-3xl font-black mb-10">Looking for more?</h2>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<button className="px-10 py-5 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined">grid_view</span>
                        View Related Services
                    </button>
<button className="px-10 py-5 bg-gradient-to-br from-secondary to-on-secondary-container text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 scale-98-on-press transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined">person_add</span>
                        Become an Electrician
                    </button>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer className="bg-gray-100 dark:bg-gray-950 w-full pt-20 pb-10">
<div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start gap-8">
<div className="max-w-sm">
<span className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 block">Service Square</span>
<p className="text-gray-500 dark:text-gray-400 font-inter text-sm leading-relaxed mb-6">
                    © 2024 Service Square. The Curated Canvas for Local Professionals. Connecting quality talent with quality homeowners.
                </p>
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
<div className="flex flex-col gap-4">
<span className="font-bold text-xs uppercase tracking-widest text-gray-400">Company</span>
<a className="text-gray-500 hover:text-indigo-500 underline-offset-4 hover:underline transition-opacity text-sm" href="#">About Us</a>
<a className="text-gray-500 hover:text-indigo-500 underline-offset-4 hover:underline transition-opacity text-sm" href="#">Press</a>
<a className="text-gray-500 hover:text-indigo-500 underline-offset-4 hover:underline transition-opacity text-sm" href="#">Careers</a>
</div>
<div className="flex flex-col gap-4">
<span className="font-bold text-xs uppercase tracking-widest text-gray-400">Support</span>
<a className="text-gray-500 hover:text-indigo-500 underline-offset-4 hover:underline transition-opacity text-sm" href="#">Safety</a>
<a className="text-gray-500 hover:text-indigo-500 underline-offset-4 hover:underline transition-opacity text-sm" href="#">Help Center</a>
<a className="text-gray-500 hover:text-indigo-500 underline-offset-4 hover:underline transition-opacity text-sm" href="#">Contact</a>
</div>
<div className="flex flex-col gap-4">
<span className="font-bold text-xs uppercase tracking-widest text-gray-400">Legal</span>
<a className="text-gray-500 hover:text-indigo-500 underline-offset-4 hover:underline transition-opacity text-sm" href="#">Privacy Policy</a>
<a className="text-gray-500 hover:text-indigo-500 underline-offset-4 hover:underline transition-opacity text-sm" href="#">Terms of Service</a>
</div>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
<div className="flex gap-6">
<a className="text-gray-400 hover:text-indigo-600 transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
<a className="text-gray-400 hover:text-indigo-600 transition-colors" href="#"><span className="material-symbols-outlined">mail</span></a>
<a className="text-gray-400 hover:text-indigo-600 transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
</div>
<p className="text-xs text-gray-400">Built for the future of local services.</p>
</div>
</footer>

    </>
  );
}
