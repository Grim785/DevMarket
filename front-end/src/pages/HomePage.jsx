import { useEffect, useState, useContext } from 'react';
import PluginModal from '../components/PluginModal';
import { useSocket } from '../contexts/SocketContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const socket = useSocket();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const keyword = query.get('search') || '';

  // --- Đặt tiêu đề trang ---
  useEffect(() => {
    document.title = 'Home';
  }, []);

  // --- Chuyển hướng admin ---
  useEffect(() => {
    // Chỉ redirect khi user đã load và là admin
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  // --- Fetch plugin theo trang ---
  useEffect(() => {
    const fetchPlugins = async () => {
      setLoading(true);
      try {
        const url = keyword
          ? `${API_BASE}/plugins/fetchAllplugin?search=${encodeURIComponent(
              keyword
            )}`
          : `${API_BASE}/plugins/fetchAllplugin?page=${page}&limit=${limit}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Lỗi khi tải dữ liệu plugins.');

        const data = await res.json();

        // Nếu không có dữ liệu ở trang hiện tại → quay lại trang trước
        if ((!data.data || data.data.length === 0) && page > 1) {
          console.warn(`Trang ${page} không có dữ liệu, quay lại trang trước.`);
          setPage((prev) => Math.max(prev - 1, 1));
          return;
        }

        setPlugins(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching plugins:', err);
        setPlugins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlugins();
  }, [page, keyword]);

  // --- Real-time cập nhật với Socket.IO ---
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

      {/* --- Trạng thái tải --- */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : plugins.length === 0 ? (
        // --- Không có plugin ---
        <div className="text-center text-gray-500 mt-10 text-lg">
          Không có plugin nào để hiển thị.
        </div>
      ) : (
        // --- Danh sách plugin ---
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {plugins.map((plugin) => (
            <PluginModal key={plugin.id} plugin={plugin} />
          ))}
        </div>
      )}

      {/* --- Phân trang --- */}
      {!loading && totalPages > 1 && (
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
      )}
    </div>
  );
};

export default HomePage;
