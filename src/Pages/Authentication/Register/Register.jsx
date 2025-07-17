import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
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

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const result = await createUser(email, password);
      const loggedUser = result.user;

      // Save user to database
      const userData = { name, email, role: 'user' };
      await axios.put(`http://localhost:5000/users/${email}`, userData);

      // Get JWT token
      const tokenResponse = await axios.post('http://localhost:5000/jwt', { email });
      localStorage.setItem('access-token', tokenResponse.data.token);

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
