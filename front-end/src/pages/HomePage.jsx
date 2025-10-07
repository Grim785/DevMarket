import { useEffect, useState } from 'react';
import PluginModal from '../components/PluginModal';
import { useSocket } from '../contexts/SocketContext';

const API_BASE = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [plugins, setPlugins] = useState([]);
  const socket = useSocket();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    document.title = 'Home';
  }, []);

  // --- Fetch plugin theo trang ---
  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/plugins/fetchAllplugin?page=${page}&limit=${limit}`
        );
        if (!res.ok) throw new Error('Lỗi khi tải dữ liệu plugins.');
        const data = await res.json();
        setPlugins(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching plugins:', err);
      }
    };
    fetchPlugins();
  }, [page]);

  // --- Real-time socket ---
  useEffect(() => {
    if (!socket) return;

    const handleNewPlugin = (plugin) => {
      setPlugins((prev) => [plugin, ...prev.slice(0, limit - 1)]);
    };

    const handleDeletePlugin = (deletedPlugin) => {
      setPlugins((prev) => prev.filter((p) => p.id !== deletedPlugin.id));
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
  }, [socket]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">
        Featured Plugins ({plugins.length})
      </h2>
      <hr className="my-2 font-bold" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {plugins.map((plugin) => (
          <PluginModal key={plugin.id} plugin={plugin} />
        ))}
      </div>

      {/* --- Pagination control --- */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg ${
            page === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Prev
        </button>

        <span className="font-medium text-lg">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-lg ${
            page === totalPages
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
