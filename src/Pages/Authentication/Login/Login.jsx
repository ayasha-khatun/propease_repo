import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const { signIn, signInWithGoogle } = useAuth();

  // ✅ Request JWT from backend
  const getJwtToken = async (email) => {
    try {
      const response = await axios.post("https://propease-server-side.vercel.app/jwt", { email });
      localStorage.setItem("access-token", response.data.token);
      return response.data.token;
    } catch (err) {
      console.error("JWT request failed:", err);
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Failed to get token from server",
        confirmButtonColor: "#d33",
        background: "#1f2937",
        color: "#f3f4f6",
      });
      throw err;
    }
  };

  // ✅ Email/password login
  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);
      const token = await getJwtToken(data.email);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonColor: "#3085d6",
        background: "#1f2937",
        color: "#f3f4f6",
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid email or password",
        confirmButtonColor: "#d33",
        background: "#1f2937",
        color: "#f3f4f6",
      });
    }
  };

  // ✅ Social login (Google)
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      await getJwtToken(user.email);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonColor: "#3085d6",
        background: "#1f2937",
        color: "#f3f4f6",
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Social Login Failed",
        text: error.message,
        confirmButtonColor: "#d33",
        background: "#1f2937",
        color: "#f3f4f6",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md transition-colors duration-300"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Login</h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full input input-bordered border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
              pattern: { value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/, message: "Must contain uppercase and special char" },
            })}
            className="w-full input input-bordered border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>}
        </div>

        <button className="btn bg-gradient-to-r from-primary to-secondary text-white w-full mt-4">Login</button>

        <div className="mt-4 text-sm text-center text-gray-700 dark:text-gray-200">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Register</Link>
          </p>
        </div>

        {/* Social Login Buttons */}
        <SocialLogin onGoogleLogin={handleGoogleLogin} />
      </form>
    </div>
  );
};

export default Login;
