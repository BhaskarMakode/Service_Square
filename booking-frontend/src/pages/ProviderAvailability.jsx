import React from 'react';
import { Link } from 'react-router-dom';

const schedule = [
  ['Mon', '9:00 AM', '6:00 PM', true],
  ['Tue', '9:00 AM', '6:00 PM', true],
  ['Wed', '10:00 AM', '5:00 PM', true],
  ['Thu', '9:00 AM', '6:00 PM', true],
  ['Fri', '9:00 AM', '3:00 PM', true],
  ['Sat', 'Emergency only', '2 slots', false],
  ['Sun', 'Closed', 'Off', false],
];

export default function ProviderAvailability() {
  return (
    <main className="bg-background min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed text-primary rounded-full text-sm font-bold mb-5">
              <span className="material-symbols-outlined text-lg">event_available</span>
              Provider Portal
            </span>
            <h1 className="text-5xl font-black tracking-tight text-on-surface mb-3">Availability</h1>
            <p className="text-on-surface-variant text-lg">Set working hours, blocked dates, and urgent booking preferences.</p>
          </div>
          <Link className="px-5 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20" to="/provider-panel">
            Save and return
          </Link>
        </div>

        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
          <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold">Weekly hours</h2>
              <button className="text-primary font-bold">Copy last week</button>
            </div>
            <div className="space-y-3">
              {schedule.map(([day, start, end, active]) => (
                <div className="grid grid-cols-[56px_1fr_auto] items-center gap-4 p-4 bg-surface-container-low rounded-xl" key={day}>
                  <div className="font-black text-on-surface">{day}</div>
                  <div className="text-sm text-on-surface-variant">
                    <span className="font-bold text-on-surface">{start}</span>
                    <span className="mx-2">to</span>
                    <span className="font-bold text-on-surface">{end}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" defaultChecked={active} type="checkbox" />
                    <span className="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></span>
                  </label>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm">
              <h2 className="text-xl font-extrabold mb-5">Blocked dates</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {['May 18', 'May 24', 'Jun 02'].map((date) => (
                  <div className="p-4 bg-error-container text-on-error-container rounded-xl" key={date}>
                    <span className="material-symbols-outlined mb-3">event_busy</span>
                    <p className="font-black">{date}</p>
                    <p className="text-sm opacity-80">Unavailable</p>
                  </div>
                ))}
              </div>
              <button className="mt-5 inline-flex items-center gap-2 px-5 py-3 bg-surface-container-low text-primary rounded-xl font-bold">
                <span className="material-symbols-outlined">add</span>
                Add blocked date
              </button>
            </section>

            <section className="bg-primary text-on-primary rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold opacity-80 mb-2">Booking mode</p>
                  <h2 className="text-3xl font-black mb-3">Accepting same-day jobs</h2>
                  <p className="opacity-80 max-w-xl">Customers can request open slots until 2 hours before your selected working window ends.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input className="sr-only peer" defaultChecked type="checkbox" />
                  <span className="w-12 h-7 bg-white/30 rounded-full peer peer-checked:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></span>
                </label>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
