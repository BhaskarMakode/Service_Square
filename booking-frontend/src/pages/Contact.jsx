import React from 'react';

export default function Contact() {
  return (
    <main className="flex-1 py-24 bg-surface-container-low">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-4">Contact Us</h1>
          <p className="text-xl text-slate-500">We're here to help. Send us a message and we'll respond as soon as possible.</p>
        </div>
        <div className="bg-surface-container-lowest editorial-shadow rounded-3xl p-8 md:p-12 border border-outline-variant/10">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">First Name</label>
                <input type="text" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
                <input type="text" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input type="email" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
              <textarea rows="6" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
