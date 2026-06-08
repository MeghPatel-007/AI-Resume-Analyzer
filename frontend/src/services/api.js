import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach session ID to every request
api.interceptors.request.use((config) => {
  let sessionId = localStorage.getItem('ra_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('ra_session_id', sessionId);
  }
  config.headers['x-session-id'] = sessionId;
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export const resumeApi = {
  /**
   * Upload and analyze a resume PDF
   */
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },

  /**
   * Get full analysis report by ID
   */
  getById: (id) => api.get(`/resume/${id}`),

  /**
   * Get session history
   */
  getHistory: (sessionId, page = 1, limit = 10) =>
    api.get(`/resume/history/${sessionId}`, { params: { page, limit } }),

  /**
   * Get aggregate stats
   */
  getStats: () => api.get('/resume/stats/overview'),

  /**
   * Delete a resume
   */
  delete: (id) => api.delete(`/resume/${id}`),
};

export default api;
