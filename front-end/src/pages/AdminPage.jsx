import React, { useEffect, useState, useContext } from 'react';
import AddOrEditPlugin from '../components/AddorEditPlugin';
import AddOrEditUser from '../components/AddorEditUser';
import AddOrEditCategory from '../components/AddorEditCategory';
import { AuthContext } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';

const TABS = ['plugins', 'users', 'orders', 'categories'];

const AdminPage = () => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('plugins');

  // State cho từng tab
  const [plugins, setPlugins] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const socket = useSocket();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    document.title = 'Admin';
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // nếu không phải admin → redirect về homepage
    }
  }, [user]);

  // =======================
  // Generic fetch function
  // =======================
  const fetchData = async (endpoint, setter, key = 'data') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();

      // Nếu có key, lấy data[key] hoặc [] nếu không có
      if (key && Array.isArray(result[key])) setter(result[key]);
      else if (Array.isArray(result)) setter(result);
      else setter([]);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setter([]);
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // Initial fetch
  // =======================
  useEffect(() => {
    fetchData('/plugins/fetchAllplugin', setPlugins);
    fetchData('/users/fetchAllusers', setUsers);
    fetchData('/orders/fetchAllOrders', setOrders, 'orders');
    fetchData('/categories/fetchAllCategories', setCategories);
  }, []);

  // =======================
  // Socket updates
  // =======================
  useEffect(() => {
    if (!socket) return;
    const handleNewUser = () => fetchData('/users/fetchAllusers', setUsers);
    const handleNewOrder = () =>
      fetchData('/orders/fetchAllOrders', setOrders, 'orders');
    const handleUpdateOrder = () =>
      fetchData('/orders/fetchAllOrders', setOrders, 'orders');

    socket.on('newUser', handleNewUser);
    socket.on('newOrder', handleNewOrder);
    socket.on('updateOrder', handleUpdateOrder);

    return () => {
      socket.off('newUser', handleNewUser);
      socket.off('newOrder', handleNewOrder);
      socket.off('updateOrder', handleUpdateOrder);
    };
  }, [socket]);

  // =======================
  // CRUD Handlers
  // =======================
  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`${API_BASE}/${type}/delete${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json(); // đọc JSON từ backend

      if (!res.ok) throw new Error(data.message || 'Failed to delete');
      alert(data.message || 'Deleted successfully');
      reloadTabData(type);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleSave = () => {
    reloadTabData(activeTab);
    setIsOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsOpen(true);
  };

  const reloadTabData = (tab) => {
    switch (tab) {
      case 'plugins':
        fetchData('/plugins/fetchAllplugin', setPlugins);
        break;
      case 'users':
        fetchData('/users/fetchAllusers', setUsers);
        break;
      case 'orders':
        fetchData('/orders/fetchAllOrders', setOrders, 'orders');
        break;
      case 'categories':
        fetchData('/categories/fetchAllCategories', setCategories);
        break;
      default:
        break;
    }
  };

  // =======================
  // Current items
  // =======================
  const currentItems = () => {
    switch (activeTab) {
      case 'plugins':
        return plugins;
      case 'users':
        return users;
      case 'orders':
        return orders;
      case 'categories':
        return categories;
      default:
        return [];
    }
  };

  // =======================
  // Table headers
  // =======================
  const renderTableHeader = () => {
    if (activeTab === 'plugins') return ['ID', 'Name', 'Price ($)', 'Actions'];
    if (activeTab === 'users') return ['ID', 'Username', 'Email', 'Actions'];
    if (activeTab === 'orders')
      return ['ID', 'User', 'Status', 'Total', 'Actions'];
    if (activeTab === 'categories') return ['ID', 'Name', 'Actions'];
    return [];
  };

  // =======================
  // Render
  // =======================
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-56 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">DevMarket Admin</h2>
        <ul className="space-y-2">
          {TABS.map((tab) => (
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

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">
            Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add {activeTab.slice(0, -1)}
          </button>
        </div>

        {loading && <p>Loading...</p>}
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              {renderTableHeader().map((h) => (
                <th key={h} className="text-left px-4 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(currentItems()) ? currentItems() : []).map(
              (item) => (
                <tr key={item.id} className="border-t">
                  {activeTab === 'plugins' && (
                    <>
                      <td className="px-4 py-2">{item.id}</td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.price || '-'}</td>
                    </>
                  )}
                  {activeTab === 'users' && (
                    <>
                      <td className="px-4 py-2">{item.id}</td>
                      <td className="px-4 py-2">{item.username}</td>
                      <td className="px-4 py-2">{item.email}</td>
                    </>
                  )}
                  {activeTab === 'orders' && (
                    <>
                      <td className="px-4 py-2">{item.id}</td>
                      <td className="px-4 py-2">{item.userId}</td>
                      <td className="px-4 py-2">{item.status}</td>
                      <td className="px-4 py-2">{item.totalAmount}</td>
                    </>
                  )}
                  {activeTab === 'categories' && (
                    <>
                      <td className="px-4 py-2">{item.id}</td>
                      <td className="px-4 py-2">{item.name}</td>
                    </>
                  )}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(activeTab, item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </main>

      {isOpen && activeTab === 'plugins' && (
        <AddOrEditPlugin
          plugin={editingItem}
          onSave={handleSave}
          onCancel={() => setIsOpen(false)}
        />
      )}
      {isOpen && activeTab === 'users' && (
        <AddOrEditUser
          user={editingItem}
          onSave={handleSave}
          onCancel={() => setIsOpen(false)}
        />
      )}
      {isOpen && activeTab === 'categories' && (
        <AddOrEditCategory
          category={editingItem}
          onSave={handleSave}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPage;
