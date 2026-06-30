import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

const defaultSchedule = [
  { day: 'monday', startTime: '09:00', endTime: '18:00', active: true },
  { day: 'tuesday', startTime: '09:00', endTime: '18:00', active: true },
  { day: 'wednesday', startTime: '10:00', endTime: '17:00', active: true },
  { day: 'thursday', startTime: '09:00', endTime: '18:00', active: true },
  { day: 'friday', startTime: '09:00', endTime: '15:00', active: true },
  { day: 'saturday', startTime: '10:00', endTime: '14:00', active: false },
  { day: 'sunday', startTime: '10:00', endTime: '14:00', active: false },
];

export default function ProviderAvailability() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isOnline, setIsOnline] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [schedule, setSchedule] = useState(defaultSchedule);

  // Blocked Dates States
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [showAddDateInput, setShowAddDateInput] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'provider') {
      navigate('/');
      return;
    }
    fetchAvailability();
  }, [user, navigate]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const profileRes = await apiClient.get('/auth/profile');
      if (profileRes.data.success && profileRes.data.data.providerProfile) {
        const providerId = profileRes.data.data.providerProfile._id;
        const availRes = await apiClient.get(`/availability/provider/${providerId}`);
        
        if (availRes.data.success && availRes.data.data.availability) {
          const availability = availRes.data.data.availability;
          setIsOnline(availability.isOnline);
          setIsAvailable(availability.isAvailable);
          
          if (availability.blockedDates) {
            setBlockedDates(availability.blockedDates);
          }
          
          if (availability.workingHours && availability.workingHours.length > 0) {
            // merge fetched working hours with default schedule (for active vs inactive)
            const activeDays = availability.workingHours.map(wh => wh.day);
            setSchedule(prev => prev.map(dayObj => {
              const fetchedDay = availability.workingHours.find(wh => wh.day === dayObj.day);
              if (fetchedDay) {
                return { ...dayObj, startTime: fetchedDay.startTime, endTime: fetchedDay.endTime, active: true };
              }
              return { ...dayObj, active: false };
            }));
          } else {
            // If empty array, it means no working hours are active, set all active to false
            if (availability.workingHours && availability.workingHours.length === 0) {
              setSchedule(prev => prev.map(dayObj => ({...dayObj, active: false})));
            }
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch availability.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = (dayName) => {
    setSchedule(prev => prev.map(dayObj => 
      dayObj.day === dayName ? { ...dayObj, active: !dayObj.active } : dayObj
    ));
  };

  const handleTimeChange = (dayName, field, value) => {
    setSchedule(prev => prev.map(dayObj => 
      dayObj.day === dayName ? { ...dayObj, [field]: value } : dayObj
    ));
  };

  const handleToggleOnlineStatus = async () => {
    try {
      const newOnline = !isOnline;
      const newAvailable = newOnline; // going online makes provider available; offline makes them unavailable
      const res = await apiClient.put('/availability/toggle', { isOnline: newOnline, isAvailable: newAvailable });
      if (res.data.success) {
        setIsOnline(res.data.data.availability.isOnline);
        setIsAvailable(res.data.data.availability.isAvailable);
      }
    } catch (err) {
      alert('Failed to toggle status.');
    }
  };

  const handleToggleAvailabilityStatus = async () => {
    try {
      const newAvailable = !isAvailable;
      const res = await apiClient.put('/availability/toggle', { isOnline, isAvailable: newAvailable });
      if (res.data.success) {
        setIsAvailable(res.data.data.availability.isAvailable);
      }
    } catch (err) {
      alert('Failed to toggle availability.');
    }
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    if (blockedDates.includes(newBlockedDate)) {
      alert("This date is already blocked.");
      return;
    }
    setBlockedDates(prev => [...prev, newBlockedDate].sort());
    setNewBlockedDate('');
    setShowAddDateInput(false);
  };

  const handleRemoveBlockedDate = (dateToRemove) => {
    setBlockedDates(prev => prev.filter(d => d !== dateToRemove));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const activeWorkingHours = schedule.filter(d => d.active).map(d => ({
        day: d.day,
        startTime: d.startTime,
        endTime: d.endTime
      }));
      
      await Promise.all([
        apiClient.put('/availability/working-hours', { workingHours: activeWorkingHours }),
        apiClient.put('/availability/blocked-dates', { blockedDates })
      ]);
      navigate('/provider-panel');
    } catch (err) {
      alert(err.message || 'Failed to save working hours');
    } finally {
      setLoading(false);
    }
  };

  const formatDateDisplay = (dateStr) => {
    try {
      const d = new Date(`${dateStr}T00:00:00`);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 animate-pulse">Loading availability...</div>;
  }

  return (
    <main className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-white font-body">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-bold mb-5 shadow-sm border border-indigo-200 dark:border-indigo-800">
              <span className="material-symbols-outlined text-lg">event_available</span>
              Provider Portal
            </span>
            <h1 className="text-5xl font-black tracking-tight mb-3">Availability</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">Set working hours, toggle your online presence, and manage your capacity to receive new booking requests.</p>
          </div>
          <button onClick={handleSave} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all w-full lg:w-auto text-center">
            Save and return
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-2xl font-extrabold flex items-center gap-3">
                <span className="material-symbols-outlined text-indigo-500">schedule</span>
                Weekly hours
              </h2>
            </div>
            <div className="space-y-4 flex-1">
              {schedule.map((dayObj) => (
                <div className={`grid grid-cols-[100px_1fr_auto] sm:grid-cols-[100px_1fr_auto] items-center gap-4 p-5 rounded-xl border transition-all ${dayObj.active ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-900 border-transparent opacity-75 grayscale'}`} key={dayObj.day}>
                  <div className="font-bold capitalize text-slate-700 dark:text-slate-300">{dayObj.day}</div>
                  
                  {dayObj.active ? (
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                      <input 
                        type="time" 
                        value={dayObj.startTime}
                        onChange={(e) => handleTimeChange(dayObj.day, 'startTime', e.target.value)}
                        className="bg-white dark:bg-slate-800 text-sm font-bold px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      />
                      <span className="text-slate-400 font-medium">to</span>
                      <input 
                        type="time" 
                        value={dayObj.endTime}
                        onChange={(e) => handleTimeChange(dayObj.day, 'endTime', e.target.value)}
                        className="bg-white dark:bg-slate-800 text-sm font-bold px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      />
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-slate-400 italic">Unavailable</div>
                  )}

                  <label className="relative inline-flex items-center cursor-pointer ml-auto">
                    <input className="sr-only peer" checked={dayObj.active} onChange={() => handleToggleActive(dayObj.day)} type="checkbox" />
                    <span className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full border border-slate-300 dark:border-slate-600 peer-checked:border-indigo-600"></span>
                  </label>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-8 flex flex-col">
            <section className={`rounded-2xl p-8 shadow-sm transition-all flex items-center justify-between gap-6 ${isOnline ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
              <div>
                <p className="text-sm font-bold opacity-80 mb-2 uppercase tracking-wider">Online Presence</p>
                <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                  {isOnline ? 'You are Online' : 'You are Offline'}
                  {isOnline && <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>}
                </h2>
                <p className="opacity-90 max-w-sm text-sm">
                  {isOnline ? 'Your profile is visible and customers can request bookings.' : 'You are hidden from search results. No new requests.'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 scale-125 origin-right">
                <input className="sr-only peer" checked={isOnline} onChange={handleToggleOnlineStatus} type="checkbox" />
                <span className="w-12 h-7 bg-black/20 dark:bg-black/40 rounded-full peer peer-checked:bg-white/20 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></span>
              </label>
            </section>

            <section className={`rounded-2xl p-8 shadow-sm transition-all flex items-center justify-between gap-6 ${isAvailable ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`} style={{ opacity: isOnline ? 1 : 0.6, pointerEvents: isOnline ? 'auto' : 'none' }}>
              <div>
                <p className="text-sm font-bold opacity-80 mb-2 uppercase tracking-wider">Booking Availability</p>
                <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                  {isAvailable ? 'Accepting Bookings' : 'Busy / Fully Booked'}
                </h2>
                <p className="opacity-90 max-w-sm text-sm">
                  {isAvailable ? 'Customers can book your services for available times.' : 'Your profile shows as Busy. No new requests.'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 scale-125 origin-right">
                <input className="sr-only peer" checked={isAvailable} disabled={!isOnline} onChange={handleToggleAvailabilityStatus} type="checkbox" />
                <span className="w-12 h-7 bg-black/20 dark:bg-black/40 rounded-full peer peer-checked:bg-white/20 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></span>
              </label>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-rose-500">event_busy</span>
                <h2 className="text-xl font-extrabold">Blocked dates</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Upcoming dates where you have marked yourself unavailable for the entire day.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {blockedDates.map((dateStr) => (
                  <div className="relative p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/50 flex flex-col items-center justify-center text-center group" key={dateStr}>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlockedDate(dateStr)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-rose-100 hover:bg-rose-200 dark:bg-rose-800 dark:hover:bg-rose-700 text-rose-600 dark:text-rose-300 md:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                    <span className="material-symbols-outlined mb-2 opacity-80">block</span>
                    <p className="font-black text-sm">{formatDateDisplay(dateStr)}</p>
                    <p className="text-[10px] opacity-75">{dateStr.split('-')[0]}</p>
                  </div>
                ))}
                {showAddDateInput ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2">
                    <input
                      type="date"
                      value={newBlockedDate}
                      onChange={(e) => setNewBlockedDate(e.target.value)}
                      className="w-full text-xs p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded text-slate-850 dark:text-white focus:outline-none"
                    />
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={handleAddBlockedDate}
                        className="flex-1 py-1 px-2 bg-indigo-600 text-white rounded text-[11px] font-bold hover:bg-indigo-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => { setShowAddDateInput(false); setNewBlockedDate(''); }}
                        className="flex-1 py-1 px-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-350 rounded text-[11px] font-bold hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowAddDateInput(true)} className="p-4 bg-slate-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex flex-col items-center justify-center gap-2 group">
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
                    <span className="font-bold text-sm">Add Date</span>
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
