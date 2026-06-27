import apiClient from './apiClient';

export const categoriesApi = {
  list: (params = {}) => apiClient.get('/categories', { params })
};

export const providersApi = {
  search: (params = {}) => apiClient.get('/search/providers', { params }),
  trending: (params = {}) => apiClient.get('/search/trending', { params }),
  recommended: (params = {}) => apiClient.get('/search/recommended', { params }),
  details: (id) => apiClient.get(`/providers/${id}`),
  pending: (params = {}) => apiClient.get('/admin/providers/pending', { params }),
  verified: (params = {}) => apiClient.get('/admin/providers/verified', { params }),
  all: (params = {}) => apiClient.get('/admin/providers', { params }),
  verify: (id) => apiClient.put(`/admin/provider/${id}/approve`),
  reject: (id, rejectionReason) => apiClient.put(`/admin/provider/${id}/reject`, { rejectionReason }),
  myProfile: () => apiClient.get('/auth/profile'),
  createProfile: (data) => apiClient.post('/providers/create-profile', data),
  update: (data) => apiClient.put('/providers/update-profile', data),
};

export const bookingsApi = {
  create: (payload) => apiClient.post('/bookings/create', payload),
  get: (id) => apiClient.get(`/bookings/${id}`),
  mine: (params = {}) => apiClient.get('/bookings/my-bookings', { params }),
  updateStatus: (id, status) => apiClient.put(`/bookings/${id}/status`, { status }),
  all: (params = {}) => apiClient.get('/bookings/all', { params }),
};

export const availabilityApi = {
  get: (providerId) => apiClient.get(`/availability/provider/${providerId}`),
  slots: (providerId, params) => apiClient.get(`/availability/provider/${providerId}/slots`, { params }),
  updateWorkingHours: (workingHours) => apiClient.put('/availability/working-hours', { workingHours }),
  toggle: (payload) => apiClient.put('/availability/toggle', payload),
  toggleOnline: (isOnline) => apiClient.put('/availability/toggle', { isOnline }),
};

export const paymentsApi = {
  createIntent: (payload) => apiClient.post('/payments/create-payment-intent', payload),
  verify: (payload) => apiClient.post('/payments/verify', payload),
  history: (params = {}) => apiClient.get('/payments/history', { params }),
  providerEarnings: () => apiClient.get('/payments/provider-earnings'),
  razorpayKey: () => apiClient.get('/payments/razorpay-key'),
  adminAll: (params = {}) => apiClient.get('/payments/admin/all', { params }),
};

export const invoicesApi = {
  history: (params = {}) => apiClient.get('/invoices/user/history', { params }),
  byBooking: (bookingId) => apiClient.get(`/invoices/${bookingId}`),
  adminAll: (params = {}) => apiClient.get('/invoices/admin/all', { params }),
};

export const notificationsApi = {
  list: (params = {}) => apiClient.get('/notifications', { params }),
  markRead: (id) => apiClient.put(`/notifications/${id}/read`),
  delete: (id) => apiClient.delete(`/notifications/${id}`),
};

export const reviewsApi = {
  add: (payload) => apiClient.post('/reviews/add', payload),
  byProvider: (providerId, params = {}) => apiClient.get(`/reviews/provider/${providerId}`, { params }),
};

export const chatApi = {
  send: (payload) => apiClient.post('/chat/send', payload),
  byBooking: (bookingId, params = {}) => apiClient.get(`/chat/${bookingId}`, { params }),
};

export const locationApi = {
  providerLocation: (providerId, params = {}) => apiClient.get(`/location/provider/${providerId}`, { params }),
  updateMyLocation: (data) => apiClient.put('/location/update', data),
};

export const analyticsApi = {
  revenue: (params = {}) => apiClient.get('/analytics/revenue', { params }),
  bookings: (params = {}) => apiClient.get('/analytics/bookings', { params }),
  providers: (params = {}) => apiClient.get('/analytics/providers', { params }),
  users: (params = {}) => apiClient.get('/analytics/users', { params }),
};

export const adminApi = {
  dashboard: () => apiClient.get('/admin/dashboard'),
  users: (params = {}) => apiClient.get('/admin/users', { params }),
  deleteUser: (id) => apiClient.delete(`/admin/user/${id}`),
  providers: (params = {}) => apiClient.get('/admin/providers', { params }),
  providerDetail: (id) => apiClient.get(`/admin/provider/${id}`),
  pendingProviders: (params = {}) => apiClient.get('/admin/providers/pending', { params }),
  verifiedProviders: (params = {}) => apiClient.get('/admin/providers/verified', { params }),
  approveProvider: (id) => apiClient.put(`/admin/provider/${id}/approve`),
  rejectProvider: (id, rejectionReason) => apiClient.put(`/admin/provider/${id}/reject`, { rejectionReason }),
};

export const supportApi = {
  create: (payload) => apiClient.post('/support/create-ticket', payload),
  mine: (params = {}) => apiClient.get('/support/my-tickets', { params }),
  // Admin
  all: (params = {}) => apiClient.get('/support/all', { params }),
  update: (id, payload) => apiClient.put(`/support/${id}`, payload),
};

export const reportsApi = {
  all: (params = {}) => apiClient.get('/report/all', { params }),
  moderate: (id, payload) => apiClient.put(`/report/${id}/action`, payload),
};

export const subscriptionApi = {
  plans: () => apiClient.get('/subscription/plans'),
  upgrade: (payload) => apiClient.post('/subscription/upgrade', payload),
  status: () => apiClient.get('/subscription/status'),
};

export const portfolioApi = {
  byProvider: (providerId, params = {}) => apiClient.get(`/portfolio/${providerId}`, { params }),
  add: (formData) => apiClient.post('/portfolio/add', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => apiClient.delete(`/portfolio/${id}`),
};

export const verificationApi = {
  upload: (formData) => apiClient.post('/verification/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  status: () => apiClient.get('/verification/status'),
};

export const addressApi = {
  list: () => apiClient.get('/addresses'),
  create: (payload) => apiClient.post('/addresses', payload),
  update: (id, payload) => apiClient.put(`/addresses/${id}`, payload),
  delete: (id) => apiClient.delete(`/addresses/${id}`),
  setDefault: (id) => apiClient.put(`/addresses/${id}/default`),
};

export const searchApi = {
  providers: (params = {}) => apiClient.get('/search/providers', { params }),
  trending: (params = {}) => apiClient.get('/search/trending', { params }),
  recommended: (params = {}) => apiClient.get('/search/recommended', { params }),
  history: () => apiClient.get('/search/history'),
  clearHistory: () => apiClient.delete('/search/history'),
};
