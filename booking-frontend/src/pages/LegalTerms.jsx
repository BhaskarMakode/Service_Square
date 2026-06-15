import React from 'react';
import { Link } from 'react-router-dom';

const terms = [
  ['Marketplace role', 'Service Square connects customers and independent providers. Providers are responsible for delivering the accepted service safely and professionally.'],
  ['Bookings and cancellations', 'Customers should review service scope, timing, location, and price before confirming. Cancellation fees may apply when a provider has already reserved time or started travel.'],
  ['Provider obligations', 'Providers must keep licenses, documents, pricing, availability, and service descriptions accurate. Unsafe or misleading conduct can lead to suspension.'],
  ['Disputes and refunds', 'Support may review booking records, chat history, proof of work, and provider notes before issuing adjustments, credits, or refunds.'],
];

export default function LegalTerms() {
  return (
    <main className="bg-background">
      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
          <aside className="bg-surface-container-lowest rounded-2xl p-7 border border-outline-variant/10 shadow-sm lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed text-primary rounded-full text-sm font-bold mb-6">
              <span className="material-symbols-outlined text-lg">gavel</span>
              Legal
            </span>
            <h1 className="text-4xl font-black tracking-tight mb-4">Terms of Service</h1>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              Practical terms for customers, providers, and marketplace operations.
            </p>
            <Link className="inline-flex items-center gap-2 text-primary font-bold" to="/privacy">
              Read privacy policy
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </aside>

          <div className="space-y-5">
            {terms.map(([title, description], index) => (
              <section className="bg-surface-container-lowest rounded-2xl p-7 border border-outline-variant/10" key={title}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-black shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight mb-3">{title}</h2>
                    <p className="text-on-surface-variant leading-relaxed">{description}</p>
                  </div>
                </div>
              </section>
            ))}
            <section className="bg-surface-container-low rounded-2xl p-7">
              <h2 className="text-2xl font-extrabold tracking-tight mb-3">Need clarification?</h2>
              <p className="text-on-surface-variant mb-5">For account-specific legal, billing, or safety questions, contact support with your booking ID.</p>
              <Link className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-bold" to="/help">
                Visit Help Center
                <span className="material-symbols-outlined">help</span>
              </Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
