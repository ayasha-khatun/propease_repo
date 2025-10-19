import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { updateProfile } from 'firebase/auth';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';

const Register = () => {
  const { createUser } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photo = form.photo.value;

    // ✅ Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must have 6+ characters, one uppercase, and one special character.');
      return;
    }

    try {
      // ✅ Create user in Firebase
      const result = await createUser(email, password);
      const loggedUser = result.user;

      // ✅ Update Firebase displayName and photoURL
      await updateProfile(loggedUser, {
        displayName: name,
        photoURL: photo
      });

      // ✅ Save to MongoDB
      const userData = { name, email, photo, role: 'user' };
      await axios.put(`https://propease-server-side.vercel.app/users/${email}`, userData);

      // ✅ Get JWT Token
      const tokenRes = await axios.post('https://propease-server-side.vercel.app/jwt', { email });
      localStorage.setItem('access-token', tokenRes.data.token);

      // ✅ Show Success
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: `Welcome, ${name}!`,
        confirmButtonColor: '#3085d6'
      });

      // ✅ Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.message || 'Something went wrong!',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Photo URL */}
        <div>
          <label className="block mb-1 font-medium">Photo URL</label>
          <input
            type="text"
            name="photo"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Error Display */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded transition"
        >
          Register
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;
