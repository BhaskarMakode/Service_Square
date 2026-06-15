import React from 'react';

export default function ProviderSubscription() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      desc: 'Pay 20% platform fee per booking.',
      features: ['Standard placement', 'Basic support'],
      recommended: false,
      buttonText: 'Current Plan'
    },
    {
      name: 'Pro Plus',
      price: '$29 / mo',
      desc: 'Boost profile and reduce fees to 10%.',
      features: ['Priority search rank', '24/7 support line', 'Unlimited portfolio items'],
      recommended: true,
      buttonText: 'Upgrade to Pro'
    },
    {
      name: 'Elite Agency',
      price: '$89 / mo',
      desc: 'Ideal for growing service agencies.',
      features: ['5% commission cap', 'Featured vendor tag', 'White-label invoices', 'Dedicated Account Manager'],
      recommended: false,
      buttonText: 'Go Elite'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="max-w-6xl mx-auto px-4 pt-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest rounded-full mb-4">
            Growth Engine
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Supercharge Your Reach
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Keep more of your earnings and unlock premium tools designed to grow your trade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative bg-white dark:bg-slate-900 rounded-3xl p-8 border ${plan.recommended ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 ring-4 ring-indigo-500/5 z-10' : 'border-slate-200 dark:border-slate-800 shadow-sm'} flex flex-col h-full transition-all duration-300 hover:-translate-y-2`}>
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black px-4 py-1 rounded-full uppercase">
                  Highly Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed h-10">{plan.desc}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 font-medium text-sm">
                    <span className={`material-symbols-outlined text-lg ${plan.recommended ? 'text-indigo-500' : 'text-slate-400'}`}>check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${
                plan.recommended 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25' 
                  : idx === 0 
                  ? 'bg-slate-100 text-slate-500 cursor-not-allowed' 
                  : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
