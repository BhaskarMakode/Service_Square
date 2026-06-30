import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import apiClient from '../services/apiClient';
import { formatCurrency } from '../utils/currency';
import { useAuth } from '../context/AuthContext';

// Fix default leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapBoundsFit({ providerPos, customerPos }) {
  const map = useMap();
  useEffect(() => {
    if (providerPos && customerPos) {
      const bounds = L.latLngBounds([providerPos, customerPos]);
      map.fitBounds(bounds, { padding: [80, 80] });
    } else if (providerPos) {
      map.setView(providerPos, 14);
    }
  }, [providerPos, customerPos, map]);
  return null;
}

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'electrician': return 'electric_bolt';
    case 'ac-service':
    case 'ac': return 'ac_unit';
    case 'plumbing': return 'plumbing';
    case 'cleaning': return 'cleaning_services';
    case 'appliance': return 'home_appliance';
    case 'puncture-tyre': return 'build';
    default: return 'handyman';
  }
};

const customerIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
           <div class="absolute w-8 h-8 bg-rose-500 rounded-full border-2 border-white shadow-lg animate-ping opacity-75"></div>
           <div class="relative w-8 h-8 bg-rose-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
             <span class="material-symbols-outlined text-sm font-bold">person</span>
           </div>
         </div>`,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export default function LiveTracking() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || searchParams.get('id');
  const [booking, setBooking] = useState(null);
  const [customerCoords, setCustomerCoords] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab & Chat States
  const [activeTab, setActiveTab] = useState('tracking');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // Routing States
  const [routeCoords, setRouteCoords] = useState([]);
  const [durationMins, setDurationMins] = useState(null);

  const fetchRoadRoute = async (startLat, startLng, endLat, endLng) => {
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data && data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]); // [lat, lng]
        setRouteCoords(coords);
        
        const leg = data.routes[0].legs[0];
        if (leg) {
          setDistanceKm(Number((leg.distance / 1000).toFixed(2)));
          setDurationMins(Math.round(leg.duration / 60));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch road route from OSRM:', err);
      // Fallback to straight line
      setRouteCoords([[startLat, startLng], [endLat, endLng]]);
    }
  };

  const fetchMessages = async (bId) => {
    try {
      const res = await apiClient.get(`/chat/${bId}?limit=100`);
      if (res.data.success) {
        setMessages((res.data.data.messages || []).reverse());
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    if (!bookingId) return;
    fetchMessages(bookingId);

    const interval = setInterval(() => {
      fetchMessages(bookingId);
    }, 3000);

    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !bookingId) return;

    const text = newMessage;
    setNewMessage('');

    // Optimistic UI update
    const optimisticMessage = {
      _id: Date.now().toString(),
      message: text,
      senderId: { _id: user?._id, name: user?.name, avatar: user?.avatar },
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      await apiClient.post('/chat/send', {
        bookingId,
        message: text
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

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
    if (!booking) return;

    // 1. Customer Coordinates (destination/customer location)
    const savedCoords = booking.location?.coordinates;
    const hasSavedCoords = Array.isArray(savedCoords) && savedCoords.length === 2;
    const customerLocationObj = hasSavedCoords
      ? { latitude: savedCoords[1], longitude: savedCoords[0] }
      : null;

    if (customerLocationObj) {
      setCustomerCoords(customerLocationObj);
    }

    // 2. Active tracking interval/polling/watching
    let geoWatchId = null;
    let pollInterval = null;

    if (user?.role === 'provider') {
      // If Provider: track their own location via browser watchPosition and push to backend
      if (navigator.geolocation) {
        geoWatchId = navigator.geolocation.watchPosition(
          async (position) => {
            const providerLat = position.coords.latitude;
            const providerLng = position.coords.longitude;
            
            // Set local live provider location state
            setLiveLocation({
              location: {
                coordinates: [providerLng, providerLat]
              }
            });

            // Update live location on backend
            try {
              await apiClient.put('/location/update', {
                latitude: providerLat,
                longitude: providerLng
              });
            } catch (err) {
              console.warn('Failed to update provider live location on backend', err);
            }

            // Calculate distance to customer
            if (customerLocationObj) {
              const dist = calculateDistance(
                providerLat,
                providerLng,
                customerLocationObj.latitude,
                customerLocationObj.longitude
              );
              setDistanceKm(Number(dist.toFixed(2)));
            }
          },
          (err) => console.warn('Error watching provider position:', err),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      }
    } else {
      // If Customer: poll the provider's live location from backend
      const fetchProviderLocation = async () => {
        if (!booking.providerId?._id) return;
        try {
          const params = customerLocationObj || {};
          const res = await apiClient.get(`/location/provider/${booking.providerId._id}`, { params });
          if (res.data.success) {
            setLiveLocation(res.data.data.liveLocation);
            setDistanceKm(res.data.data.distanceKm);
          }
        } catch (err) {
          console.warn('Failed to fetch provider location:', err);
        }
      };

      fetchProviderLocation();
      pollInterval = setInterval(fetchProviderLocation, 5000);
    }

    return () => {
      if (geoWatchId !== null) navigator.geolocation.clearWatch(geoWatchId);
      if (pollInterval !== null) clearInterval(pollInterval);
    };
  }, [booking, user]);

  useEffect(() => {
    const providerCoords = liveLocation?.location?.coordinates || booking?.providerId?.location?.coordinates;
    const hasProviderCoords = Array.isArray(providerCoords) && providerCoords.length === 2;
    
    if (hasProviderCoords && customerCoords) {
      fetchRoadRoute(
        providerCoords[1],
        providerCoords[0],
        customerCoords.latitude,
        customerCoords.longitude
      );
    }
  }, [liveLocation, customerCoords, booking]);

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
  const providerPos = hasProviderCoords ? [providerCoords[1], providerCoords[0]] : null;
  const mapsUrl = hasProviderCoords && customerCoords
    ? (user?.role === 'provider'
        ? `https://www.google.com/maps/dir/?api=1&origin=${providerCoords[1]},${providerCoords[0]}&destination=${customerCoords.latitude},${customerCoords.longitude}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&origin=${customerCoords.latitude},${customerCoords.longitude}&destination=${providerCoords[1]},${providerCoords[0]}&travelmode=driving`)
    : null;

  const providerIcon = L.divIcon({
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute w-10 h-10 bg-indigo-600 rounded-2xl shadow-xl animate-pulse opacity-50"></div>
             <div class="relative w-10 h-10 bg-indigo-600 rounded-2xl border-2 border-white shadow-xl flex items-center justify-center text-white">
               <span class="material-symbols-outlined text-lg">${getCategoryIcon(serviceType)}</span>
             </div>
           </div>`,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  return (
    <main className="relative h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col md:flex-row">
      {/* Live Map Background */}
      <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-900">
        {hasProviderCoords ? (
          <MapContainer
            center={providerPos}
            zoom={14}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Provider Marker */}
            <Marker position={providerPos} icon={providerIcon}>
              <Popup>
                <div className="text-xs font-bold capitalize">{providerName} (Provider)</div>
              </Popup>
            </Marker>
            
            {/* Customer Marker */}
            {customerCoords && (
              <Marker position={[customerCoords.latitude, customerCoords.longitude]} icon={customerIcon}>
                <Popup>
                  <div className="text-xs font-bold">Your Location</div>
                </Popup>
              </Marker>
            )}

            {/* Road Route Polyline */}
            {routeCoords.length > 0 ? (
              <Polyline
                positions={routeCoords}
                color="#4F46E5"
                weight={6}
                lineCap="round"
                lineJoin="round"
              />
            ) : (
              customerCoords && providerPos && (
                <Polyline
                  positions={[providerPos, [customerCoords.latitude, customerCoords.longitude]]}
                  color="#4F46E5"
                  weight={4}
                  dashArray="5, 10"
                />
              )
            )}
            
            <MapBoundsFit 
              providerPos={providerPos} 
              customerPos={customerCoords ? [customerCoords.latitude, customerCoords.longitude] : null} 
            />
          </MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-100 dark:bg-slate-900">
            Map Coordinates Unavailable
          </div>
        )}
      </div>

      {/* Tracking Content Shell */}
      <div className="relative z-20 flex flex-col justify-end md:justify-start w-full md:w-[450px] p-4 md:p-8 h-full pointer-events-none">
        {/* Tab Buttons Card */}
        <div className="pointer-events-auto w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-1.5 shadow-xl mb-4 flex gap-1 border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'tracking'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <span className="material-symbols-outlined text-base">route</span>
            Live Route
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <span className="material-symbols-outlined text-base">chat_bubble</span>
            Chat Msg
          </button>
        </div>

        {activeTab === 'tracking' ? (
          <>
            {/* Live Status Progress Card */}
            <div className="pointer-events-auto w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl mb-6 ring-1 ring-white/20 dark:ring-slate-700">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Tracking Arrival</h2>
                  {durationMins !== null && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                      Estimated Arrival: {durationMins} mins
                    </p>
                  )}
                </div>
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
                <button onClick={() => setActiveTab('chat')} className="flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
                  <span className="material-symbols-outlined text-xl">chat_bubble</span>
                  Message
                </button>
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
          </>
        ) : (
          /* Live Chat Card */
          <div className="pointer-events-auto w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col h-[480px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                  src={
                    user?.role === 'provider'
                      ? booking.customerId?.avatar || `https://ui-avatars.com/api/?name=${booking.customerId?.name || 'C'}&background=4F46E5&color=fff`
                      : providerUser.avatar || `https://ui-avatars.com/api/?name=${providerName}&background=4F46E5&color=fff`
                  }
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white capitalize">
                    {user?.role === 'provider' ? booking.customerId?.name || 'Client' : providerName}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Active Session
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">chat</span>
                  <p className="text-sm font-medium">No messages yet. Send a greeting!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId?._id === user?._id || msg.senderId === user?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 font-bold">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </form>
          </div>
        )}
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

