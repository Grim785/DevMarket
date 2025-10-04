import React, { useEffect, useState } from 'react';
import AddOrEditPlugin from '../components/AddOrEditPlugin';

function AdminPage() {
  const [plugins, setPlugins] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('plugins');
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState(null);

  // Load plugins
  const loadPlugins = () => {
    fetch('http://localhost:4000/api/plugins/fetchAllplugin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPlugins(data))
      .catch((err) => console.error(err));
  };

  // Load users
  const loadUsers = () => {
    fetch('http://localhost:4000/api/users/fetchAllusers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadPlugins();
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plugin?')) return;
    try {
      await fetch(`http://localhost:4000/api/plugins/deleteplugin/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      loadPlugins(); // reload
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    loadPlugins(); // reload sau khi thêm/sửa
    setIsOpen(false);
    setEditingPlugin(null);
  };

  const handleEdit = (plugin) => {
    setEditingPlugin(plugin);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingPlugin(null);
    setIsOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">DevMarket Admin</h2>
        <ul className="space-y-2">
          {['plugins', 'users', 'orders'].map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer px-3 py-2 rounded ${
                activeTab === tab
                  ? 'bg-gray-700 font-semibold'
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === 'plugins' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">Manage Plugins</h3>
              <button
                onClick={handleAdd}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                + Add Plugin
              </button>
            </div>

            {/* Plugin Table */}
            <table className="w-full bg-white shadow rounded overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left px-4 py-2">ID</th>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Price ($)</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plugins.map((plugin) => (
                  <tr key={plugin.id} className="border-t">
                    <td className="px-4 py-2">{plugin.id}</td>
                    <td className="px-4 py-2">{plugin.name}</td>
                    <td className="px-4 py-2">{plugin.price}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(plugin)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plugin.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">Manage Users</h3>
            </div>
            <table className="w-full bg-white shadow rounded overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left px-4 py-2">ID</th>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <h3 className="text-2xl font-semibold">Manage Orders</h3>
        )}
      </main>

      {/* Modal */}
      {isOpen && (
        <AddOrEditPlugin
          plugin={editingPlugin}
          onSave={handleSave}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminPage;
