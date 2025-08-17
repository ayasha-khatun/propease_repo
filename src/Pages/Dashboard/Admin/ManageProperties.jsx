import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from './../../../hooks/useAxiosSecure';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [disabledIds, setDisabledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchProperties = async () => {
    try {
      const res = await axiosSecure.get('/admin/properties');
      setProperties(res.data);
    } catch (err) {
      console.error('Failed to load properties', err);
      Swal.fire('Error', 'Failed to load properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const disableTemporarily = (id) => {
    setDisabledIds((prev) => [...new Set([...prev, id])]);
  };

  const handleVerify = async (id) => {
    disableTemporarily(id);
    try {
      const res = await axiosSecure.patch(`/admin/properties/${id}/verify`);
      if (res.data?.modifiedCount > 0) {
        Swal.fire('Verified!', 'Property has been verified.', 'success');
        fetchProperties();
      } else {
        Swal.fire('No Change', 'No update made to the property.', 'info');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Verification failed.', 'error');
    }
  };

  const handleReject = async (id) => {
    disableTemporarily(id);
    try {
      const res = await axiosSecure.patch(`/admin/properties/${id}/reject`);
      if (res.data?.modifiedCount > 0) {
        Swal.fire('Rejected!', 'Property has been rejected.', 'success');
        fetchProperties();
      } else {
        Swal.fire('No Change', 'No update made to the property.', 'info');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Rejection failed.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Properties</h2>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Location</th>
            <th>Agent</th>
            <th>Email</th>
            <th>Price Range</th>
            <th>Verify</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p, idx) => {
            const isDisabled = disabledIds.includes(p._id);
            const isVerified = p.verificationStatus === 'verified';
            const isRejected = p.verificationStatus === 'rejected';

            return (
              <tr key={p._id || idx}>
                <td>{idx + 1}</td>
                <td>{p.title}</td>
                <td>{p.location}</td>
                <td>{p.agentName || 'N/A'}</td>
                <td>{p.agentEmail || 'N/A'}</td>
                <td>{p.priceRange}</td>
                <td>
                  {isVerified ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                  ) : isRejected ? (
                    <button className="btn btn-xs btn-disabled">Verify</button>
                  ) : (
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => handleVerify(p._id)}
                      disabled={isDisabled}
                    >
                      Verify
                    </button>
                  )}
                </td>
                <td>
                  {isRejected ? (
                    <span className="text-red-500 font-semibold">Rejected</span>
                  ) : isVerified ? (
                    <button className="btn btn-xs btn-disabled">Reject</button>
                  ) : (
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleReject(p._id)}
                      disabled={isDisabled}
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProperties;
