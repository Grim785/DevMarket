import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext'; // hook từ context Socket

const CategoryPage = () => {
  const { slug } = useParams();
  const socket = useSocket(); // Lấy socket từ context
  const [categoryName, setCategoryName] = useState('');
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlugins();
  }, [slug]);

  const fetchPlugins = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/categories/${slug}`);
      if (!res.ok) throw new Error('Lỗi khi tải dữ liệu.');
      const data = await res.json();
      setCategoryName(data.category);
      setPlugins(data.plugins || []);
    } catch (error) {
      console.error('Error fetching category plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- real-time với socket ---
  useEffect(() => {
    if (!socket) return;
    const handleNewPlugin = (plugin) => {
      // Chỉ thêm plugin nếu cùng category
      if (plugin.category === slug) {
        setPlugins((prev) => [...prev, plugin]);
      }
    };

    const handleDeletePlugin = (deletedPluginData) => {
      setPlugins((prev) => prev.filter((p) => p.id !== deletedPluginData.id));
    };

    const handleUpdatePlugin = (plugin) => {
      setPlugins((prev) => prev.map((p) => (p.id === plugin.id ? plugin : p)));
    };
    socket.on('newPlugin', handleNewPlugin);
    socket.on('deletePlugin', handleDeletePlugin);
    socket.on('updatePlugin', handleUpdatePlugin);

    return () => {
      socket.off('newPlugin', handleNewPlugin);
      socket.off('deletePlugin', handleDeletePlugin);
      socket.off('updatePlugin', handleUpdatePlugin);
    };
  }, [socket, slug]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading....</p>
      </div>
    );

  if (plugins.length === 0)
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">{categoryName}</h2>
        <p className="text-gray-500">
          Hiện chưa có plugin nào trong danh mục này.
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Link to="/" className="text-blue-500 mb-4 inline-block">
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-8 text-center">{categoryName}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <img
              src={
                plugin.thumbnail
                  ? plugin.thumbnail.startsWith('http')
                    ? plugin.thumbnail // đã là URL đầy đủ
                    : `http://localhost:4000${plugin.thumbnail}` // prepend domain
                  : 'https://microsoft.design/wp-content/uploads/2025/02/Waves-2.png'
              }
              alt={plugin.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                {plugin.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {plugin.description}
              </p>
              <p className="text-blue-600 font-semibold mb-3">
                {Number(plugin.price)?.toFixed(2)}
              </p>
              <Link
                to={`/plugin/${plugin.id}/${plugin.slug}`}
                className="inline-block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
