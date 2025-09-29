// src/pages/Admin/ManageUsers/ManageUsers.jsx
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [disabledIds, setDisabledIds] = useState([]);

  // Fetch all users
  useEffect(() => {
    axiosSecure.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  }, [axiosSecure]);

  const disableTemporarily = (id) => {
    setDisabledIds(prev => [...prev, id]);
  };

  // Make user admin
  const handleMakeAdmin = (id) => {
    disableTemporarily(id);
    axiosSecure.patch(`/users/make-admin/${id}`)
      .then(() => {
        Swal.fire('Success', 'User promoted to Admin', 'success');
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'admin' } : u));
      })
      .catch(err => console.error(err));
  };

  // Make user agent
  const handleMakeAgent = (id) => {
    disableTemporarily(id);
    axiosSecure.patch(`/users/make-agent/${id}`)
      .then(() => {
        Swal.fire('Success', 'User promoted to Agent', 'success');
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'agent' } : u));
      })
      .catch(err => console.error(err));
  };

  // Mark agent as fraud
  const handleMarkFraud = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This agent will be marked as fraud and all their properties will be removed from All Properties.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, mark as fraud',
      confirmButtonColor: '#d33'
    }).then(result => {
      if (result.isConfirmed) {
        disableTemporarily(id);
        axiosSecure.patch(`/users/mark-fraud/${id}`)
          .then(() => {
            Swal.fire('Marked as Fraud', 'Agent has been flagged.', 'success');
            setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'fraud' } : u));
          })
          .catch(err => {
            console.error(err);
            Swal.fire('Error', 'Something went wrong.', 'error');
          });
      }
    });
  };

  // Delete user (from DB and Firebase)
  const handleDelete = async (id, email) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      confirmButtonColor: '#d33'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/users/${email}`); // backend handles Firebase deletion
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) {
          console.error(err);
          Swal.fire('Error', 'Failed to delete user.', 'error');
        }
      }
    });
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Agent</th>
            <th>Fraud</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const isDisabled = disabledIds.includes(user._id);

            return (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>

                {/* Admin column */}
                <td>
                  {user.role === 'admin' ? (
                    <span className="text-green-600 font-semibold">Admin</span>
                  ) : user.role === 'fraud' ? (
                    <span className="text-gray-400 text-sm">N/A</span>
                  ) : (
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => handleMakeAdmin(user._id)}
                      disabled={isDisabled}
                    >
                      Make Admin
                    </button>
                  )}
                </td>

                {/* Agent column */}
                <td>
                  {user.role === 'agent' ? (
                    <span className="text-blue-600 font-semibold">Agent</span>
                  ) : user.role === 'fraud' ? (
                    <span className="text-gray-400 text-sm">N/A</span>
                  ) : (
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={() => handleMakeAgent(user._id)}
                      disabled={isDisabled}
                    >
                      Make Agent
                    </button>
                  )}
                </td>

                {/* Fraud column */}
                <td>
                  {user.role === 'fraud' ? (
                    <span className="text-red-500 font-semibold">Fraud</span>
                  ) : user.role === 'agent' ? (
                    <button
                      className="btn btn-xs btn-warning"
                      onClick={() => handleMarkFraud(user._id)}
                      disabled={isDisabled}
                    >
                      Mark Fraud
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </td>

                {/* Delete column */}
                <td>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleDelete(user._id, user.email)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
