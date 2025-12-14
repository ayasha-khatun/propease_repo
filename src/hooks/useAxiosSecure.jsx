// src/hooks/useAxiosSecure.jsx
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// FIX: axios instance created OUTSIDE the hook
const axiosSecureInstance = axios.create({
  baseURL: "https://propease-server-side.vercel.app",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Attach JWT token to each request
    const reqInterceptor = axiosSecureInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle 401 globally
    const resInterceptor = axiosSecureInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("access-token");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecureInstance.interceptors.request.eject(reqInterceptor);
      axiosSecureInstance.interceptors.response.eject(resInterceptor);
    };
  }, [navigate]);

  return axiosSecureInstance; 
};

export default useAxiosSecure;
