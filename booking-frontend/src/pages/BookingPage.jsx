import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BackButton from '../components/BackButton';
import { addressApi, availabilityApi, bookingsApi, paymentsApi, providersApi } from '../services/serviceApi';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatRate } from '../utils/currency';

// Fix default leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position[0] && position[1] ? (
    <Marker position={position} />
  ) : null;
}

const durationMinutes = 120;
const formatAddress = (item) => [item.houseNo, item.street, item.landmark, item.city, item.state, item.pincode].filter(Boolean).join(', ');

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const providerId = searchParams.get('providerId');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [provider, setProvider] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [selectedService, setSelectedService] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [savedAddresses, setSavedAddresses] = useState([]);

  const [latitude, setLatitude] = useState(23.259933);
  const [longitude, setLongitude] = useState(77.412613);
  const [mapCenter, setMapCenter] = useState([23.259933, 77.412613]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.log('Geolocation failed', err)
      );
    }
  }, []);

  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index + 1);
      const value = date.toISOString().split('T')[0];
      return {
        value,
        day: date.getDate(),
        month: date.toLocaleString('en-US', { month: 'short' }),
        weekday: date.toLocaleString('en-US', { weekday: 'short' })
      };
    });
  }, []);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/booking?providerId=${providerId || ''}`)}`);
      return;
    }

    if (!providerId) {
      setError('No provider selected.');
      setLoading(false);
      return;
    }

    fetchProviderDetails();
    addressApi.list().then((res) => {
      const items = res.data.data.addresses || [];
      setSavedAddresses(items);
      const selected = items.find((item) => item.isDefault) || items[0];
      if (selected) setAddress(formatAddress(selected));
    }).catch(() => setSavedAddresses([]));
  }, [providerId, user, navigate]);

  useEffect(() => {
    if (!providerId || !selectedDate) return;
    const duration = selectedService ? selectedService.duration : durationMinutes;
    fetchSlots(selectedDate, duration);
  }, [providerId, selectedDate, selectedService]);

  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await providersApi.details(providerId);
      const nextProvider = res.data.data.provider;
      setProvider(nextProvider);
      setSelectedDate(dates[0]?.value || '');

      const activeServices = nextProvider.services?.filter(s => s.isActive) || [];
      const queryServiceId = searchParams.get('serviceId');
      
      let initialService = null;
      if (queryServiceId && activeServices.length > 0) {
        initialService = activeServices.find(s => s._id === queryServiceId);
      }
      if (!initialService && activeServices.length > 0) {
        initialService = activeServices[0];
      }

      if (initialService) {
        setSelectedService(initialService);
        setServiceType(initialService.title);
      } else {
        setSelectedService(null);
        setServiceType(nextProvider.category);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load provider.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (date, duration) => {
    try {
      setSlotsLoading(true);
      setSelectedSlot(null);
      const res = await availabilityApi.slots(providerId, { date, durationMinutes: duration });
      setSlots(res.data.data.slots || []);
    } catch (err) {
      setSlots([]);
      setError(err.response?.data?.message || err.message || 'Failed to load available slots.');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBooking = async (event) => {
    event.preventDefault();

    if (!selectedSlot || !address.trim()) {
      setError('Please select a date, time slot, and service address.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        providerId: provider._id,
        serviceType: serviceType || provider.category,
        scheduledStart: selectedSlot.start,
        scheduledEnd: selectedSlot.end,
        address,
        amount: totalDue,
        paymentMethod: paymentMethod === 'cash' ? 'cash' : 'razorpay',
        notes,
        latitude,
        longitude
      };

      const bookingRes = await bookingsApi.create(payload);
      const booking = bookingRes.data.data.booking;

      if (paymentMethod === 'online') {
        const intentRes = await paymentsApi.createIntent({
          bookingId: booking._id,
          paymentMethod: 'razorpay'
        });
        const { paymentId, clientSecret, gateway } = intentRes.data.data;

        if (gateway?.provider === 'razorpay') {
          const keyRes = await paymentsApi.razorpayKey();
          const key = keyRes.data?.data?.key;
          const scriptReady = await loadRazorpayScript();

          if (!scriptReady || !key) {
            throw new Error('Razorpay checkout is not available. Please try again or choose cash.');
          }

          await new Promise((resolve, reject) => {
            const checkout = new window.Razorpay({
              key,
              amount: Math.round(totalDue * 100),
              currency: gateway.currency || 'INR',
              name: 'Service Square',
              description: `${serviceType || provider.category} booking`,
              order_id: gateway.orderId,
              prefill: {
                name: user?.name || '',
                contact: user?.phone || '',
                email: user?.email || ''
              },
              handler: async (response) => {
                try {
                  await paymentsApi.verify({
                    paymentId,
                    transactionId: response.razorpay_payment_id,
                    signature: response.razorpay_signature
                  });
                  resolve();
                } catch (verifyError) {
                  reject(verifyError);
                }
              },
              modal: {
                ondismiss: () => reject(new Error('Payment was cancelled.'))
              }
            });

            checkout.open();
          });
        } else {
          await paymentsApi.verify({
            paymentId,
            clientSecret,
            transactionId: `mock_txn_${Date.now()}`
          });
        }
      }

      navigate(`/confirmation?bookingId=${booking._id}`, { state: { bookingId: booking._id } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading booking details...</div>;
  }

  if (error && !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-red-500 font-bold">{error}</div>
        <Link to="/services" className="text-indigo-600 underline">Back to Services</Link>
      </div>
    );
  }

  const name = provider.userId?.name || provider.fullName || 'Provider';
  const avatarUrl = provider.userId?.avatar || `https://ui-avatars.com/api/?name=${name}&background=4F46E5&color=fff&size=512`;
  
  const isCustomService = !!selectedService;
  const rate = isCustomService ? selectedService.price : (provider.hourlyRate || 0);
  const duration = isCustomService ? selectedService.duration : durationMinutes;
  const estimatedHours = duration / 60;
  const baseFee = isCustomService ? selectedService.price : (rate * estimatedHours);
  const processingFee = Math.round(baseFee * 0.08 * 100) / 100;
  const totalDue = baseFee + processingFee;

  return (
    <div className="antialiased text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 font-body min-h-screen">
      <header className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none h-20 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
          <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400">Service Square</Link>
          <BackButton fallback="/service-listing" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100 flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">Confirm Your Appointment</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">Select a live slot and choose how you want to pay for the service.</p>
            </div>

            <form className="space-y-8" onSubmit={handleBooking}>
              <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">category</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Service Details</h2>
                </div>
                {provider.services && provider.services.filter(s => s.isActive).length > 0 ? (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Select Service Offering</label>
                    <select
                      value={selectedService?._id || ''}
                      onChange={(e) => {
                        const s = provider.services.find(item => item._id === e.target.value);
                        setSelectedService(s);
                        setServiceType(s ? s.title : provider.category);
                      }}
                      className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl capitalize font-bold outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      {provider.services.filter(s => s.isActive).map(s => (
                        <option key={s._id} value={s._id}>
                          {s.title} ({formatCurrency(s.price)} - {s.duration} mins)
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input readOnly value={serviceType} className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl capitalize outline-none" />
                )}
              </section>

              <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">calendar_today</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Schedule</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <span className="block text-sm font-semibold ml-1 mb-3 text-slate-600 dark:text-slate-400">Preferred Date</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                      {dates.map((date) => (
                        <button key={date.value} type="button" onClick={() => setSelectedDate(date.value)} className={`p-4 rounded-2xl border-2 transition-all text-center active:scale-95 ${selectedDate === date.value ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-indigo-300'}`}>
                          <span className={`block text-xs uppercase font-bold ${selectedDate === date.value ? 'text-indigo-600' : 'text-slate-500'}`}>{date.weekday}</span>
                          <span className={`block text-xl font-black ${selectedDate === date.value ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>{date.day}</span>
                          <span className="block text-xs text-slate-500">{date.month}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-sm font-semibold ml-1 mb-3 text-slate-600 dark:text-slate-400">Available Times</span>
                    {slotsLoading ? (
                      <div className="py-8 text-center text-slate-500 animate-pulse">Loading available slots...</div>
                    ) : slots.length === 0 ? (
                      <div className="py-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-500 border border-dashed border-slate-200 dark:border-slate-700">No slots available for this date.</div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {slots.map((slot) => (
                          <button key={slot.start} type="button" onClick={() => setSelectedSlot(slot)} className={`py-3 px-4 rounded-xl font-semibold text-center transition-all active:scale-95 border-2 ${selectedSlot?.start === slot.start ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-transparent bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-300'}`}>
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">location_on</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Service Location</h2>
                </div>
                {savedAddresses.length > 0 && <select value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"><option value="">Select a saved address</option>{savedAddresses.map((item) => <option key={item._id} value={formatAddress(item)}>{item.fullName}: {formatAddress(item)}</option>)}</select>}
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 placeholder:text-slate-400 transition-all" placeholder="Full service address" type="text" required />
                
                <div className="space-y-3 pt-2">
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 block">Pin Location on Map (Required for Live Tracking)</label>
                  <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-10">
                    <MapContainer
                      center={mapCenter}
                      zoom={14}
                      className="w-full h-full"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker
                        position={[latitude, longitude]}
                        setPosition={(pos) => {
                          setLatitude(pos[0]);
                          setLongitude(pos[1]);
                        }}
                      />
                      <MapRecenter center={[latitude, longitude]} />
                    </MapContainer>
                  </div>
                  <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">info</span>
                    Selected Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)} (Click anywhere on the map to place the pin)
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">payments</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Payment Option</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[['cash', 'Cash After Booking', 'Pay the provider after the service is completed.'], ['online', 'Online Payment', 'Pay securely with Razorpay when configured.']].map(([value, title, desc]) => (
                    <button key={value} type="button" onClick={() => setPaymentMethod(value)} className={`text-left p-5 rounded-2xl border-2 transition-all ${paymentMethod === value ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-indigo-300'}`}>
                      <div className="font-black text-slate-900 dark:text-white">{title}</div>
                      <p className="text-sm text-slate-500 mt-1">{desc}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-600 placeholder:text-slate-400 transition-all resize-none" placeholder="Any specific requirements or access details for the provider..." rows="4" />
              </section>
            </form>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-32 pb-10">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
              <h3 className="text-2xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">Order Summary</h3>
              <div className="flex items-center gap-4 mb-8 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                <img className="w-16 h-16 rounded-xl object-cover bg-indigo-50" src={avatarUrl} alt={name} />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white capitalize">{name}</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span className="text-sm font-bold text-slate-500">{provider.rating || 'New'} ({provider.reviewsCount || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium"><span>Rate</span><span className="text-slate-900 dark:text-white">{formatRate(rate)}</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium"><span>Estimated Time</span><span className="text-slate-900 dark:text-white">{estimatedHours} hours</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium"><span>Base Service Fee</span><span className="text-slate-900 dark:text-white">{formatCurrency(baseFee)}</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium"><span>Processing Tax (8%)</span><span className="text-slate-900 dark:text-white">{formatCurrency(processingFee)}</span></div>
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                <div className="flex justify-between items-center"><span className="text-xl font-black text-slate-900 dark:text-white">Total Due</span><span className="text-2xl font-black text-indigo-600">{formatCurrency(totalDue)}</span></div>
              </div>

              <button onClick={handleBooking} disabled={submitting || !selectedSlot} className="block w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-center text-lg font-black rounded-2xl shadow-xl shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98] transition-all mb-4 disabled:opacity-70 disabled:cursor-not-allowed">
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
              <p className="text-center text-xs text-slate-500 font-medium leading-relaxed">
                {paymentMethod === 'cash' ? 'Cash bookings stay unpaid until service completion.' : 'Online payment opens Razorpay when configured, with mock fallback in development.'}
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
