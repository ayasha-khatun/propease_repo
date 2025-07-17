import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      Swal.fire("Error", "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Make user admin
  const handleMakeAdmin = async (email) => {
    try {
      await axios.patch(`http://localhost:5000/admin/users/make-admin/${email}`);
      Swal.fire("Success", `${email} is now an Admin`, "success");
      fetchUsers();
    } catch (error) {
      Swal.fire("Error", "Failed to make admin", "error");
    }
  };

  // Make user agent
  const handleMakeAgent = async (email) => {
    try {
      await axios.patch(`http://localhost:5000/admin/users/make-agent/${email}`);
      Swal.fire("Success", `${email} is now an Agent`, "success");
      fetchUsers();
    } catch (error) {
      Swal.fire("Error", "Failed to make agent", "error");
    }
  };

  // Mark agent as fraud
  const handleMarkFraud = async (email) => {
    const result = await Swal.fire({
      title: "Mark agent as fraud?",
      text: "This will remove all their properties and disable future additions.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, mark fraud!",
    });
    if (result.isConfirmed) {
      try {
        await axios.patch(`http://localhost:5000/admin/users/mark-fraud/${email}`);
        Swal.fire("Marked", `${email} marked as fraud agent`, "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Error", "Failed to mark fraud", "error");
      }
    }
  };

  // Delete user
  const handleDeleteUser = async (email) => {
    const result = await Swal.fire({
      title: "Delete user?",
      text: "This will delete the user from the system and Firebase.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/admin/users/${email}`);
        Swal.fire("Deleted", `${email} deleted`, "success");
        setUsers(users.filter((user) => user.email !== email));
      } catch (error) {
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">User Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-center border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role || "User"}</td>
                  <td className="py-2 px-4 space-x-2">
                    {user.role === "fraud" ? (
                      <span className="text-red-600 font-semibold">Fraud</span>
                    ) : (
                      <>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleMakeAdmin(user.email)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                          >
                            Make Admin
                          </button>
                        )}
                        {user.role !== "agent" && (
                          <button
                            onClick={() => handleMakeAgent(user.email)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                          >
                            Make Agent
                          </button>
                        )}
                        {user.role === "agent" && (
                          <button
                            onClick={() => handleMarkFraud(user.email)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          >
                            Mark as Fraud
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.email)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
