import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';

const AddProperty = () => {
  const { user } = useAuth;
  const [imagePreview, setImagePreview] = useState(null);

  const handleAddProperty = async (e) => {
    e.preventDefault();
    const form = e.target;

    const title = form.title.value;
    const location = form.location.value;
    const image = form.image.files[0];
    const priceMin = parseInt(form.priceMin.value);
    const priceMax = parseInt(form.priceMax.value);

    if (priceMin >= priceMax) {
      Swal.fire('Error', 'Minimum price should be less than maximum price.', 'error');
      return;
    }

    try {
      // Upload image to imgbb or any other service if needed
      const formData = new FormData();
      formData.append('image', image);
      const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`, formData);
      const imageUrl = imgRes.data.data.display_url;

      const newProperty = {
        title,
        location,
        image: imageUrl,
        agentName: user.displayName,
        agentEmail: user.email,
        priceMin,
        priceMax,
        status: 'pending', // verification status by default
      };

      const res = await axios.post('http://localhost:5000/properties', newProperty);
      if (res.data.insertedId) {
        Swal.fire('Success', 'Property added successfully', 'success');
        form.reset();
        setImagePreview(null);
      }
    } catch (err) {
      console.error('Add property error:', err);
      Swal.fire('Error', 'Failed to add property', 'error');
    }
  };

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-md my-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Property</h2>
      <form onSubmit={handleAddProperty} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Property Title</label>
          <input type="text" name="title" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input type="text" name="location" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Property Image</label>
          <input type="file" name="image" accept="image/*" onChange={handlePreview} required className="w-full" />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-48 h-32 object-cover rounded shadow" />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Min Price</label>
            <input type="number" name="priceMin" required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Max Price</label>
            <input type="number" name="priceMax" required className="w-full border p-2 rounded" />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Agent Name</label>
          <input type="text" value={user?.displayName} readOnly className="w-full bg-gray-100 border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Agent Email</label>
          <input type="email" value={user?.email} readOnly className="w-full bg-gray-100 border p-2 rounded" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Add Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
