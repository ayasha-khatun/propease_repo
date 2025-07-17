import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import SocialLogin from '../SocialLogin/SocialLogin';
import { useLocation, useNavigate } from 'react-router';
// import your signInUser function
import useAuth from './../../../hooks/useAuth';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  const { signIn } = useAuth(); // use your auth context/provider hook

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(result => {
        console.log(result.user);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome back!',
          confirmButtonColor: '#3085d6'
        });
        navigate(from);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
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

        <button className="btn btn-neutral w-full mt-4">Login</button>

        <div className="mt-4 text-sm text-center">
          <p>Don’t have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a></p>
        </div>

        <SocialLogin />
      </form>
    </div>
  );
};

export default Login;
