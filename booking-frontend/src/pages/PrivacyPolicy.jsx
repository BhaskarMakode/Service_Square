import React from 'react';

const privacySections = [
  ['Information we collect', 'Account details, booking history, service addresses, payment status, support messages, device data, and provider verification documents where required.'],
  ['How we use data', 'We use information to match customers with providers, process bookings, manage safety checks, resolve disputes, prevent fraud, and improve platform reliability.'],
  ['Sharing controls', 'Booking details are shared only with the assigned provider and operational partners needed to complete payment, support, verification, or legal obligations.'],
  ['Your choices', 'You can update profile details, request account deletion, manage communication preferences, and contact support for data access requests.'],
];

export default function PrivacyPolicy() {
  return (
    <main className="bg-background">
      <section className="max-w-5xl mx-auto px-6 py-16 lg:py-24">
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed text-primary rounded-full text-sm font-bold mb-6">
            <span className="material-symbols-outlined text-lg">lock</span>
            Privacy
          </span>
          <h1 className="text-5xl font-black tracking-tight text-on-surface mb-5">Privacy Policy</h1>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-3xl">
            This page explains how Service Square handles customer, provider, and admin data across the service-booking marketplace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Last updated</p>
            <p className="text-2xl font-black text-on-surface">May 12, 2026</p>
          </div>
          <div className="bg-primary text-on-primary rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Data principle</p>
            <p className="text-2xl font-black">Collect what is needed. Protect what is trusted.</p>
          </div>
        </div>

        <div className="space-y-5">
          {privacySections.map(([title, description]) => (
            <section className="bg-surface-container-lowest rounded-2xl p-7 border border-outline-variant/10" key={title}>
              <h2 className="text-2xl font-extrabold tracking-tight mb-3">{title}</h2>
              <p className="text-on-surface-variant leading-relaxed">{description}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
