import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <main className="flex-1">
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-8">About Service Square</h1>
        <div className="w-24 h-1 bg-primary mx-auto mb-10 rounded-full"></div>
        <p className="text-xl text-slate-600 leading-relaxed mb-8">
          Service Square was founded with a simple mission: to elevate the standard of home and lifestyle services. We believe that finding a reliable, high-quality professional shouldn't be a gamble.
        </p>
        <p className="text-xl text-slate-600 leading-relaxed mb-12">
          That's why we've built a curated marketplace where every provider is rigorously vetted, background-checked, and committed to excellence. Quality and trust, squared.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 bg-surface-container-low rounded-3xl">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Verified Experts</h3>
            <p className="text-slate-500 text-sm">Every professional passes a strict background and skills check.</p>
          </div>
          <div className="p-6 bg-surface-container-low rounded-3xl">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">workspace_premium</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
            <p className="text-slate-500 text-sm">We only partner with the highest-rated service providers.</p>
          </div>
          <div className="p-6 bg-surface-container-low rounded-3xl">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">support_agent</span>
            </div>
            <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
            <p className="text-slate-500 text-sm">Our dedicated team is always here to help you.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
