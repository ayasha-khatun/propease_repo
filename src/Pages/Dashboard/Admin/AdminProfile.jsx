import useAuth from '../../../hooks/useAuth';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div
      className="
        p-6 max-w-3xl mx-auto 
        bg-white dark:bg-slate-800 
        shadow-md rounded-xl mt-6 
        text-gray-900 dark:text-gray-200
      "
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Admin Profile
      </h2>

      <div className="flex flex-col items-center gap-4">
        <img
          src={user?.photoURL || 'https://i.ibb.co/yf4YV5H/default-avatar.png'}
          alt="Admin Avatar"
          className="
            w-32 h-32 rounded-full object-cover 
            border-2 border-gray-300 dark:border-gray-600
          "
        />

        <div className="text-center space-y-1">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-100">
            Name: {user?.displayName || 'Admin'}
          </p>
          <p className="text-md text-gray-600 dark:text-gray-300">
            Email: {user?.email || 'admin@example.com'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome to your dashboard, admin!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
