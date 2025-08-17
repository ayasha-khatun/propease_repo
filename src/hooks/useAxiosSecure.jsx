import axios from 'axios';
import { useEffect, useRef } from 'react';

const useAxiosSecure = () => {
  const axiosSecureRef = useRef(
    axios.create({
      baseURL: 'http://localhost:5000',
      withCredentials: true,
    })
  );

  useEffect(() => {
    const axiosSecure = axiosSecureRef.current;

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

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          window.location.href = '/login';
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
