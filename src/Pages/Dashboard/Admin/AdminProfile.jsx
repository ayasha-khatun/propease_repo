import useAuth from '../../../hooks/useAuth';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Profile</h2>

      <div className="flex flex-col items-center gap-4">
        <img
          src={user?.photoURL || 'https://i.ibb.co/yf4YV5H/default-avatar.png'}
          alt="Admin Avatar"
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
        />

        <div className="text-center">
          <p className="text-lg font-semibold">Name: {user?.displayName}</p>
          <p className="text-md text-gray-600">Email: {user?.email}</p>
          {user?.role !== 'user' && (
            <p className="text-sm px-3 py-1 bg-green-200 text-green-800 rounded-full mt-2 inline-block">
              Role: {user?.role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
