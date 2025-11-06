import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import SocialLogin from '../SocialLogin/SocialLogin';
import { useLocation, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import { Link } from "react-router-dom";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  const { signIn, signInWithGoogle } = useAuth(); // include your social login methods

  // 💡 Function to get JWT from backend
  const getJwtToken = async (email) => {
    try {
      const response = await axios.post('https://propease-server-side.vercel.app/jwt', { email });
      localStorage.setItem('access-token', response.data.token); // store token
    } catch (err) {
      console.error('JWT request failed:', err);
    }
  };

  // 💡 Regular email/password login
  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(async result => {
        console.log(result.user);

        // get JWT token
        await getJwtToken(data.email);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome back!',
          confirmButtonColor: '#3085d6'
        });
        navigate(from, { replace: true });
      })
      .catch(error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password',
          confirmButtonColor: '#d33'
        });
      });
  };

  // 💡 Social login handler (example: Google)
const handleGoogleLogin = async () => {
  try {
    const result = await signInWithGoogle();
    const user = result.user;

    console.log("Logged in user:", user);
    // Access properties:
    console.log(user.uid, user.email, user.displayName);

    // Get JWT for backend
    const token = await user.getIdToken();
    localStorage.setItem("access-token", token);

    // Redirect user
    navigate(from, { replace: true });
  } catch (error) {
    console.error("Social login failed:", error.message);
    alert("Login failed, please try again.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full input input-bordered"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                message: 'Must contain an uppercase letter and a special character'
              }
            })}
            className="w-full input input-bordered"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>}
        </div>

        <button className="btn bg-gradient-to-r from-primary to-secondary text-white w-full mt-4">Login</button>

        <div className="mt-4 text-sm text-center">
         <p>
  Don’t have an account?{" "}
  <Link to="/register" className="text-blue-600 hover:underline">
    Register
  </Link>
</p>
    </div>

        {/* Social Login Buttons */}
        <SocialLogin onGoogleLogin={handleGoogleLogin} />
      </form>
    </div>
  );
};

export default Login;
