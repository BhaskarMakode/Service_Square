import React, { useState } from 'react';

export default function AddressBook() {
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', text: 'Apartment 4B, Skyview Residency, Indiranagar', landmark: 'Near HDFC Bank', isDefault: true },
    { id: 2, label: 'Office', text: '9th Floor, Tech Hub, Outer Ring Road', landmark: 'Bellandur Gate', isDefault: false },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-900 text-slate-900 dark:text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <span className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">location_on</span>
              </span>
              Saved Addresses
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage where we send our service providers.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-transform hover:-translate-y-0.5 active:scale-95">
            <span className="material-symbols-outlined">add_location_alt</span>
            Add New Address
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative group cursor-pointer hover:border-indigo-400 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 transition-colors">
                    <span className="material-symbols-outlined">
                      {addr.label.toLowerCase() === 'home' ? 'home' : 'business'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{addr.label}</h3>
                    {addr.isDefault && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">Default</span>
                    )}
                  </div>
                </div>
                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-lg">more_vert</span>
                </button>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium mb-4 h-10 overflow-hidden line-clamp-2">
                {addr.text}
              </p>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-4">
                <span className="material-symbols-outlined text-sm">flag</span>
                Landmark: {addr.landmark}
              </div>

              {/* Hover overlay subtle button */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button className="w-8 h-8 bg-white dark:bg-slate-900 shadow-md rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all border border-slate-100 dark:border-slate-700">
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>
              </div>
            </div>
          ))}

          {/* Empty Slot Action */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer aspect-[2/1.2] md:aspect-auto">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">map</span>
            <span className="font-black text-sm">Locate on Map</span>
          </div>
        </div>
      </div>
    </div>
  );
}
