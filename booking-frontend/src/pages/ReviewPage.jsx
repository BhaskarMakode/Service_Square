import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { ToastContext } from '../context/ToastContext';

export default function ReviewPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    
    const fetchBooking = async () => {
      try {
        const response = await apiClient.get(`/bookings/${bookingId}`);
        if (response.data.success) {
          setBooking(response.data.data.booking);
        }
      } catch (error) {
        addToast('Failed to load booking details', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [bookingId, addToast]);

  const handleSubmit = async () => {
    if (rating === 0) {
      addToast('Please select a rating', 'error');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await apiClient.post('/reviews/add', {
        bookingId,
        rating,
        comment
      });
      if (res.data.success) {
        addToast('Review submitted successfully!', 'success');
        navigate('/dashboard');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;
  if (!bookingId || !booking) return <div className="min-h-screen pt-24 text-center text-rose-500">Booking not found or no ID provided.</div>;

  const providerName = booking.providerId?.userId?.name || booking.providerId?.fullName || booking.providerId?.name || 'Your Provider';
  const serviceType = booking.serviceType || 'Service';

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-widest uppercase mb-4">Post-Service Feedback</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6 dark:text-white">How was your service today?</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">Your feedback helps our artists improve and helps other community members find the best professionals.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(53,37,205,0.06)] relative overflow-hidden border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-6 mb-12 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
              <div className="relative">
                <img alt="Provider Portrait" className="w-20 h-20 rounded-2xl object-cover" src={`https://ui-avatars.com/api/?name=${providerName}&background=4F46E5&color=fff`}/>
                <div className="absolute -top-2 -right-2 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-1.5 rounded-lg border border-white/20 shadow-sm">
                  <div className="bg-indigo-100 dark:bg-indigo-900 p-1 rounded-md">
                    <span className="material-symbols-outlined text-xs text-indigo-600 dark:text-indigo-400 block" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight dark:text-white capitalize">{providerName}</h3>
                <p className="text-slate-500 font-medium capitalize">{serviceType} Professional</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">VERIFIED</span>
                  <span className="text-xs text-slate-400">Booking ID: #{booking._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="mb-12 text-center md:text-left">
              <label className="block text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-6">Your Rating</label>
              <div className="flex items-center justify-center md:justify-start gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    className="group p-2 focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <span 
                      className={`material-symbols-outlined text-5xl transition-colors ${
                        (hoverRating || rating) >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'
                      }`} 
                      style={{ fontVariationSettings: (hoverRating || rating) >= star ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-amber-500 font-semibold tracking-tight">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            <div className="space-y-4 mb-12">
              <label className="block text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400" htmlFor="feedback">Share your experience</label>
              <div className="relative">
                <textarea 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all duration-300 resize-none" 
                  id="feedback" 
                  placeholder="What stood out during your appointment? Was the communication clear?" 
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                ></textarea>
                <div className="absolute bottom-4 right-6 text-xs text-slate-400 font-medium">{comment.length} / 500</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={handleSubmit} 
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-4 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors px-6 py-4 flex items-center justify-center">
                Skip for now
              </Link>
            </div>
            
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-100/30 dark:bg-indigo-900/10 rounded-[48px] -rotate-12 pointer-events-none"></div>
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-[32px] rotate-45 pointer-events-none"></div>
          </section>

          <aside className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-4 shadow-sm text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined">photo_camera</span>
              </div>
              <h4 className="font-bold mb-2 dark:text-white">Add Photos</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Reviews with photos are 3x more helpful to other customers.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-4 shadow-sm text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
              </div>
              <h4 className="font-bold mb-2 dark:text-white">Be Specific</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Mentioning specific details helps {providerName.split(' ')[0]} grow their professional practice.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
