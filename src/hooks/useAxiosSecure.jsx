import axios from 'axios';
import { useEffect, useRef } from 'react';

const useAxiosSecure = () => {
  const axiosSecureRef = useRef(
    axios.create({
      baseURL: 'http://localhost:5000', // your backend
      withCredentials: true, // allows cookies (if needed)
    })
  );

  useEffect(() => {
    const axiosSecure = axiosSecureRef.current;

    // Attach token in every request
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle expired or invalid token
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn('⚠️ Unauthorized! Token expired or invalid.');
          // Instead of auto-redirecting here, just remove token
          localStorage.removeItem('access-token');
        } else if (error.response?.status === 403) {
          console.warn('🚫 Forbidden! Insufficient permissions.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosSecureRef.current;
};

export default useAxiosSecure;