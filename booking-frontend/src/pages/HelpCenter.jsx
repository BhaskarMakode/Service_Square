import React from 'react';
import { Link } from 'react-router-dom';

const helpTopics = [
  {
    icon: 'event_available',
    title: 'Booking and scheduling',
    description: 'Reschedule appointments, check provider ETA, and understand confirmation steps.',
  },
  {
    icon: 'payments',
    title: 'Payments and refunds',
    description: 'Review invoices, payment holds, cancellation refunds, and failed transaction fixes.',
  },
  {
    icon: 'verified_user',
    title: 'Trust and safety',
    description: 'Learn how provider checks, ratings, issue reports, and service guarantees work.',
  },
  {
    icon: 'engineering',
    title: 'Provider support',
    description: 'Get help with verification, job requests, payouts, and service catalog setup.',
  },
];

const quickActions = [
  { label: 'Track active booking', icon: 'near_me', to: '/tracking' },
  { label: 'Open support chat', icon: 'chat', to: '/chat' },
  { label: 'View my bookings', icon: 'calendar_month', to: '/dashboard' },
];

export default function HelpCenter() {
  return (
    <main className="bg-background">
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed text-primary rounded-full text-sm font-bold mb-6">
              <span className="material-symbols-outlined text-lg">support_agent</span>
              Help Center
            </span>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-on-surface leading-tight mb-6">
              Answers for every service moment.
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8">
              Find help for bookings, payments, provider verification, and safety concerns without leaving the Service Square experience.
            </p>
            <div className="bg-surface-container-lowest rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-outline-variant/20 max-w-2xl">
              <span className="material-symbols-outlined text-outline ml-3">search</span>
              <input
                className="flex-1 border-none bg-transparent focus:ring-0 text-on-surface placeholder:text-outline"
                placeholder="Search for cancellations, refunds, verification..."
                type="text"
              />
              <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold active:scale-95 transition-all">
                Search
              </button>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
            <h2 className="text-xl font-extrabold mb-5">Quick actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-colors"
                  key={action.label}
                  to={action.to}
                >
                  <span className="flex items-center gap-3 font-bold text-on-surface">
                    <span className="material-symbols-outlined text-primary">{action.icon}</span>
                    {action.label}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </Link>
              ))}
            </div>
            <div className="mt-6 p-5 bg-primary text-on-primary rounded-2xl">
              <p className="text-sm opacity-80 font-semibold mb-1">Urgent issue?</p>
              <p className="text-2xl font-black mb-4">Priority support is online.</p>
              <Link className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-xl font-bold" to="/chat">
                Start chat
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Browse support topics</h2>
              <p className="text-on-surface-variant mt-2">Focused guidance for the most common customer and provider workflows.</p>
            </div>
            <Link className="text-primary font-bold inline-flex items-center gap-2" to="/contact">
              Contact team
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpTopics.map((topic) => (
              <article className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm" key={topic.title}>
                <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined">{topic.icon}</span>
                </div>
                <h3 className="text-lg font-extrabold mb-2">{topic.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{topic.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight mb-8 text-center">Popular questions</h2>
        <div className="space-y-4">
          {[
            ['How do I reschedule a booking?', 'Open your dashboard, select the active booking, and choose a new provider-approved time slot.'],
            ['When am I charged?', 'Most bookings place a payment hold at confirmation and capture the final amount after service completion.'],
            ['How are providers verified?', 'Providers submit identity, skill, and document checks that admins review before marketplace access.'],
          ].map(([question, answer]) => (
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10" key={question}>
              <h3 className="font-extrabold text-lg mb-2">{question}</h3>
              <p className="text-on-surface-variant">{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
