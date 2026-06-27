import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ fallback = '/', label = 'Back', className = '' }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all ${className}`}
    >
      <span className="material-symbols-outlined text-lg">arrow_back</span>
      {label}
    </button>
  );
}
