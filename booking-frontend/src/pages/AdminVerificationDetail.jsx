import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function AdminVerificationDetail() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const providerId = queryParams.get('id');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        if (!providerId) {
            navigate('/admin-verification-queue');
            return;
        }
        fetchProviderDetails();
    }, [user, navigate, providerId]);

    const fetchProviderDetails = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/providers/${providerId}`);
            if (res.data.success) {
                setProvider(res.data.data.provider);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch provider details');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (status) => {
        if (status === 'rejected' && !rejectionReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }
        try {
            setLoading(true);
            const res = await apiClient.put(`/admin/provider/${providerId}/verify`, {
                status,
                rejectionReason: status === 'rejected' ? rejectionReason : undefined
            });
            if (res.data.success) {
                navigate('/admin-verification-queue');
            }
        } catch (err) {
            alert(err.message || `Failed to ${status} provider`);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold animate-pulse">Loading Provider Details...</div>;
    }

    if (error || !provider) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-red-500 font-bold mb-4">{error || 'Provider not found'}</p>
                <Link to="/admin-verification-queue" className="px-4 py-2 bg-indigo-600 text-white rounded-xl">Back to Queue</Link>
            </div>
        );
    }

    const u = provider.userId || {};
    const cat = provider.categoryId || {};

    return (
        <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex">
            {/* Sidebar Navigation */}
            <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/15 bg-slate-50 dark:bg-slate-950 flex flex-col p-4 gap-2 z-50">
                <Link to="/" className="flex items-center gap-3 px-2 py-4 mb-4">
                    <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary">
                        <span className="material-symbols-outlined">grid_view</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">Service Square</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Admin Console</p>
                    </div>
                </Link>
                <nav className="flex-1 space-y-1">
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200 hover:translate-x-1 group" to="/admin-dashboard">
                        <span className="material-symbols-outlined text-xl">dashboard</span>
                        <span className="text-sm font-medium tracking-wide">Overview</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm rounded-xl transition-all duration-200" to="/admin-verification-queue">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                        <span className="text-sm font-semibold tracking-wide">Provider Verification</span>
                    </Link>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all duration-200 hover:translate-x-1 group" href="#">
                        <span className="material-symbols-outlined text-xl">group</span>
                        <span className="text-sm font-medium tracking-wide">User Management</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all duration-200 hover:translate-x-1 group" href="#">
                        <span className="material-symbols-outlined text-xl">calendar_month</span>
                        <span className="text-sm font-medium tracking-wide">Bookings</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all duration-200 hover:translate-x-1 group" href="#">
                        <span className="material-symbols-outlined text-xl">analytics</span>
                        <span className="text-sm font-medium tracking-wide">Analytics</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all duration-200 hover:translate-x-1 group" href="#">
                        <span className="material-symbols-outlined text-xl">settings</span>
                        <span className="text-sm font-medium tracking-wide">Settings</span>
                    </a>
                </nav>
                <div className="pt-4 border-t border-outline-variant/15">
                    <button className="w-full bg-primary-container text-on-primary py-3 rounded-xl font-semibold shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">ios_share</span>
                        Export Report
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-3 mt-2 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-all duration-200">
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <span className="text-sm font-medium tracking-wide">Logout</span>
                    </button>
                </div>
            </aside>
            {/* Main Content Canvas */}
            <main className="ml-64 flex-1 min-h-screen bg-surface">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-4 border-b border-outline-variant/15 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/admin-verification-queue" className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-on-surface tracking-tight">Provider Verification</h2>
                            <p className="text-sm text-on-surface-variant">Application ID: #{provider._id.slice(-8)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${provider.verificationStatus === 'pending' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : (provider.verificationStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${provider.verificationStatus === 'pending' ? 'bg-tertiary' : (provider.verificationStatus === 'approved' ? 'bg-emerald-500' : 'bg-red-500')}`}></span>
                            {provider.verificationStatus}
                        </div>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
                            <img alt="Admin" className="w-full h-full object-cover" src={user?.avatar || "https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff"} />
                        </div>
                    </div>
                </header>
                {/* Layout Wrapper */}
                <div className="p-8 flex flex-col lg:flex-row gap-8">
                    {/* Left: Profile Details */}
                    <div className="flex-1 space-y-8">
                        {/* Personal Info & Experience Bento */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Hero Card */}
                            <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/5 flex items-start gap-6">
                                <div className="relative">
                                    <img className="w-32 h-32 rounded-2xl object-cover shadow-md bg-indigo-100" src={u.avatar || `https://ui-avatars.com/api/?name=${u.name || 'Provider'}&background=4F46E5&color=fff`} alt="Provider" />
                                    <div className="absolute -top-3 -right-3 bg-white/40 backdrop-blur-xl border border-white/40 p-2 rounded-xl shadow-lg">
                                        <div className="bg-secondary-container p-1 rounded-lg">
                                            <span className="material-symbols-outlined text-on-secondary-container text-lg">{cat.icon || 'plumbing'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold tracking-tight text-on-surface capitalize">{u.name || 'Unknown'}</h3>
                                    <p className="text-on-surface-variant font-medium capitalize">Professional {cat.name || provider.category || 'Service'} Expert</p>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Location</p>
                                            <p className="text-sm font-semibold">{provider.location?.city || 'Not Provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Member Since</p>
                                            <p className="text-sm font-semibold">{new Date(provider.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Email</p>
                                            <p className="text-sm font-semibold truncate">{u.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Phone</p>
                                            <p className="text-sm font-semibold">{u.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Experience Card */}
                            <div className="col-span-12 lg:col-span-5 bg-surface-container-low p-6 rounded-3xl border border-outline-variant/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary">history_edu</span>
                                    <h4 className="font-bold text-on-surface">Experience Detail</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-surface-container-lowest p-3 rounded-2xl flex items-center justify-between">
                                        <span className="text-sm font-medium text-on-surface-variant">Years of Practice</span>
                                        <span className="text-sm font-bold text-primary">{provider.experience || 0}+ Years</span>
                                    </div>
                                    <div className="bg-surface-container-lowest p-3 rounded-2xl flex items-center justify-between">
                                        <span className="text-sm font-medium text-on-surface-variant">Specialization</span>
                                        <span className="text-sm font-bold text-primary capitalize">{cat.name || provider.category || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-outline mb-2">Primary Services</p>
                                        <div className="flex flex-wrap gap-2">
                                            {provider.skills?.map((skill, idx) => (
                                              <span key={idx} className="px-3 py-1 bg-white dark:bg-slate-800 dark:border-slate-700 rounded-full text-[11px] font-bold border border-outline-variant/20 shadow-sm text-on-surface">{skill}</span>
                                            ))}
                                            {(!provider.skills || provider.skills.length === 0) && (
                                              <span className="text-xs text-on-surface-variant italic">No specific skills listed.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Documents Section (Mock) */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-on-surface tracking-tight">Verification Documents</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* ID Document */}
                                <div className="group relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                                    <div className="h-40 bg-surface-container-highest relative flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-outline-variant">id_card</span>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-bold text-on-surface">Government Photo ID</p>
                                        <p className="text-xs text-on-surface-variant">Uploaded by provider</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* Right: Action Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0 sticky top-[88px] h-fit mb-8">
                        <div className="bg-surface-container-lowest p-6 rounded-[2.5rem] shadow-sm border border-outline-variant/10 space-y-6">
                            <div>
                                <h5 className="text-base font-bold text-on-surface mb-1">Moderation Hub</h5>
                                <p className="text-xs text-on-surface-variant">Take action on this provider application.</p>
                            </div>
                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button 
                                    onClick={() => handleVerify('approved')}
                                    disabled={actionLoading || provider?.verificationStatus === 'approved'}
                                    className={`w-full py-4 px-6 ${provider?.verificationStatus === 'approved' ? 'bg-emerald-500' : 'bg-gradient-to-br from-primary to-primary-container'} text-white rounded-2xl font-bold flex items-center justify-between group active:scale-95 transition-all shadow-md hover:brightness-110 disabled:opacity-50`}
                                >
                                    <span>{provider?.verificationStatus === 'approved' ? 'Approved' : 'Approve Provider'}</span>
                                    <span className="material-symbols-outlined text-white/50 group-hover:text-white transition-colors">check_circle</span>
                                </button>
                                <button 
                                    onClick={() => handleVerify('rejected')}
                                    disabled={actionLoading || provider?.verificationStatus === 'rejected'}
                                    className={`w-full py-4 px-6 ${provider?.verificationStatus === 'rejected' ? 'bg-error text-white' : 'bg-error-container text-on-error-container'} rounded-2xl font-bold flex items-center justify-between group active:scale-95 transition-all hover:brightness-105 disabled:opacity-50`}
                                >
                                    <span>{provider?.verificationStatus === 'rejected' ? 'Rejected' : 'Reject Application'}</span>
                                    <span className="material-symbols-outlined text-on-error-container/50 group-hover:text-on-error-container transition-colors">cancel</span>
                                </button>
                            </div>
                            {/* Rejection Reason */}
                            {provider?.verificationStatus !== 'approved' && (
                                <div className="pt-6 border-t border-outline-variant/10">
                                    <label className="block text-xs font-bold text-outline uppercase tracking-widest mb-2" htmlFor="rejection-reason">Internal Review Note</label>
                                    <textarea 
                                        className="w-full bg-surface-container-high border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary-fixed focus:bg-white dark:focus:bg-slate-800 transition-all resize-none text-on-surface" 
                                        id="rejection-reason" 
                                        placeholder="Enter reason for rejection or details requested..." 
                                        rows="4"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        disabled={provider?.verificationStatus === 'rejected'}
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
