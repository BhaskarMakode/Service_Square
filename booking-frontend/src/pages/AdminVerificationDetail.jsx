import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminVerificationDetail() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [provider, setProvider] = useState(null);
    const [verifications, setVerifications] = useState([]);
    const [uploads, setUploads] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    const providerId = queryParams.get('id');

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/'); return; }
        if (!providerId) { navigate('/admin-verification-queue'); return; }
        fetchProviderDetails();
    }, [user, navigate, providerId]);

    const fetchProviderDetails = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/admin/provider/${providerId}`);
            if (res.data.success) {
                const data = res.data.data;
                setProvider(data.provider);
                setVerifications(data.verifications || []);
                setUploads(data.uploads || []);
                setPortfolio(data.portfolio || []);
                setBookings(data.bookings || []);
                setPayments(data.payments || []);
                setReviews(data.reviews || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch provider details');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (status) => {
        if (status === 'rejected' && !rejectionReason.trim()) {
            alert('Please provide a rejection reason before rejecting.');
            return;
        }
        try {
            setActionLoading(true);
            const res = await apiClient.put(`/admin/provider/${providerId}/verify`, {
                status,
                rejectionReason: status === 'rejected' ? rejectionReason : undefined
            });
            if (res.data.success) {
                navigate('/admin-verification-queue');
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || `Failed to ${status} provider`);
        } finally {
            setActionLoading(false);
        }
    };

    const openUpload = async (upload, mode = 'preview') => {
        try {
            // apiClient base already has /api — strip /api or /api/v1 prefix from stored URL
            let url = upload.url || `/upload/${upload._id}`;
            url = url.replace(/^\/api\/v1/, '').replace(/^\/api/, '');
            if (!url.startsWith('/')) url = `/${url}`;

            const res = await apiClient.get(url, { responseType: 'blob' });
            const mimeType = res.headers['content-type'] || 'application/octet-stream';
            const objectUrl = URL.createObjectURL(new Blob([res.data], { type: mimeType }));

            if (mode === 'download') {
                const link = document.createElement('a');
                link.href = objectUrl;
                link.download = upload.originalName || upload.fileName || `document-${upload._id}`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
            } else {
                window.open(objectUrl, '_blank', 'noopener,noreferrer');
                setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
            }
        } catch (err) {
            alert(`Document Error: ${err.response?.data?.message || err.message || 'Unable to open document'}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex">
                <AdminSidebar active="/admin-verification-queue" />
                <main className="ml-64 flex-1 grid place-items-center">
                    <div className="text-center animate-pulse">
                        <span className="material-symbols-outlined text-5xl text-indigo-300 mb-4 block">person_search</span>
                        <p className="font-bold text-slate-500">Loading provider details...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !provider) {
        return (
            <div className="min-h-screen flex">
                <AdminSidebar active="/admin-verification-queue" />
                <main className="ml-64 flex-1 flex flex-col items-center justify-center gap-4">
                    <span className="material-symbols-outlined text-5xl text-rose-400">error</span>
                    <p className="text-rose-500 font-bold">{error || 'Provider not found'}</p>
                    <Link to="/admin-verification-queue" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                        ← Back to Queue
                    </Link>
                </main>
            </div>
        );
    }

    const u = provider.userId || {};
    const cat = provider.categoryId || {};
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalProviderEarnings = payments.reduce((sum, p) => sum + (p.providerEarning || 0), 0);
    const latestVerification = verifications[0];

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-body antialiased min-h-screen flex">
            <AdminSidebar active="/admin-verification-queue" />

            <main className="ml-64 flex-1 min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-8 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link to="/admin-verification-queue" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300" title="Back to Queue">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Provider Verification</h2>
                            <p className="text-sm text-slate-500">ID: #{provider._id.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            provider.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                            provider.verificationStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {provider.verificationStatus}
                        </span>
                        <img
                            alt="Admin"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            src={user?.avatar || `https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff`}
                        />
                    </div>
                </header>

                <div className="p-8 flex flex-col lg:flex-row gap-8">
                    {/* Left: Details */}
                    <div className="flex-1 space-y-8">
                        {/* Profile Card */}
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-start gap-6">
                                <div className="relative shrink-0">
                                    <img
                                        className="w-28 h-28 rounded-2xl object-cover bg-indigo-100"
                                        src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'Provider')}&background=4F46E5&color=fff`}
                                        alt="Provider"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-2xl font-bold tracking-tight capitalize">{u.name || 'Unknown'}</h3>
                                    <p className="text-slate-500 capitalize">{cat.name || provider.category || 'Service'} Professional</p>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {[
                                            ['Email', u.email || 'N/A'],
                                            ['Phone', u.phone || 'N/A'],
                                            ['Address', provider.address || 'Not provided'],
                                            ['Joined', new Date(provider.createdAt).toLocaleDateString('en-IN')],
                                        ].map(([label, val]) => (
                                            <div key={label}>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
                                                <p className="text-sm font-semibold truncate">{val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-indigo-600">history_edu</span>
                                    <h4 className="font-bold">Experience & Skills</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500">Experience</span>
                                        <span className="text-sm font-bold text-indigo-600">{provider.experience || 0}+ Years</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500">Hourly Rate</span>
                                        <span className="text-sm font-bold text-emerald-600">{formatCurrency(provider.hourlyRate || 0)}/hr</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(provider.skills || []).map((skill, idx) => (
                                                <span key={idx} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-[11px] font-bold">{skill}</span>
                                            ))}
                                            {(!provider.skills || provider.skills.length === 0) && (
                                                <span className="text-xs text-slate-400 italic">No skills listed.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                ['Total Bookings', bookings.length, 'event_note'],
                                ['Completed', completedBookings, 'task_alt'],
                                ['Earnings', formatCurrency(totalProviderEarnings), 'payments'],
                                ['Reviews', reviews.length, 'rate_review'],
                            ].map(([label, value, icon]) => (
                                <div key={label} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <span className="material-symbols-outlined text-indigo-600 mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">{label}</p>
                                    <p className="text-xl font-black mt-1">{value}</p>
                                </div>
                            ))}
                        </section>

                        {/* Verification Documents */}
                        <section>
                            <h4 className="text-lg font-bold mb-4">Verification Documents</h4>
                            {uploads.length === 0 && !latestVerification ? (
                                <div className="rounded-3xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 p-10 text-center text-slate-400 text-sm">
                                    <span className="material-symbols-outlined text-4xl mb-2 block">folder_off</span>
                                    No verification documents uploaded yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {(uploads.length ? uploads : [latestVerification?.documentImage]).filter(Boolean).map((doc, index) => {
                                        const upload = doc.uploadId ? { _id: doc.uploadId, url: doc.url, originalName: doc.originalName, documentType: doc.documentType } : doc;
                                        const verif = verifications.find(v => v.documentImage?.uploadId === upload._id);
                                        const isPdf = (upload.mimeType || '').includes('pdf');
                                        return (
                                            <div key={upload._id || index} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                                                <div className="h-36 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-5xl text-slate-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                        {isPdf ? 'picture_as_pdf' : 'id_card'}
                                                    </span>
                                                </div>
                                                <div className="p-4 space-y-3">
                                                    <div>
                                                        <p className="text-sm font-bold capitalize">{(upload.documentType || verif?.documentType || 'Verification Document').replaceAll('_', ' ')}</p>
                                                        <p className="text-xs text-slate-500 truncate">{upload.originalName || 'Uploaded document'}</p>
                                                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                                            (verif?.verificationStatus || provider.verificationStatus) === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                            (verif?.verificationStatus || provider.verificationStatus) === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {verif?.verificationStatus || provider.verificationStatus}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => openUpload(upload, 'preview')}
                                                            className="py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
                                                        >
                                                            Preview
                                                        </button>
                                                        <button
                                                            onClick={() => openUpload(upload, 'download')}
                                                            className="py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                                        >
                                                            Download
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Portfolio */}
                        {portfolio.length > 0 && (
                            <section>
                                <h4 className="text-lg font-bold mb-4">Portfolio</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {portfolio.map(item => (
                                        <div key={item._id} className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <img
                                                src={item.image?.url || item.url}
                                                alt={item.title || 'Portfolio'}
                                                className="w-full h-28 object-cover"
                                            />
                                            <div className="p-3">
                                                <p className="text-xs font-bold truncate">{item.title || 'Work photo'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right: Action Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0 sticky top-24 h-fit">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-5">
                            <div>
                                <h5 className="text-base font-bold mb-1">Moderation Panel</h5>
                                <p className="text-xs text-slate-500">Approve or reject this provider application.</p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleVerify('approved')}
                                    disabled={actionLoading || provider.verificationStatus === 'approved'}
                                    className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-between active:scale-95 transition-all shadow-md disabled:opacity-50"
                                >
                                    <span>{provider.verificationStatus === 'approved' ? '✓ Approved' : 'Approve Provider'}</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                </button>
                                <button
                                    onClick={() => handleVerify('rejected')}
                                    disabled={actionLoading || provider.verificationStatus === 'rejected'}
                                    className="w-full py-4 px-6 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 text-rose-700 dark:text-rose-400 rounded-2xl font-bold flex items-center justify-between active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <span>{provider.verificationStatus === 'rejected' ? '✗ Rejected' : 'Reject Application'}</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                                </button>
                            </div>

                            {provider.verificationStatus !== 'approved' && (
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2" htmlFor="rejection-reason">
                                        Rejection Reason
                                    </label>
                                    <textarea
                                        id="rejection-reason"
                                        rows="4"
                                        placeholder="Enter reason for rejection (required when rejecting)..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        disabled={provider.verificationStatus === 'rejected'}
                                        className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-slate-800 dark:text-white placeholder-slate-400"
                                    />
                                </div>
                            )}

                            {actionLoading && (
                                <div className="text-center text-sm text-indigo-600 animate-pulse font-bold">Processing...</div>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
