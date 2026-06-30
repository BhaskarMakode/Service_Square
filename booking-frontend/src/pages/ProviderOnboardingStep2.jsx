import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesApi } from '../services/serviceApi';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const PREDEFINED_CATEGORIES = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Repair', 'Appliance Repair', 
  'Cleaning', 'Pest Control', 'Beauty Services', 'Salon Services', 'Home Tutor', 
  'Fitness Trainer', 'Photographer', 'Event Planner', 'Driver'
];

export default function ProviderOnboardingStep2() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [address, setAddress] = useState('');
  const [loadingCats, setLoadingCats] = useState(true);
  const [latitude, setLatitude] = useState(23.259933);
  const [longitude, setLongitude] = useState(77.412613);
  const [mapCenter, setMapCenter] = useState([23.259933, 77.412613]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCats(true);
        const res = await categoriesApi.list({ limit: 100 });
        setCategories(res.data.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoadingCats(false);
      }
    };
    loadCategories();

    // Restore from localStorage if returning
    setCategory(localStorage.getItem('onboarding_category') || '');
    setExperience(localStorage.getItem('onboarding_experience') || '');
    setDescription(localStorage.getItem('onboarding_description') || '');
    setHourlyRate(localStorage.getItem('onboarding_hourlyRate') || '');
    setAddress(localStorage.getItem('onboarding_address') || '');

    const savedLat = localStorage.getItem('onboarding_latitude');
    const savedLng = localStorage.getItem('onboarding_longitude');
    if (savedLat && savedLng) {
      const parsedLat = parseFloat(savedLat);
      const parsedLng = parseFloat(savedLng);
      setLatitude(parsedLat);
      setLongitude(parsedLng);
      setMapCenter([parsedLat, parsedLng]);
    } else if (navigator.geolocation) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category) {
      alert("Please select a service category.");
      return;
    }
    if (!experience || Number(experience) < 0) {
      alert("Please enter valid years of experience.");
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      alert("Please provide a description of your services (minimum 10 characters).");
      return;
    }
    if (!hourlyRate || Number(hourlyRate) <= 0) {
      alert("Please enter a valid hourly rate.");
      return;
    }
    if (!address.trim()) {
      alert("Please enter your business or service address.");
      return;
    }

    localStorage.setItem('onboarding_category', category);
    localStorage.setItem('onboarding_experience', experience);
    localStorage.setItem('onboarding_description', description);
    localStorage.setItem('onboarding_hourlyRate', hourlyRate);
    localStorage.setItem('onboarding_address', address);
    localStorage.setItem('onboarding_latitude', latitude);
    localStorage.setItem('onboarding_longitude', longitude);

    navigate('/onboarding-3');
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-between relative">
            {/* Progress Line Background */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-high -translate-y-1/2 z-0"></div>
            {/* Progress Line Active */}
            <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"></div>
            {/* Step 1: Completed */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant">Identity</span>
            </div>
            {/* Step 2: Active */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest border-2 border-primary text-primary flex items-center justify-center shadow-xl step-active">
                <span className="material-symbols-outlined text-sm">handyman</span>
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-primary">Service Details</span>
            </div>
            {/* Step 3: Pending */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">event_available</span>
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant opacity-50">Availability</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-xl mx-auto">
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-[0_32px_64px_-12px_rgba(53,37,205,0.06)] border border-outline-variant/10">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">Define Your Expertise</h1>
              <p className="text-on-surface-variant body-lg leading-relaxed">Tell us about the services you provide and your background in the industry.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Category Dropdown */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-on-surface ml-1">Service Category</label>
                <div className="relative group">
                  <input 
                    list="service-categories-list"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container-high border-none rounded-xl py-4 px-5 pr-12 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all appearance-none capitalize"
                    placeholder="Search or type your trade..."
                    required
                  />
                  <datalist id="service-categories-list">
                    {PREDEFINED_CATEGORIES.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                    {!loadingCats && categories.map((cat) => (
                      <option key={cat._id} value={cat.name} />
                    ))}
                  </datalist>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                </div>
              </div>

              {/* Years of Experience */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-on-surface ml-1">Years of Professional Experience</label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-high border-none rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all" 
                    min="0" 
                    placeholder="e.g. 5" 
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">Years</div>
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-on-surface ml-1">Hourly Service Rate (INR ₹)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-primary">₹</span>
                  <input 
                    className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-10 pr-5 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all" 
                    min="1" 
                    placeholder="500" 
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">/ hour</div>
                </div>
              </div>

              {/* Business / Service Address */}
              <div className="space-y-2.5">
                <label className="block text-sm font-semibold text-on-surface ml-1">Service Base Address</label>
                <input 
                  className="w-full bg-surface-container-high border-none rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all" 
                  placeholder="e.g., Shop 4, Karond Square, Bhopal" 
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* Pin Location on Map */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 block ml-1">Pin Your Service Location on Map (Required for Live Tracking)</label>
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
                <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 ml-1">
                  <span className="material-symbols-outlined text-[14px] text-indigo-600">info</span>
                  Selected Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)} (Click anywhere on the map to place the pin)
                </div>
              </div>

              {/* Service Description */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-sm font-semibold text-on-surface">Service Description / Bio</label>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Min 10 characters</span>
                </div>
                <textarea 
                  className="w-full bg-surface-container-high border-none rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all resize-none" 
                  placeholder="Highlight your specific skills, certifications, or the areas you specialize in..." 
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button 
                  type="button"
                  onClick={() => navigate('/onboarding-1')}
                  className="flex-1 order-2 sm:order-1 py-4 px-8 rounded-xl text-on-surface-variant font-semibold hover:bg-surface-container transition-colors active:scale-[0.98] duration-200 block text-center bg-slate-100"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] order-1 sm:order-2 py-4 px-8 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Continue to Availability
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <div className="h-20 md:hidden"></div>
    </>
  );
}
