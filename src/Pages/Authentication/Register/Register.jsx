import React, { useState } from 'react';
import { useNavigate } from 'react-router';
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

    // ✅ Password Validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must have 6+ characters, one uppercase, and one special character.');
      return;
    }

    try {
      // ✅ Create user with Firebase
      const result = await createUser(email, password);
      const loggedUser = result.user;

      // ✅ Save user to database
      const userData = { name, email, photo, role: 'user' };
      await axios.put(`http://localhost:5000/users/${email}`, userData);

      // ✅ Get JWT token
      const tokenResponse = await axios.post('http://localhost:5000/jwt', { email });
      localStorage.setItem('access-token', tokenResponse.data.token);

      // ✅ Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: `Welcome, ${name}!`,
        confirmButtonColor: '#3085d6'
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.message,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Photo URL */}
        <div>
          <label className="block mb-1">Photo URL</label>
          <input
            type="text"
            name="photo"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Register Button */}
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account? <a href="/login" className="text-blue-600">Login</a>
      </p>
    </div>
  );
};

export default Register;
