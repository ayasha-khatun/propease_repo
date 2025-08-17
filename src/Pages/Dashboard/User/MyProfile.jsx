import React from 'react';
import useAuth from '../../../hooks/useAuth';

const MyProfile = () => {
  const { user } = useAuth();
  

  return (
    <div className="p-6 bg-white shadow rounded-md max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">My Profile</h2>

      <div className="flex flex-col items-center text-center">
        <img
          src={user?.photoURL || 'https://i.ibb.co/YdX4Rw5/user-placeholder.png'}
          alt="User"
          className="w-28 h-28 rounded-full border-2 border-gray-300 mb-4"
        />

        <h3 className="text-xl font-semibold text-gray-800">{user?.displayName || 'N/A'}</h3>
        <p className="text-gray-600">{user?.email}</p>
        <div>
          <p className="text-sm text-gray-500">Welcome to your dashboard, user!</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
