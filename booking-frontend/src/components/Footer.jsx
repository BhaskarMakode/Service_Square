import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 w-full pt-20 pb-10 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div className="col-span-2">
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Service Square</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-['Inter'] leading-relaxed max-w-xs">
            The curated marketplace for premium professional services. From artisanal home care to expert technical support.
          </p>
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold mb-6">Platform</h4>
          <ul className="space-y-4">
            <li><Link className="text-sm text-slate-500 dark:text-slate-400 font-['Inter'] hover:text-indigo-500 transition-colors" to="/about">About Us</Link></li>
            <li><Link className="text-sm text-slate-500 dark:text-slate-400 font-['Inter'] hover:text-indigo-500 transition-colors" to="/help">Help Center</Link></li>
            <li><Link className="text-sm text-slate-500 dark:text-slate-400 font-['Inter'] hover:text-indigo-500 transition-colors" to="/services">Services</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4">
            <li><Link className="text-sm text-slate-500 dark:text-slate-400 font-['Inter'] hover:text-indigo-500 transition-colors" to="/legal">Legal</Link></li>
            <li><Link className="text-sm text-slate-500 dark:text-slate-400 font-['Inter'] hover:text-indigo-500 transition-colors" to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-['Inter']">© 2024 Service Square. Premium Editorial Marketplace.</p>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors">brand_awareness</span>
          <span className="material-symbols-outlined text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors">public</span>
        </div>
      </div>
    </footer>
  );
}
