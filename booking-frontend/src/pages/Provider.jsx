import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const STEPS = [
  {
    number: '01',
    icon: 'person_add',
    title: 'Create Your Account',
    desc: 'Sign up with your phone number and verify with OTP. Basic profile setup takes less than 2 minutes.',
    detail: 'Provide your full name, email, and choose "Provider" as your role during registration.',
    color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  {
    number: '02',
    icon: 'badge',
    title: 'Fill Your Profile Details',
    desc: 'Enter your business name, service category, years of experience, and hourly rate.',
    detail: 'Choose from categories like Plumbing, Electrical, Cleaning, Carpentry, Painting, and more. Add skills and a bio describing your expertise.',
    color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600',
    border: 'border-violet-200 dark:border-violet-800',
  },
  {
    number: '03',
    icon: 'id_card',
    title: 'Upload Your Documents',
    desc: 'Upload your Government ID (Aadhaar, PAN, Passport) and any professional certifications.',
    detail: 'Accepted formats: JPEG, PNG, or PDF up to 10MB. This is required for admin verification. Your documents are stored securely and never shared publicly.',
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    border: 'border-blue-200 dark:border-blue-800',
  },
  {
    number: '04',
    icon: 'event_available',
    title: 'Set Your Availability',
    desc: 'Configure your working days and hours. You can block specific dates like holidays.',
    detail: 'Choose which days of the week you work and set your start/end times. Toggle yourself online/offline anytime from your Provider Panel.',
    color: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  {
    number: '05',
    icon: 'verified',
    title: 'Admin Verification (24–48 hrs)',
    desc: 'Our team reviews your documents and profile within 1–2 business days.',
    detail: 'While pending, your profile is NOT visible to customers. You\'ll receive a notification once approved or if any document needs to be resubmitted.',
    color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    border: 'border-amber-200 dark:border-amber-800',
  },
  {
    number: '06',
    icon: 'storefront',
    title: 'Go Live & Get Bookings',
    desc: 'Once approved, your profile is visible to customers. Accept bookings and start earning!',
    detail: 'Customers can find you via search, categories, or recommendations. Manage bookings, track earnings, and chat with customers — all from your Provider Panel.',
    color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
];

const EARNINGS_FEATURES = [
  { icon: 'payments', title: 'Competitive Earnings', desc: 'Keep 85% of every booking. Platform takes only 15% commission.' },
  { icon: 'schedule', title: 'Flexible Hours', desc: 'Work on your own schedule. Set your availability and take days off anytime.' },
  { icon: 'trending_up', title: 'Grow Your Business', desc: 'Build your reputation with reviews. Top providers get priority placement.' },
  { icon: 'security', title: 'Secure Payments', desc: 'Get paid directly to your account within 24 hours of job completion.' },
  { icon: 'support_agent', title: 'Dedicated Support', desc: 'Provider support team available to help you with any issues.' },
  { icon: 'workspace_premium', title: 'Verified Badge', desc: 'Approved providers get a Verified badge — builds customer trust instantly.' },
];

export default function Provider() {
  const { isAuthenticated, user, providerProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/signup');
    } else if (user?.role === 'provider') {
      if (providerProfile?.verificationStatus === 'approved') {
        navigate('/provider-panel');
      } else {
        navigate('/verification-status');
      }
    } else {
      navigate('/onboarding-1');
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 font-['Inter']">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white py-28 px-6">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 40%, white 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-6 tracking-wide">
            🚀 Join 500+ Verified Providers
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Turn Your Skills Into<br />
            <span className="text-indigo-200">Consistent Income</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Register as a Service Square provider, get verified by our admin team, and start receiving bookings from thousands of customers in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 bg-white text-indigo-700 font-black text-lg rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all shadow-xl shadow-black/20"
            >
              {!isAuthenticated ? 'Get Started — Free' :
               user?.role === 'provider' && providerProfile?.verificationStatus === 'approved' ? 'Open My Dashboard' :
               user?.role === 'provider' ? 'Check My Status' : 'Start Registration'}
            </button>
            <a href="#how-it-works" className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all border border-white/20">
              How It Works ↓
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-900 dark:bg-slate-800 py-6 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ['500+', 'Active Providers'],
            ['₹0', 'Joining Fee'],
            ['85%', 'You Keep'],
            ['24–48hr', 'Verification Time'],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-black text-white">{val}</p>
              <p className="text-sm text-slate-400 font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Your Journey from Registration to Earning
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Follow these 6 steps — most providers complete registration in under 15 minutes.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800 hidden md:block" />

            <div className="space-y-8">
              {STEPS.map((step, idx) => (
                <div key={step.number} className={`relative flex gap-6 md:gap-10 p-6 md:p-8 rounded-3xl border-2 ${step.border} ${step.color.split(' ')[0]} dark:bg-slate-900/50 transition-all hover:shadow-lg`}>
                  {/* Step number bubble */}
                  <div className={`shrink-0 w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center relative z-10`}>
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-black uppercase tracking-widest ${step.color.split(' ').find(c => c.startsWith('text-'))}`}>Step {idx + 1}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium mb-3">{step.desc}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed bg-white/60 dark:bg-white/5 rounded-xl p-4">
                      💡 {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA after steps */}
          <div className="mt-16 text-center">
            <button
              onClick={handleGetStarted}
              className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-xl rounded-2xl hover:from-indigo-700 hover:to-violet-700 active:scale-95 transition-all shadow-2xl shadow-indigo-500/30"
            >
              Start Registration Now →
            </button>
            <p className="text-sm text-slate-400 mt-4">Free to join · No credit card required</p>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Why Providers Love Service Square
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EARNINGS_FEATURES.map(f => (
              <div key={f.title} className="bg-white dark:bg-slate-800 p-7 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-indigo-600" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12 text-slate-900 dark:text-white">Documents You'll Need</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: 'id_card', title: 'Government ID (Required)', items: ['Aadhaar Card', 'PAN Card', 'Passport', 'Voter ID', 'Driving License'] },
              { icon: 'workspace_premium', title: 'Professional Documents (Optional)', items: ['Business Registration Certificate', 'Trade License', 'Professional Certification', 'Address Proof', 'Bank Statement'] },
            ].map(section => (
              <div key={section.title} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <span className="material-symbols-outlined text-indigo-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{section.icon}</span>
                  <h3 className="font-black text-slate-900 dark:text-white">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400 mt-8">
            All documents are reviewed by our admin team and stored securely. Accepted formats: JPEG, PNG, PDF (max 10MB).
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Ready to Start Earning?</h2>
          <p className="text-indigo-200 text-lg mb-10">
            Registration is completely free. Get verified and start receiving bookings within 48 hours.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-12 py-5 bg-white text-indigo-700 font-black text-xl rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all shadow-xl"
          >
            Begin Provider Registration →
          </button>
        </div>
      </section>
    </main>
  );
}
