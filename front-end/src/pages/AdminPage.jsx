import React, { useEffect, useState } from 'react';
import AddOrEditPlugin from '../components/AddOrEditPlugin';
import AddOrEditUser from '../components/AddOrEditUser';
import AddOrEditCategory from '../components/AddOrEditCategory';

const TABS = ['plugins', 'users', 'orders', 'categories'];

function AdminPage() {
  const [activeTab, setActiveTab] = useState('plugins');
  const [plugins, setPlugins] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const API_BASE = 'http://localhost:4000';

  // Generic fetch function
  const fetchData = async (endpoint, setter, key = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // Nếu key được cung cấp, lấy mảng trong object
      setter(key ? data[key] : data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('/api/plugins/fetchAllplugin', setPlugins); // trả thẳng array
    fetchData('/api/users/fetchAllusers', setUsers); // trả thẳng array
    fetchData('/api/orders/fetchAllOrders', setOrders, 'orders'); // lấy data.orders
    fetchData('/api/categories/fetchAllCategories', setCategories); // lấy data.categories
  }, []);

  // Xử lý xóa item
  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/${type}/delete${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      let data = {};
      try {
        data = await res.json(); // đọc body 1 lần
      } catch (e) {
        // nếu server trả 204 No Content hoặc body rỗng
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete');
      }

      // Reload lại dữ liệu sau khi xóa
      reloadTabData(type);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Xử lý lưu (add hoặc edit)
  const handleSave = () => {
    reloadTabData(activeTab); // reload tab hiện tại
    setIsOpen(false);
    setEditingItem(null);
  };

  // Hàm reload dữ liệu từng tab
  const reloadTabData = (tab) => {
    switch (tab) {
      case 'plugins':
        fetchData('/api/plugins/fetchAllplugin', setPlugins);
        break;
      case 'users':
        fetchData('/api/users/fetchAllusers', setUsers);
        break;
      case 'orders':
        fetchData('/api/orders/fetchAllOrders', setOrders, 'orders');
        break;
      case 'categories':
        fetchData('/api/categories/fetchAllCategories', setCategories);
        break;
      default:
        break;
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsOpen(true);
  };

  // Get current items based on active tab
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

  // Render table headers dynamically
  const renderTableHeader = () => {
    if (activeTab === 'plugins') return ['ID', 'Name', 'Price ($)', 'Actions'];
    if (activeTab === 'users') return ['ID', 'Username', 'Email', 'Actions'];
    if (activeTab === 'orders')
      return ['ID', 'User', 'Status', 'Total(cent)', 'Actions'];
    if (activeTab === 'categories') return ['ID', 'Name', 'Actions'];
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
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

      {/* Main Content */}
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
            {currentItems().map((item) => (
              <tr key={item.id} className="border-t">
                {activeTab === 'plugins' && (
                  <>
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.price}</td>
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
            ))}
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
}

export default AdminPage;
