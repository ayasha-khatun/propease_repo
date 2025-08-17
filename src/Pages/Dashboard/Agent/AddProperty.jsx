import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddProperty = () => {
  const { user } = useAuth() || {};
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const imageUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'; // Simulated

      const newProperty = {
        title: data.title,
        location: data.location,
        image: imageUrl,
        priceRange: data.priceRange,
        agentName: user?.displayName || 'Unknown Agent',
        agentEmail: user?.email || 'unknown@example.com',
        status: 'pending',
        timestamp: new Date()
      };

      const res = await axiosSecure.post('/properties', newProperty);
      console.log('Backend response:', res.data);

      if (res.data.insertedId) {
        Swal.fire('Success', 'Property added successfully!', 'success');
        reset();
        setImagePreview(null);
      } else {
        Swal.fire('Error', 'Failed to add property.', 'error');
      }
    } catch (error) {
      console.error('Add property error:', error);
      Swal.fire('Error', 'Something went wrong. Try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Add New Property</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Property Title</label>
          <input
            type="text"
            {...register('title', { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter property title"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            {...register('location', { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter location"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price Range</label>
          <input
            type="text"
            {...register('priceRange', { required: true })}
            className="input input-bordered w-full"
            placeholder="$1000 - $5000"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            {...register('image', { required: true })}
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleImageChange}
          />
        </div>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border mt-2"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Agent Name</label>
            <input
              type="text"
              value={user?.displayName || ''}
              className="input input-bordered w-full bg-gray-100"
              readOnly
              disabled
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Agent Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="input input-bordered w-full bg-gray-100"
              readOnly
              disabled
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-6"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Property'}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
