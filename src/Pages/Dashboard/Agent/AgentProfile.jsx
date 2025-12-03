import React from 'react';
import useAuth from '../../../hooks/useAuth';

const AgentProfile = () => {
  const { user } = useAuth();

  return (
    <div
      className="
        min-h-[calc(100vh-100px)] 
        flex justify-center items-center 
        bg-gray-50 dark:bg-slate-900 
        text-gray-900 dark:text-gray-200
      "
    >
      <div
        className="
          bg-white dark:bg-slate-800 
          shadow-md rounded-lg 
          p-6 max-w-md w-full text-center
        "
      >
        <img
          src={user?.photoURL || 'https://i.ibb.co/tQz1P6x/default-user.png'}
          alt="Profile"
          className="
            w-28 h-28 rounded-full mx-auto mb-4 
            border-4 border-blue-400 dark:border-blue-500
          "
        />

        <h2 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-100">
          {user?.displayName || 'Agent'}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-1">
          Email: {user?.email}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome to your dashboard, agent!
        </p>
      </div>
    </div>
  );
};

export default AgentProfile;
