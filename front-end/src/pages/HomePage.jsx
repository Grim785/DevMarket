import { useEffect, useState } from 'react';
import PluginModal from '../components/PluginModal';
import { useSocket } from '../contexts/SocketContext'; // hook từ context Socket

const HomePage = () => {
  const [plugins, setPlugins] = useState([]);
  const socket = useSocket(); // Lấy socket từ context

  useEffect(() => {
    fetch('http://localhost:4000/api/plugins/fetchAllplugin')
      .then((res) => res.json())
      .then(setPlugins)
      .catch((err) => console.error('Error fetching plugins:', err));
  }, []);

  // --- real-time với socket ---
  useEffect(() => {
    if (!socket) return;
    const handleNewPlugin = (plugin) => {
      setPlugins((prev) => [...prev, plugin]);
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
    </div>
  );
};

export default HomePage;
