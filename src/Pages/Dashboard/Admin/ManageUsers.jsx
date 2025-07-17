import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [disabledIds, setDisabledIds] = useState([]);

  useEffect(() => {
    axiosSecure.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, [axiosSecure]);

  const disableTemporarily = (id) => {
    setDisabledIds(prev => [...prev, id]);
  };

  const handleMakeAdmin = (id) => {
    disableTemporarily(id);
    axiosSecure.patch(`/users/make-admin/${id}`)
      .then(() => {
        Swal.fire('Success', 'User promoted to Admin', 'success');
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'admin' } : u));
      });
  };

  const handleMakeAgent = (id) => {
    disableTemporarily(id);
    axiosSecure.patch(`/users/make-agent/${id}`)
      .then(() => {
        Swal.fire('Success', 'User promoted to Agent', 'success');
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'agent' } : u));
      });
  };

  const handleMarkFraud = (id, email) => {
    disableTemporarily(id);
    axiosSecure.patch(`/users/mark-fraud/${id}`)
      .then(() => {
        Swal.fire('Marked as Fraud', '', 'warning');
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'fraud' } : u));
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "User will be removed!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${id}`)
          .then(() => {
            Swal.fire('Deleted!', '', 'success');
            setUsers(users.filter(u => u._id !== id));
          });
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
          {
            users.map((user, index) => {
              const isDisabled = disabledIds.includes(user._id);

              return (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.role === 'admin' ? (
                      <span className="text-green-600 font-semibold">Admin</span>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="btn btn-xs btn-success"
                        disabled={isDisabled}
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                  <td>
                    {user.role === 'agent' ? (
                      <span className="text-blue-600 font-semibold">Agent</span>
                    ) : (
                      <button
                        onClick={() => handleMakeAgent(user._id)}
                        className="btn btn-xs btn-primary"
                        disabled={isDisabled}
                      >
                        Make Agent
                      </button>
                    )}
                  </td>
                  <td>
                    {user.role === 'agent' &&
                      <button
                        onClick={() => handleMarkFraud(user._id, user.email)}
                        className="btn btn-xs btn-warning"
                        disabled={isDisabled}
                      >
                        Fraud
                      </button>}
                    {user.role === 'fraud' && (
                      <span className="text-red-500 font-semibold">Fraud</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
