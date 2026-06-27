import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function VerificationStatus() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [providerProfile, setProviderProfile] = useState(null);
  const [documentType, setDocumentType] = useState('government_id');
  const [documentFile, setDocumentFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verification, setVerification] = useState(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const [res, verificationRes] = await Promise.all([
        apiClient.get('/auth/profile'),
        apiClient.get('/verification/status')
      ]);
      if (res.data.success) {
        const profile = res.data.data.providerProfile;
        if (!profile) {
          navigate('/onboarding-1');
          return;
        }
        setProviderProfile(profile);
        setVerification(verificationRes.data.data.verification || null);
      }
    } catch (err) {
      console.error('Error fetching verification profile:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load verification status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [navigate]);

  const handleDocumentUpload = async (event) => {
    event.preventDefault();

    if (!documentFile) {
      setError('Please choose a verification document to upload.');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('document', documentFile);
      await apiClient.post('/verification/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDocumentFile(null);
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload verification document.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-500 dark:text-slate-400 font-semibold text-sm">Checking Verification Status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-6">
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/15 text-center max-w-md">
          <span className="material-symbols-outlined text-rose-500 text-5xl mb-4">error</span>
          <h3 className="text-xl font-bold mb-2">Error Loading Status</h3>
          <p className="text-on-surface-variant text-sm mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-xl transition-all active:scale-95">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const status = providerProfile?.verificationStatus || 'pending';

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-sans antialiased text-slate-900 dark:text-slate-100">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400">Service Square</span>
            <div className="hidden md:flex items-center gap-6">
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 px-1 py-4">Dashboard</span>
              <a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors duration-200" href="#">Bookings</a>
              <a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors duration-200" href="#">Support</a>
            </div>
            <button onClick={logout} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg" title="Log out"><span className="material-symbols-outlined">logout</span></button>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary-fixed overflow-hidden flex items-center justify-center text-white font-bold bg-indigo-600">
              {user?.avatar ? (
                <img alt="Provider Profile Avatar" className="h-full w-full object-cover" src={user.avatar}/>
              ) : (
                user?.name?.charAt(0) || 'P'
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navigation Bar (Hidden on Mobile) */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-col gap-2 p-4 pt-20">
        <div className="px-4 py-6 mb-4">
          <h2 className="text-lg font-black text-indigo-700 dark:text-indigo-400 leading-tight">Service Square</h2>
          <p className="text-xs font-medium text-on-surface-variant opacity-70">Provider Portal</p>
        </div>
        <nav className="flex flex-col gap-1">
          <span className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-xl shadow-sm cursor-not-allowed">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </span>
          <span className="flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-slate-600 cursor-not-allowed">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="text-sm font-medium">Bookings</span>
          </span>
          <span className="flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-slate-600 cursor-not-allowed">
            <span className="material-symbols-outlined">build</span>
            <span className="text-sm font-medium">My Services</span>
          </span>
          <span className="flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-slate-600 cursor-not-allowed">
            <span className="material-symbols-outlined">event_available</span>
            <span className="text-sm font-medium">Availability</span>
          </span>
          <span className="flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-slate-600 cursor-not-allowed">
            <span className="material-symbols-outlined">payments</span>
            <span className="text-sm font-medium">Earnings</span>
          </span>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 pt-24 pb-20 px-6 max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Provider Verification</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg">Manage your application status and complete your profile to start accepting jobs in your local area.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Verification States */}
          <div className="lg:col-span-8 space-y-12">
            {/* STATE 1: PENDING */}
            {status === 'pending' && (
              <section className="relative">
                <div className="absolute -top-4 -left-4 bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest z-10 shadow-sm border border-amber-200">
                  Status: Pending
                </div>
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-24 h-24 flex-shrink-0 bg-amber-50 rounded-3xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-amber-500 text-5xl">hourglass_empty</span>
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-2">Verification in Progress</h3>
                      <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">Our trust and safety team is currently reviewing your background check and insurance documents. This typically takes 2-3 business days.</p>
                      <div className="bg-surface-container-low rounded-2xl p-4 inline-flex items-center gap-3 border border-outline-variant/5">
                        <span className="material-symbols-outlined text-amber-600 text-sm">info</span>
                        <p className="text-xs font-medium text-on-surface-variant">Dashboard access is restricted until approval.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 pt-10 border-t border-surface-container flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex flex-col items-center gap-2 p-4 bg-surface rounded-2xl w-32">
                      <span className="material-symbols-outlined text-indigo-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Identity</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-surface rounded-2xl w-32 animate-pulse">
                      <span className="material-symbols-outlined text-amber-500">pending</span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Background</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-surface rounded-2xl w-32 opacity-40">
                      <span className="material-symbols-outlined">radio_button_unchecked</span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Payouts</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* STATE 2: APPROVED */}
            {status === 'approved' && (
              <section className="relative">
                <div className="absolute -top-4 -left-4 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest z-10 shadow-sm border border-emerald-200">
                  Status: Approved
                </div>
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10 overflow-hidden relative">
                  {/* Decorative Gradient */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/10 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                      <div className="w-24 h-24 flex-shrink-0 bg-emerald-50 rounded-3xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-emerald-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black tracking-widest uppercase mb-4">
                          Verified Provider
                        </div>
                        <h3 className="text-3xl font-black mb-2 text-on-surface">Welcome to the Square!</h3>
                        <p className="text-on-surface-variant mb-8 text-lg">Your account is fully approved. You can now start listing services and accepting bookings from local clients.</p>
                        <Link to="/provider-panel" className="inline-flex px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 active:scale-95 transition-all items-center gap-3">
                          Go to Dashboard
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* STATE 3: REJECTED */}
            {status === 'rejected' && (
              <section className="relative">
                <div className="absolute -top-4 -left-4 bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest z-10 shadow-sm border border-rose-200">
                  Status: Rejected
                </div>
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-24 h-24 flex-shrink-0 bg-rose-50 rounded-3xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-rose-500 text-5xl">cancel</span>
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-2">Application Needs Attention</h3>
                      <div className="bg-error-container/30 border-l-4 border-error p-4 rounded-r-xl mb-6">
                        <p className="text-on-error-container font-medium text-sm">
                          Rejection reason: {providerProfile?.rejectionReason || 'Your documents could not be verified. Please review guidelines or contact support.'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <Link to="/onboarding-1" className="px-6 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors active:scale-95 text-center">
                          Re-apply / Edit Info
                        </Link>
                        <button className="px-6 py-3 text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors">
                          Contact Support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Info / Next Steps */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low rounded-[1.5rem] p-6">
              <h4 className="text-lg font-bold mb-4">Application Checklist</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className={`material-symbols-outlined text-sm mt-1 ${verification ? 'text-emerald-500' : 'text-slate-400'}`} style={verification ? { fontVariationSettings: "'FILL' 1" } : {}}>{verification ? 'check_circle' : 'radio_button_unchecked'}</span>
                  <div>
                    <p className="text-sm font-bold">Profile Details</p>
                    <p className="text-xs text-on-surface-variant">Completed during sign-up</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-500 text-sm mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <div>
                    <p className="text-sm font-bold">Government ID</p>
                    <p className="text-xs text-on-surface-variant">{verification ? `${verification.documentType.replaceAll('_', ' ')} uploaded ${new Date(verification.submittedAt).toLocaleDateString('en-IN')}` : 'Document not uploaded'}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className={`material-symbols-outlined text-sm mt-1 ${status === 'approved' ? 'text-emerald-500' : status === 'rejected' ? 'text-rose-500' : 'text-amber-500'}`} style={status === 'approved' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {status === 'approved' ? 'check_circle' : status === 'rejected' ? 'cancel' : 'clock_loader_40'}
                  </span>
                  <div>
                    <p className="text-sm font-bold">Manual Review</p>
                    <p className="text-xs text-on-surface-variant capitalize">{status} status</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-indigo-900 text-white rounded-[1.5rem] p-6 relative overflow-hidden">
              <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-9xl opacity-10">lightbulb</span>
              <h4 className="text-lg font-bold mb-2 relative z-10">Pro Tip</h4>
              <p className="text-indigo-100 text-sm relative z-10 mb-4">Providers with high-quality portfolio photos get 3x more bookings once approved.</p>
              <a className="text-secondary-container text-sm font-bold hover:underline relative z-10" href="#">View Photo Guide</a>
            </div>
            <div className="p-6 border border-outline-variant/20 rounded-[1.5rem]">
              <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Verification Upload</h4>
              <form className="space-y-4" onSubmit={handleDocumentUpload}>
                <select
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/20 rounded-xl py-3 px-4 text-sm"
                >
                  <option value="government_id">Government ID</option>
                  <option value="business_license">Business License</option>
                  <option value="address_proof">Address Proof</option>
                  <option value="professional_certificate">Professional Certificate</option>
                </select>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(event) => setDocumentFile(event.target.files?.[0] || null)}
                  className="block w-full text-xs text-on-surface-variant file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-bold file:text-on-primary"
                />
                <button
                  type="submit"
                  disabled={uploading || status === 'approved'}
                  className="w-full p-3 bg-primary text-on-primary rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : status === 'approved' ? 'Already Approved' : 'Upload Document'}
                </button>
              </form>
            </div>
            <div className="p-6 border border-outline-variant/20 rounded-[1.5rem]">
              <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Support</h4>
              <p className="text-sm text-on-surface-variant mb-4">Questions about your verification? Our team is here to help.</p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-surface rounded-xl hover:bg-surface-container-low transition-colors group">
                  <span className="text-sm font-medium">Help Articles</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-surface rounded-xl hover:bg-surface-container-low transition-colors group">
                  <span className="text-sm font-medium">Live Chat</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chat_bubble</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50 flex justify-around items-center h-16 px-4">
        <button className="flex flex-col items-center gap-1 text-indigo-600">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="text-[10px] font-medium">Bookings</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </>
  );
}
