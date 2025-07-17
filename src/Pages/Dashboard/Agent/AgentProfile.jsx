import React from 'react';
import useAuth from '../../../hooks/useAuth';

const AgentProfile = () => {
  const { user } = useAuth;

  return (
    <div className="min-h-[calc(100vh-100px)] flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <img
          src={user?.photoURL || 'https://i.ibb.co/tQz1P6x/default-user.png'}
          alt="Profile"
          className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-400"
        />
        <h2 className="text-2xl font-bold mb-2">{user?.displayName || 'Agent'}</h2>
        <p className="text-gray-600 mb-1">Email: {user?.email}</p>
        
        {/* Show role only if not 'user' */}
        {user?.role !== 'user' && (
          <p className="text-blue-600 font-semibold">Role: {user.role}</p>
        )}

        {/* You can add more agent-specific info here */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">Welcome to your dashboard, agent!</p>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
