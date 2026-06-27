import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { formatCurrency } from '../utils/currency';

export default function LiveTracking() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || searchParams.get('id');
  const [booking, setBooking] = useState(null);
  const [customerCoords, setCustomerCoords] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided');
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await apiClient.get(`/bookings/${bookingId}`);
        if (response.data.success) {
          setBooking(response.data.data.booking);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (!booking?.providerId?._id || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setCustomerCoords(coords);

        try {
          const res = await apiClient.get(`/location/provider/${booking.providerId._id}`, { params: coords });
          if (res.data.success) {
            setLiveLocation(res.data.data.liveLocation);
            setDistanceKm(res.data.data.distanceKm);
          }
        } catch (err) {
          console.warn('Live provider location unavailable, using profile location if present.', err);
        }
      },
      () => {
        setCustomerCoords(null);
      }
    );
  }, [booking]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading booking details...</div>;
  }

  if (error || !booking) {
    return <div className="min-h-screen flex items-center justify-center text-rose-500">{error || 'Booking not found'}</div>;
  }

  const { providerId: provider, serviceType, status, address, amount, scheduledStart } = booking;
  const providerUser = provider?.userId || {};
  const providerName = providerUser.name || 'Assigned Provider';
  const providerCoords = liveLocation?.location?.coordinates || provider?.location?.coordinates;
  const hasProviderCoords = Array.isArray(providerCoords) && providerCoords.length === 2;
  const mapsUrl = hasProviderCoords
    ? `https://www.google.com/maps/dir/?api=1${customerCoords ? `&origin=${customerCoords.latitude},${customerCoords.longitude}` : ''}&destination=${providerCoords[1]},${providerCoords[0]}&travelmode=driving`
    : null;

  return (
    <main className="relative h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col md:flex-row">
      {/* Live Map Background */}
      <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-900">
        <div className="w-full h-full grayscale opacity-40 mix-blend-multiply bg-slate-200 dark:bg-slate-800">
          {/* Placeholder for real map */}
        </div>
        {/* Simulated Map Markers */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            {/* Provider Marker */}
            <div className="absolute -top-12 -left-12 flex flex-col items-center">
              <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-2xl animate-bounce">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>electric_bolt</span>
              </div>
              <div className="mt-2 px-3 py-1 bg-white shadow-md rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-600">On the way</div>
            </div>
            {/* Destination Marker */}
            <div className="absolute top-20 left-40">
              <div className="w-6 h-6 bg-rose-500 rounded-full border-4 border-white shadow-xl"></div>
              <div className="mt-2 px-3 py-1 bg-white shadow-md rounded-full text-[10px] font-bold uppercase tracking-wider text-rose-500">Your Location</div>
            </div>
            {/* Path Simulation */}
            <svg className="absolute top-0 left-0 w-[400px] h-[300px] pointer-events-none opacity-40" viewBox="0 0 400 300">
              <path d="M 0 0 Q 150 50 200 200" fill="none" stroke="#4F46E5" strokeDasharray="8 8" strokeWidth="4"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Tracking Content Shell */}
      <div className="relative z-20 flex flex-col justify-end md:justify-start w-full md:w-[450px] p-4 md:p-8 h-full pointer-events-none">
        {/* Live Status Progress Card */}
        <div className="pointer-events-auto w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl mb-6 ring-1 ring-white/20 dark:ring-slate-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Tracking Arrival</h2>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full uppercase">{status}</span>
          </div>
          
          {/* Progress Stepper */}
          <div className="relative flex items-center justify-between mb-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-indigo-600 -translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg ring-4 ring-white dark:ring-slate-800">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Accepted</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg ring-4 ring-white dark:ring-slate-800">
                <span className="material-symbols-outlined text-xl">directions_run</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase">En Route</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 shadow-md ring-4 ring-white dark:ring-slate-800">
                <span className="material-symbols-outlined text-xl">home_pin</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Arrived</span>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600">
              <span className="material-symbols-outlined text-3xl">schedule</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Scheduled For</p>
              <p className="text-lg font-black text-indigo-600">{new Date(scheduledStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
        </div>

        {/* Provider Detail Card */}
        <div className="pointer-events-auto w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <img alt="Provider Profile" className="w-16 h-16 rounded-2xl object-cover shadow-md" src={providerUser.avatar || `https://ui-avatars.com/api/?name=${providerName}&background=4F46E5&color=fff`}/>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center border-2 border-white dark:border-slate-900">
                <span className="material-symbols-outlined text-[14px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{providerName}</h3>
              <p className="text-sm text-slate-500 capitalize">{serviceType} Professional</p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-bold rounded">VERIFIED</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95">
              <span className="material-symbols-outlined text-xl">call</span>
              Call
            </button>
            <Link to={`/chat?bookingId=${booking._id}`} className="flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
              Message
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Service Details</span>
              <span className="text-xs font-bold text-indigo-600">#{booking._id.slice(-6).toUpperCase()}</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{serviceType} Service</p>
            <p className="text-xs text-slate-500 mt-1">{address}</p>
            {distanceKm !== null && (
              <p className="text-xs text-indigo-600 font-bold mt-2">{distanceKm} km from your current location</p>
            )}
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">{formatCurrency(amount)}</p>
            {mapsUrl ? (
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
                <span className="material-symbols-outlined text-xl">route</span>
                Open Route in Google Maps
              </a>
            ) : (
              <p className="text-xs text-slate-500 mt-4">Provider map coordinates are not available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Float Control (Right Side Desktop) */}
      <div className="hidden md:flex flex-col gap-4 absolute top-8 right-8 z-30">
        <button className="w-14 h-14 bg-white dark:bg-slate-800 shadow-xl rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors pointer-events-auto">
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>
    </main>
  );
}

