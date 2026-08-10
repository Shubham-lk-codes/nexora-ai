import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

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
    const token = localStorage.getItem('nexora_vendor_token');
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
      localStorage.removeItem('nexora_vendor_token');
    }
    return Promise.reject(error);
  },
);

export default api;

export const setAuthToken = (token: string) =>
  localStorage.setItem('nexora_vendor_token', token);

export const clearAuthToken = () =>
  localStorage.removeItem('nexora_vendor_token');

export const getAuthToken = () =>
  localStorage.getItem('nexora_vendor_token');
