import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const AddOrEditCategory = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const { token } = useContext(AuthContext); // lấy token từ context
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (category) setName(category.name || '');
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = category
        ? `${API_BASE}/categories/updatecategory/${category.id}`
        : `${API_BASE}/categories/addcategory`;

      const res = await fetch(url, {
        method: category ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
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

      if (!res.ok) throw new Error(result.message || 'Failed to save category');

      onSave(result);
    } catch (err) {
      console.error(err);
      alert('❌ ' + (err.message || 'Failed to save category'));
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
            {category ? 'Edit Category' : 'Add Category'}
          </h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            required
            className="border rounded px-3 py-2"
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

export default AddOrEditCategory;
