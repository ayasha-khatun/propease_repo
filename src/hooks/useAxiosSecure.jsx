// src/hooks/useAxiosSecure.jsx
import axios from "axios";
import { useEffect, useRef } from "react";

const useAxiosSecure = () => {
  // keep the same axios instance across renders
  const axiosSecureRef = useRef(
    axios.create({
      baseURL: "http://localhost:5000", // 🔑 change to your backend base URL
      withCredentials: true,            // ✅ enable if using cookies/session
    })
  );

  useEffect(() => {
    const axiosSecure = axiosSecureRef.current;

    // 🔑 Attach JWT in headers for every request
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 🔑 Handle unauthorized/forbidden responses
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error("⚠️ Unauthorized! Token expired or invalid.", error.response.data);
          localStorage.removeItem("access-token");
        } else if (error.response?.status === 403) {
          console.error("🚫 Forbidden! Insufficient permissions.", error.response.data);
        }
        return Promise.reject(error);
      }
    );

    // cleanup on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // ✅ always return the axios instance
  return axiosSecureRef.current;
};

export default useAxiosSecure;
