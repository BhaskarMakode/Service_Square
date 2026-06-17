import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// For multiple requests waiting on the token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops if the refresh token endpoint itself returns 401
      if (originalRequest.url.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Use standard axios to avoid triggering our own interceptors
        const res = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh-token`, { refreshToken });
        
        const newAuthToken = res.data?.data?.token;
        const newRefreshToken = res.data?.data?.refreshToken;
        
        if (newAuthToken) {
          localStorage.setItem('token', newAuthToken);
          if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
          
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAuthToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAuthToken}`;
          
          processQueue(null, newAuthToken);
          return apiClient(originalRequest);
        }
        throw new Error('Refresh failed');
      } catch (err) {
        processQueue(err, null);
        // Session expired, clean up
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        // Let the app know session expired (AuthContext could listen to this or we just reload)
        window.location.href = '/login'; 
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
