import React, { useState, useEffect } from 'react';

const PluginModal = ({ isOpen, onClose, onSave, plugin }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  // Khi edit, tự động fill dữ liệu vào form
  useEffect(() => {
    if (plugin) {
      setFormData(plugin);
    } else {
      setFormData({ name: '', description: '', price: '' });
    }
  }, [plugin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // gửi dữ liệu ra ngoài
    onClose(); // đóng modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">
          {plugin ? 'Edit Plugin' : 'Add Plugin'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Plugin name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows="3"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PluginModal;
