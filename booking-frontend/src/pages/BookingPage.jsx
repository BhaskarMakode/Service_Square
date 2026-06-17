import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function BookingPage() {
    const [searchParams] = useSearchParams();
    const providerId = searchParams.get('providerId');
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [serviceType, setServiceType] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    
    // Simple date/time handling for demo
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: `/booking?providerId=${providerId}` } });
            return;
        }

        if (providerId) {
            fetchProviderDetails();
        } else {
            setError("No provider selected.");
            setLoading(false);
        }
    }, [providerId, user, navigate]);

    const fetchProviderDetails = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/providers/${providerId}`);
            if (res.data.success) {
                setProvider(res.data.data.provider);
                setServiceType(res.data.data.provider.category);
            }
        } catch (err) {
            setError(err.message || 'Failed to load provider.');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!selectedDate || !selectedTime || !address) {
            alert('Please fill in all required fields (Date, Time, Address).');
            return;
        }
        
        try {
            setSubmitting(true);
            
            // Construct ISO dates (Assuming 2 hours duration for demo)
            const dateStr = selectedDate; // e.g. "2024-10-24"
            const timeStr = selectedTime; // e.g. "09:00"
            const startDateTime = new Date(`${dateStr}T${timeStr}:00`);
            const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // +2 hours
            
            const payload = {
                providerId: provider._id,
                serviceType: serviceType || provider.category,
                scheduledStart: startDateTime.toISOString(),
                scheduledEnd: endDateTime.toISOString(),
                address: address,
                amount: (provider.hourlyRate || 50) * 2, // 2 hours
                notes: notes
            };
            
            const res = await apiClient.post('/bookings/create', payload);
            if (res.data.success) {
                navigate(`/booking-confirmation?bookingId=${res.data.data.booking._id}`);
            }
        } catch (err) {
            alert(err.message || 'Failed to create booking.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading booking details...</div>;
    }

    if (error || !provider) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <div className="text-red-500 font-bold">{error || "Provider not found"}</div>
                <Link to="/services" className="text-indigo-600 underline">Back to Services</Link>
            </div>
        );
    }

    const name = provider.userId?.name || provider.fullName || "Provider";
    const avatarUrl = provider.userId?.avatar || `https://ui-avatars.com/api/?name=${name}&background=4F46E5&color=fff&size=512`;
    const rate = provider.hourlyRate || 50;
    const estimatedHours = 2;
    const baseFee = rate * estimatedHours;
    const processingFee = Math.round(baseFee * 0.08 * 100) / 100;
    const totalDue = baseFee + processingFee;

    // Generate upcoming dates for demo
    const today = new Date();
    const dates = Array.from({length: 3}).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i + 1);
        return {
            val: d.toISOString().split('T')[0],
            day: d.getDate(),
            month: d.toLocaleString('default', { month: 'short' })
        };
    });

    const times = ["09:00", "11:30", "14:00", "16:30"];
    const displayTime = (t) => {
        const [h, m] = t.split(':');
        const hh = parseInt(h);
        return `${hh > 12 ? hh - 12 : hh}:${m} ${hh >= 12 ? 'PM' : 'AM'}`;
    };

    return (
        <div className="antialiased text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 font-body min-h-screen">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none h-20 border-b border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
                    <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400">
                        Service Square
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Side: Focused Booking Form */}
                    <div className="lg:col-span-8 space-y-10">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">Confirm Your Appointment</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">Complete the details below to secure your professional service. Our providers are vetted and ready to assist.</p>
                        </div>
                        
                        <form className="space-y-8" onSubmit={handleBooking}>
                            {/* Section: Service Selection */}
                            <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Service Details</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="block group">
                                        <span className="block text-sm font-semibold mb-2 ml-1 text-slate-600 dark:text-slate-400">Service Category</span>
                                        <div className="relative">
                                            <input 
                                                readOnly
                                                value={serviceType}
                                                className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-600 transition-all capitalize" 
                                            />
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Section: Date & Time Picker */}
                            <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Schedule</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <span className="block text-sm font-semibold ml-1 text-slate-600 dark:text-slate-400">Preferred Date</span>
                                        <div className="grid grid-cols-3 gap-3">
                                            {dates.map((d, i) => (
                                                <button 
                                                    key={i}
                                                    onClick={() => setSelectedDate(d.val)}
                                                    className={`p-4 rounded-2xl border-2 transition-all text-center active:scale-95 ${selectedDate === d.val ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-indigo-300'}`} 
                                                    type="button"
                                                >
                                                    <span className={`block text-xs uppercase font-bold ${selectedDate === d.val ? 'text-indigo-600' : 'text-slate-500'}`}>{d.month}</span>
                                                    <span className={`block text-xl font-black ${selectedDate === d.val ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>{d.day}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <span className="block text-sm font-semibold ml-1 text-slate-600 dark:text-slate-400">Available Times</span>
                                        <div className="grid grid-cols-2 gap-3">
                                            {times.map((t, i) => (
                                                <button 
                                                    key={i}
                                                    onClick={() => setSelectedTime(t)}
                                                    className={`py-3 px-4 rounded-xl font-semibold text-center transition-all active:scale-95 border-2 ${selectedTime === t ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-transparent bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-300'}`} 
                                                    type="button"
                                                >
                                                    {displayTime(t)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Location */}
                            <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Service Location</h2>
                                </div>
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="block text-sm font-semibold mb-2 ml-1 text-slate-600 dark:text-slate-400">Full Address</span>
                                        <input 
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 placeholder:text-slate-400 transition-all" 
                                            placeholder="123 Editorial Lane, Design District, 90210" 
                                            type="text" 
                                            required
                                        />
                                    </label>
                                </div>
                            </section>

                            {/* Section: Notes */}
                            <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Additional Notes</h2>
                                </div>
                                <label className="block">
                                    <span className="block text-sm font-semibold mb-2 ml-1 text-slate-600 dark:text-slate-400">Special Instructions</span>
                                    <textarea 
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full p-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-600 placeholder:text-slate-400 transition-all resize-none" 
                                        placeholder="Any specific requirements or access details for the provider..." 
                                        rows="4"
                                    ></textarea>
                                </label>
                            </section>
                        </form>
                    </div>

                    {/* Right Side: Sticky Summary Sidebar */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-32 pb-10">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                            <h3 className="text-2xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">Order Summary</h3>
                            
                            {/* Selected Provider Mini-Card */}
                            <div className="flex items-center gap-4 mb-8 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <img className="w-16 h-16 rounded-xl object-cover bg-indigo-50" src={avatarUrl} alt={name} />
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white capitalize">{name}</p>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="text-sm font-bold text-slate-500">{provider.rating || 'New'} ({provider.reviewsCount || 0} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                                    <span>Rate</span>
                                    <span className="text-slate-900 dark:text-white">${rate}/hr</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                                    <span>Estimated Time</span>
                                    <span className="text-slate-900 dark:text-white">{estimatedHours} hours</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                                    <span>Base Service Fee</span>
                                    <span className="text-slate-900 dark:text-white">${baseFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                                    <span>Processing Tax (8%)</span>
                                    <span className="text-slate-900 dark:text-white">${processingFee.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-black text-slate-900 dark:text-white">Total Due</span>
                                    <span className="text-2xl font-black text-indigo-600">${totalDue.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleBooking}
                                disabled={submitting}
                                className="block w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-center text-lg font-black rounded-2xl shadow-xl shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98] transition-all mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Confirming...' : 'Confirm Booking'}
                            </button>
                            <p className="text-center text-xs text-slate-500 font-medium leading-relaxed">
                                By confirming, you agree to our Terms of Service.
                            </p>
                        </div>

                        {/* Trust Badge */}
                        <div className="mt-8 flex items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <span className="material-symbols-outlined text-emerald-500">verified_user</span>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Secure 256-bit Encryption</span>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
