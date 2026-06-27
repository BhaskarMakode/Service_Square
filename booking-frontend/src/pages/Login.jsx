import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [loginMode, setLoginMode] = useState('user');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [devOtp, setDevOtp] = useState(null);

  const { sendOtp, sendSuperAdminOtp, verifyOtp, loadProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }
    if (loginMode === 'admin' && !email.trim()) {
      setError("Please enter the configured super admin email.");
      return;
    }
    setLoading(true);
    try {
      const res = loginMode === 'admin'
        ? await sendSuperAdminOtp({ phone, email })
        : await sendOtp(phone);
      if (res.success) {
        setOtpSent(true);
        // For development, pre-fill or log the OTP
        if (res.data && res.data.devOtp) {
           setDevOtp(res.data.devOtp);
        }
      } else {
        setError(res.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp(phone, otp);
      if (res.success) {
        const { requiresRegistration, user } = res.data;
        if (requiresRegistration) {
          navigate('/signup', { state: { phone } });
        } else {
          if (user.role === 'provider') {
            const profileData = await loadProfile();
            const status = profileData?.providerProfile?.verificationStatus;
            navigate(status === 'approved' ? '/provider-panel' : '/verification-status');
          } else if (user.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            const redirect = searchParams.get('redirect');
            navigate(redirect || '/dashboard');
          }
        }
      } else {
        setError(res.message || "Failed to verify OTP.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-6 py-20 bg-slate-50 dark:bg-slate-950 min-h-screen font-body selection:bg-indigo-500/30">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Log in to your Service Square account</p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setLoginMode('user');
              setOtpSent(false);
              setOtp('');
              setError(null);
            }}
            className={`py-3 rounded-xl text-sm font-bold transition-all ${loginMode === 'user' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            User / Provider
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('admin');
              setOtpSent(false);
              setOtp('');
              setError(null);
            }}
            className={`py-3 rounded-xl text-sm font-bold transition-all ${loginMode === 'admin' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            Super Admin
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
        
        {devOtp && !otpSent && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium">
            Development OTP: {devOtp}
          </div>
        )}

        {!otpSent ? (
          <form className="space-y-5" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                placeholder="+919876543210" 
              />
            </div>
            {loginMode === 'admin' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            )}
            
            <button 
              type="submit"
              disabled={loading}
              className="block text-center w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl hover:shadow-xl active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70"
            >
              {loading ? 'Sending...' : loginMode === 'admin' ? 'Send Super Admin OTP' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={handleVerifyOtp}>
            {devOtp && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-xl mb-4 text-center">
                Development Mode OTP: <strong>{devOtp}</strong>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Enter OTP</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-center tracking-widest text-lg font-bold" 
                placeholder="000000" 
                maxLength={6}
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="block text-center w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl hover:shadow-xl active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Login'}
            </button>

            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => { setOtpSent(false); setOtp(''); }} 
                className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
