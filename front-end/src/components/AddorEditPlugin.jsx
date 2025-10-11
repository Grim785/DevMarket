import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const AddOrEditPlugin = ({ plugin, onSave, onCancel }) => {
  const { token, user } = useContext(AuthContext);
  const API_BASE = import.meta.env.VITE_API_URL;

  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '',
    price: '',
    author: '',
    downloads: 0,
    rating: 0,
    status: 'pending',
    file: '',
    thumbnail: '',
    categoryId: '',
    userId: user.id,
  });

  // Load categories & users
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories/fetchAllCategories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/fetchAllusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchCategories();
    fetchUsers();
  }, [API_BASE, token]);

  // Set form data when editing
  useEffect(() => {
    if (plugin) {
      setFormData({
        name: plugin.name || '',
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
        userId: user.id,
      });
    }
  }, [plugin, user.id]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      const url = plugin
        ? `${API_BASE}/plugins/updateplugin/${plugin.id}`
        : `${API_BASE}/plugins/addplugin`;

      const res = await fetch(url, {
        method: plugin ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Không set Content-Type
        },
        body: data,
      });

      // Parse response an toàn
      let result = null;
      const text = await res.text();
      if (text) {
        try {
          result = JSON.parse(text);
        } catch {
          result = { message: text };
        }
      }

      if (!res.ok) throw new Error(result.message || 'Failed to save plugin');

      onSave(result);
    } catch (err) {
      console.error('Error saving plugin:', err);
      alert('❌ ' + (err.message || 'Failed to save plugin'));
    } finally {
      setLoading(false);
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
          <select
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Author</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFile}
              onChange={() => setIsFile(!isFile)}
            />
            Upload thumbnail file
          </label>

          {isFile ? (
            <input
              type="file"
              name="thumbnail"
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <input
              type="text"
              name="thumbnail"
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Thumbnail URL (or upload below)"
            />
          )}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrEditPlugin;
