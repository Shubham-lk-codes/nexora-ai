import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// In dev, VITE_API_BASE_URL is localhost:3000 and vite proxy handles /api → localhost:3000
// In production, VITE_API_BASE_URL is the Render backend and we call it directly
const isDev = import.meta.env.VITE_APP_ENV === 'development';
const BASE_URL = isDev
  ? '/api'
  : `${import.meta.env.VITE_API_BASE_URL}/api`;

export const API_VERSION = import.meta.env.VITE_API_VERSION ?? 'v1';

const api = axios.create({
  baseURL: `${BASE_URL}/${API_VERSION}`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('nexora_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 ─────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nexora_admin_token');
      // Redirect to login when auth is implemented
    }
    return Promise.reject(error);
  },
);

export default api;

// ── Typed helpers ─────────────────────────────────────────────────────────────
export const setAuthToken = (token: string) =>
  localStorage.setItem('nexora_admin_token', token);

export const clearAuthToken = () =>
  localStorage.removeItem('nexora_admin_token');

export const getAuthToken = () =>
  localStorage.getItem('nexora_admin_token');
