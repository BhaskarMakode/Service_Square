import React from 'react';
import { Link } from 'react-router-dom';

export default function Provider() {
  return (
    <main className="flex-1">
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-black tracking-tight text-on-surface mb-6">Grow Your Business with Service Square</h1>
          <p className="text-xl text-on-surface-variant mb-10">Join our network of premium service providers and connect with thousands of homeowners looking for your expertise.</p>
          <div className="bg-surface-container-lowest editorial-shadow rounded-3xl p-8 border border-outline-variant/10 text-left">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Provider Application</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
                  <input type="text" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" placeholder="Your Business LLC" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Service Category</label>
                  <select className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20">
                    <option>Cleaning</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Handyman</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Years of Experience</label>
                <input type="number" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" placeholder="5" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Why do you want to join Service Square?</label>
                <textarea rows="4" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" placeholder="Tell us about your commitment to quality..."></textarea>
              </div>
              <Link to="/onboarding-1" className="block text-center w-full py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                Submit Application
              </Link>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
