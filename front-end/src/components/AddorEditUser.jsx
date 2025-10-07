import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const AddOrEditUser = ({ user, onSave, onCancel }) => {
  const { token } = useContext(AuthContext);
  const API_BASE = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'buyer',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'buyer',
        password: '', // password không show khi edit
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = user
        ? `${API_BASE}/users/updateuser/${user.id}`
        : `${API_BASE}/users/adduser`;

      const res = await fetch(url, {
        method: user ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // parse response an toàn
      let result = null;
      const text = await res.text();
      if (text) {
        try {
          result = JSON.parse(text);
        } catch {
          result = { message: text };
        }
      }

      if (!res.ok) throw new Error(result.message || 'Failed to save user');

      onSave(result);
    } catch (err) {
      console.error('Error saving user:', err);
      alert('❌ ' + (err.message || 'Failed to save user'));
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
            {user ? 'Edit User' : 'Add User'}
          </h2>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="border rounded px-3 py-2"
          />
          {!user && (
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="border rounded px-3 py-2"
            />
          )}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="buyer">User</option>
            <option value="admin">Admin</option>
          </select>
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

export default AddOrEditUser;
