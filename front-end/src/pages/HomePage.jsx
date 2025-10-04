import { useEffect, useState } from 'react';
import PluginModal from '../components/PluginModal';

const HomePage = () => {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/plugins/fetchAllplugin')
      .then((res) => res.json())
      .then(setPlugins)
      .catch((err) => console.error('Error fetching plugins:', err));
  }, []);

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
