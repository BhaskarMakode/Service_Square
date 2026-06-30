import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

export default function ProviderOnboardingStep3() {
  const { register, loadProfile } = useAuth();
  const navigate = useNavigate();

  const [workingDays, setWorkingDays] = useState({
    monday: { active: true, startTime: '09:00', endTime: '17:00' },
    tuesday: { active: true, startTime: '09:00', endTime: '17:00' },
    wednesday: { active: false, startTime: '09:00', endTime: '17:00' },
    thursday: { active: true, startTime: '09:00', endTime: '17:00' },
    friday: { active: true, startTime: '09:00', endTime: '17:00' },
    saturday: { active: false, startTime: '09:00', endTime: '17:00' },
    sunday: { active: false, startTime: '09:00', endTime: '17:00' }
  });

  const [selectedDay, setSelectedDay] = useState('monday');
  const [submitting, setSubmitting] = useState(false);
  const [coords, setCoords] = useState(() => {
    const lat = localStorage.getItem('onboarding_latitude');
    const lng = localStorage.getItem('onboarding_longitude');
    return {
      latitude: lat ? parseFloat(lat) : 23.2966,
      longitude: lng ? parseFloat(lng) : 77.4098
    };
  });
  const [documentType, setDocumentType] = useState('government_id');
  const [documentFile, setDocumentFile] = useState(null);

  useEffect(() => {
    const lat = localStorage.getItem('onboarding_latitude');
    const lng = localStorage.getItem('onboarding_longitude');
    if (lat && lng) {
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation blocked or failed. Using fallback Bhopal coordinates.', error);
        }
      );
    }
  }, []);

  const handleToggleDay = (dayKey) => {
    setWorkingDays(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        active: !prev[dayKey].active
      }
    }));
  };

  const handleTimeChange = (type, val) => {
    setWorkingDays(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [type]: val
      }
    }));
  };

  const handleComplete = async () => {
    try {
      setSubmitting(false);

      const name = localStorage.getItem('onboarding_name');
      const email = localStorage.getItem('onboarding_email');
      const category = localStorage.getItem('onboarding_category');
      const experienceRaw = localStorage.getItem('onboarding_experience');
      const description = localStorage.getItem('onboarding_description');
      const hourlyRateRaw = localStorage.getItem('onboarding_hourlyRate');
      const address = localStorage.getItem('onboarding_address');

      if (!category || experienceRaw === null || experienceRaw === '' || hourlyRateRaw === null || hourlyRateRaw === '' || !address) {
        alert("Some onboarding details are missing. Please start over from step 1.");
        navigate('/onboarding-1');
        return;
      }

      if (!documentFile) {
        alert("Please upload a government ID or required verification document.");
        return;
      }

      const experience = parseInt(experienceRaw, 10);
      const hourlyRate = parseFloat(hourlyRateRaw);


      setSubmitting(true);

      // 1. Complete user profile updates
      await register({
        name,
        email,
        role: 'provider'
      });

      // 2. Create provider profile (using category as fallback skill to satisfy array validation)
      const profilePayload = {
        category,
        skills: [category],
        hourlyRate,
        experience,
        address,
        latitude: coords.latitude,
        longitude: coords.longitude,
        availabilityStatus: 'available'
      };

      try {
        await apiClient.post('/providers/create-profile', profilePayload);
      } catch (err) {
        if (err.response?.status !== 409) {
          throw err;
        }
      }

      // 3. Set working hours
      const workingHours = Object.keys(workingDays)
        .filter(day => workingDays[day].active)
        .map(day => ({
          day,
          startTime: workingDays[day].startTime,
          endTime: workingDays[day].endTime
        }));

      if (workingHours.length > 0) {
        await apiClient.put('/availability/working-hours', { workingHours });
      }

      // 4. Upload verification document for admin review
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('document', documentFile);
      await apiClient.post('/verification/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 5. Clean up local storage
      localStorage.removeItem('onboarding_name');
      localStorage.removeItem('onboarding_email');
      localStorage.removeItem('onboarding_category');
      localStorage.removeItem('onboarding_experience');
      localStorage.removeItem('onboarding_description');
      localStorage.removeItem('onboarding_hourlyRate');
      localStorage.removeItem('onboarding_address');
      localStorage.removeItem('onboarding_latitude');
      localStorage.removeItem('onboarding_longitude');

      // 6. Reload user profile context
      await loadProfile();

      // 7. Navigate to verification status screen
      navigate('/verification-status');

    } catch (err) {
      console.error('Failed to complete onboarding registration:', err);
      alert(err.response?.data?.message || err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>


      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Progress Indicator Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
            {/* Step 1: Identity */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <span className="text-label text-on-surface-variant text-sm font-medium tracking-wide">Identity</span>
            </div>
            <div className="h-[2px] flex-1 mx-4 bg-primary-fixed"></div>
            {/* Step 2: Services */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <span className="text-label text-on-surface-variant text-sm font-medium tracking-wide">Services</span>
            </div>
            <div className="h-[2px] flex-1 mx-4 bg-primary-fixed"></div>
            {/* Step 3: Availability */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">event_available</span>
              </div>
              <span className="text-label text-on-surface font-bold text-sm tracking-wide">Availability</span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface mb-4">Set your rhythm.</h1>
            <p className="text-on-surface-variant body-lg max-w-lg mx-auto">Configure when you're available to accept bookings. You can always refine these later.</p>
          </div>
        </div>

        {/* Selection Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Day Selection */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-headline font-bold text-on-surface px-2">Work Days</h2>
            <div className="grid grid-cols-1 gap-3">
              {DAYS_OF_WEEK.map((day) => {
                const config = workingDays[day.key];
                const isSelected = selectedDay === day.key;
                return (
                  <div
                    key={day.key}
                    onClick={() => setSelectedDay(day.key)}
                    className={`group p-5 rounded-xl border flex items-center justify-between transition-all hover:shadow-md cursor-pointer ${
                      isSelected
                        ? 'bg-surface-container-lowest border-primary ring-2 ring-primary'
                        : config.active
                        ? 'bg-surface-container-lowest border-outline-variant/15'
                        : 'bg-surface-container-low border-transparent opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleDay(day.key);
                        }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          config.active
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined">
                          {day.key === 'saturday' || day.key === 'sunday' ? 'weekend' : 'calendar_today'}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface capitalize">{day.label}</p>
                        <p className="text-xs text-on-surface-variant">
                          {config.active ? `${config.startTime} - ${config.endTime}` : 'Unavailable'}
                        </p>
                      </div>
                    </div>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleDay(day.key);
                      }}
                      className="material-symbols-outlined text-primary"
                      style={{ fontVariationSettings: config.active ? "'FILL' 1" : undefined }}
                    >
                      {config.active ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Time Slot Selector */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <header className="relative z-10 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Configure Hours</span>
                <h2 className="text-3xl font-headline font-extrabold text-on-surface capitalize">{selectedDay} Hours</h2>
              </div>
            </header>

            <div className="relative z-10 space-y-6">
              {!workingDays[selectedDay].active ? (
                <div className="p-8 text-center bg-surface-container-highest/20 rounded-2xl border border-dashed border-outline-variant/30">
                  <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">info</span>
                  <p className="font-semibold text-on-surface mb-1">Unavailable on {selectedDay}</p>
                  <p className="text-sm text-on-surface-variant mb-4">Toggle the day checkbox to enable availability and set hours.</p>
                  <button
                    onClick={() => handleToggleDay(selectedDay)}
                    className="px-6 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-xl transition-all active:scale-95"
                  >
                    Enable {selectedDay}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Start Time Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-on-surface">Start Time</label>
                    <select
                      value={workingDays[selectedDay].startTime}
                      onChange={(e) => handleTimeChange('startTime', e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3.5 px-4 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:outline-none"
                    >
                      {Array.from({ length: 24 }).map((_, h) => {
                        const val = `${String(h).padStart(2, '0')}:00`;
                        return <option key={val} value={val}>{val}</option>;
                      })}
                    </select>
                  </div>

                  {/* End Time Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-on-surface">End Time</label>
                    <select
                      value={workingDays[selectedDay].endTime}
                      onChange={(e) => handleTimeChange('endTime', e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3.5 px-4 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:outline-none"
                    >
                      {Array.from({ length: 24 }).map((_, h) => {
                        const val = `${String(h).padStart(2, '0')}:00`;
                        return <option key={val} value={val}>{val}</option>;
                      })}
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-12 relative z-10 flex flex-col gap-6">
                <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">Verification Document</label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full bg-surface-container-high border border-outline-variant/20 rounded-xl py-3.5 px-4 text-on-surface focus:ring-2 focus:ring-primary-fixed focus:outline-none"
                    >
                      <option value="government_id">Government ID</option>
                      <option value="business_license">Business License</option>
                      <option value="address_proof">Address Proof</option>
                      <option value="professional_certificate">Professional Certificate</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-on-surface-variant file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-on-primary"
                    />
                    <p className="mt-2 text-xs text-on-surface-variant">JPEG, PNG, or PDF up to the configured upload limit.</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface-container-highest/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-secondary">info</span>
                    <p className="text-sm font-bold text-on-surface">Smart Buffer</p>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    We automatically add 30 minutes between appointments to ensure you're never rushed.
                  </p>
                </div>

                <button
                  onClick={handleComplete}
                  disabled={submitting}
                  className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] block text-center disabled:opacity-55 cursor-pointer"
                >
                  {submitting ? 'Completing Registration...' : 'Complete Registration'}
                </button>
                <Link
                  to="/onboarding-2"
                  className="w-full text-on-surface-variant font-medium text-sm hover:text-on-surface transition-colors block text-center"
                >
                  Go back to Service Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-surface-container-high mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-on-surface-variant">© 2024 Service Square Inc. All rights reserved.</div>
          <div className="flex items-center gap-8">
            <a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}

