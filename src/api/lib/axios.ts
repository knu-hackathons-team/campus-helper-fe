// src/api/lib/axios.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/store/useAuthStore';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://13.209.249.238',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data, statusText } = error.response;
      
      if (status === 401) {
        useAuthStore.getState().logout();
      }

      throw new ApiError(
        status,
        (data as any)?.message || statusText,
        data
      );
    }
    throw error;
  }
);

export default axiosInstance;