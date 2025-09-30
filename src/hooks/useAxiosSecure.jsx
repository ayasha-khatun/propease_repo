// src/hooks/useAxiosSecure.jsx
import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useAxiosSecure = () => {
  const navigate = useNavigate();

  const axiosSecureRef = useRef(
    axios.create({
      baseURL: "https://propease-server-side.vercel.app",
      withCredentials: true,
    })
  );

  useEffect(() => {
    const axiosSecure = axiosSecureRef.current;

    // Attach JWT token to request headers
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

    // Handle unauthorized and forbidden responses
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("⚠️ Unauthorized! Token expired or invalid.", error.response.data);
          localStorage.removeItem("access-token");
          navigate("/login"); // Redirect user to login page
        } else if (error.response?.status === 403) {
          console.error("🚫 Forbidden! Insufficient permissions.", error.response.data);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosSecureRef.current;
};

export default useAxiosSecure;
