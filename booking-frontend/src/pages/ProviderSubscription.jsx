import React, { useEffect, useState } from 'react';
import { subscriptionApi } from '../services/serviceApi';
import { formatCurrency } from '../utils/currency';

const featureLabel = (feature) => String(feature || '').replaceAll('_', ' ');

export default function ProviderSubscription() {
  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError('');
      const [plansRes, statusRes] = await Promise.all([
        subscriptionApi.plans(),
        subscriptionApi.status()
      ]);
      setPlans(plansRes.data.data.plans || []);
      setStatus(statusRes.data.data || null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const upgrade = async (planName) => {
    try {
      setActionLoading(planName);
      setError('');
      setMessage('');
      await subscriptionApi.upgrade({ planName, paymentMethod: 'mock' });
      setMessage('Subscription upgraded successfully.');
      await fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to upgrade subscription');
    } finally {
      setActionLoading('');
    }
  };

  const currentPlanName = status?.subscription?.planName;

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

        {(error || message) && (
          <div className={`mb-8 p-4 rounded-2xl font-semibold ${error ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
            {error || message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold animate-pulse">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
            No subscription plans are available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {plans.map((plan, idx) => {
              const recommended = idx === Math.floor(plans.length / 2);
              const isCurrent = currentPlanName === plan.planName;
              return (
                <div key={plan.planName} className={`relative bg-white dark:bg-slate-900 rounded-3xl p-8 border ${recommended ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 ring-4 ring-indigo-500/5 z-10' : 'border-slate-200 dark:border-slate-800 shadow-sm'} flex flex-col h-full transition-all duration-300 hover:-translate-y-2`}>
                  {recommended && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black px-4 py-1 rounded-full uppercase">
                      Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{plan.displayName}</h3>
                    <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed h-10">{plan.durationDays} days of premium provider benefits.</p>
                  </div>

                  <div className="mb-8">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">{formatCurrency(plan.amount)}</span>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {(plan.features || []).map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 font-medium text-sm capitalize">
                        <span className={`material-symbols-outlined text-lg ${recommended ? 'text-indigo-500' : 'text-slate-400'}`}>check_circle</span>
                        {featureLabel(feature)}
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled={isCurrent || actionLoading === plan.planName}
                    onClick={() => upgrade(plan.planName)}
                    className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                      recommended
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600'
                    }`}
                  >
                    {actionLoading === plan.planName ? 'Updating...' : isCurrent ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
