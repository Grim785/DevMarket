import React, { useEffect, useState } from 'react';

const AddOrEditPlugin = ({ plugin, onSave, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    version: '',
    price: '',
    author: '',
    downloads: 0,
    rating: 0,
    status: 'pending',
    fileUrl: '',
    thumbnail: '',
    categoryId: '',
  });

  useEffect(() => {
    fetch('http://localhost:4000/api/categories/fetchAllCategories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error('Error fetching categories:', err));

    fetch('http://localhost:4000/api/users/fetchAllusers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  useEffect(() => {
    if (plugin) {
      setFormData({
        name: plugin.name || '',
        slug: plugin.slug || '',
        description: plugin.description || '',
        version: plugin.version || '',
        price: plugin.price || '',
        author: plugin.author || '',
        downloads: plugin.downloads || 0,
        rating: plugin.rating || 0,
        status: plugin.status || 'pending',
        file: plugin.fileUrl || '',
        thumbnail: plugin.thumbnail || '',
        categoryId: plugin.categoryId || '',
      });
    }
  }, [plugin]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, file: files[0] })); // 👈 lưu vào "file"
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      // Append tất cả field
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch(
        plugin
          ? `http://localhost:4000/api/plugins/updateplugin/${plugin.id}`
          : 'http://localhost:4000/api/plugins/upload',
        {
          method: plugin ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            // ❌ KHÔNG set Content-Type, để browser tự set
          },
          body: data,
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Failed to save plugin');
      }

      onSave(result);
    } catch (err) {
      console.error('Error saving plugin:', err);
      alert('❌ ' + (err.message || 'Failed to save plugin'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold mb-2">
            {plugin ? 'Edit Plugin' : 'Add Plugin'}
          </h2>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Slug"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="version"
            value={formData.version}
            onChange={handleChange}
            placeholder="Version"
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            min="0"
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Author dropdown */}
          <select
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Author</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>

          {/* Category dropdown */}
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status radio */}
          <div className="flex gap-2 items-center">
            {['pending', 'approved', 'rejected'].map((status) => (
              <label key={status} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={handleChange}
                  className="form-radio"
                />
                {status}
              </label>
            ))}
          </div>

          {/* File upload */}
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="Thumbnail URL"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrEditPlugin;
