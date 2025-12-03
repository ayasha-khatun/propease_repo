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

// Password validation
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
if (!passwordRegex.test(password)) {
  setError('Password must have 6+ characters, one uppercase, and one special character.');
  return;
}

try {
  // Create user in Firebase
  const result = await createUser(email, password);
  const loggedUser = result.user;

  // Update Firebase displayName and photoURL
  await updateProfile(loggedUser, { displayName: name, photoURL: photo });

  // Save user to MongoDB
  const userData = { name, email, photo, role: 'user' };
  await axios.put(`https://propease-server-side.vercel.app/users/${email}`, userData);

  // Get JWT
  const tokenRes = await axios.post('https://propease-server-side.vercel.app/jwt', { email });
  localStorage.setItem('access-token', tokenRes.data.token);

  // Success alert
  Swal.fire({
    icon: 'success',
    title: 'Registration Successful',
    text: `Welcome, ${name}!`,
    confirmButtonColor: '#3085d6',
    background: '#1f2937', // dark mode
    color: '#f3f4f6'
  });

  navigate('/');
} catch (err) {
  console.error('Registration error:', err);
  Swal.fire({
    icon: 'error',
    title: 'Registration Failed',
    text: err.message || 'Something went wrong!',
    background: '#1f2937',
    color: '#f3f4f6'
  });
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300"> <div className="max-w-md w-full p-6 rounded shadow-md bg-white dark:bg-gray-800 transition-colors duration-300"> <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Create Account</h2> <form onSubmit={handleRegister} className="space-y-4">
{/* Name */} <div> <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Name</label> <input
           type="text"
           name="name"
           required
           className="w-full px-3 py-2 border rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
           placeholder="Enter your name"
         /> </div>


      {/* Email */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-3 py-2 border rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          placeholder="Enter your email"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Password</label>
        <input
          type="password"
          name="password"
          required
          className="w-full px-3 py-2 border rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          placeholder="Enter your password"
        />
      </div>

      {/* Photo URL */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Photo URL</label>
        <input
          type="text"
          name="photo"
          required
          className="w-full px-3 py-2 border rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          placeholder="Enter photo URL"
        />
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded transition"
      >
        Register
      </button>
    </form>

    <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-200">
      Already have an account?{' '}
      <a href="/login" className="text-blue-600 dark:text-blue-400 underline">
        Login
      </a>
    </p>
  </div>
</div>


);
};

export default Register;
