import React from 'react';
import useAuth from '../../../hooks/useAuth';

const MyProfile = () => {
  const { user } = useAuth();

  return (
    <div
      className="
        p-6 max-w-3xl mx-auto mt-10
        bg-white dark:bg-slate-800 
        shadow rounded-md
        text-gray-900 dark:text-gray-200
      "
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 dark:text-gray-100">
        My Profile
      </h2>

      <div className="flex flex-col items-center text-center space-y-2">
        <img
          src={user?.photoURL || 'https://i.ibb.co/YdX4Rw5/user-placeholder.png'}
          alt="User"
          className="
            w-28 h-28 rounded-full 
            border-2 border-gray-300 dark:border-gray-600 
            mb-4
          "
        />

        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {user?.displayName || 'N/A'}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{user?.email || 'N/A'}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome to your dashboard, user!
        </p>
      </div>
    </div>
  );
};

export default MyProfile;
