import { Link } from 'react-router-dom';
import { BiCartDownload } from 'react-icons/bi';
const API_BASE = import.meta.env.VITE_API_URL;

const PluginModal = ({ plugin }) => {
  return (
    <Link
      to={`/plugin/${plugin.id}/${plugin.slug}`}
      className="group relative border rounded-lg p-4 hover:shadow-lg transition duration-300"
    >
      <img
        src={
          plugin?.thumbnail
            ? plugin.thumbnail.startsWith('http')
              ? plugin.thumbnail // đã là URL đầy đủ
              : `${API_BASE}${plugin.thumbnail}` // prepend domain
            : 'https://microsoft.design/wp-content/uploads/2025/02/Waves-2.png'
        }
        alt={plugin?.name || 'Plugin Thumbnail'}
        className="w-full h-32 object-cover mb-4 rounded"
      />
      <h3 className="text-xl font-semibold mb-2">{plugin.name}</h3>
      <p className="text-gray-600 mb-2 line-clamp-2">{plugin.description}</p>
      <p className="text-blue-600 font-bold">
        {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
      </p>

      {/* Icon giỏ hàng khi hover */}
      <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-white shadow p-2 rounded-full text-blue-600 hover:bg-blue-700 hover:text-white transition">
          <BiCartDownload />
        </button>
      </div>
    </Link>
  );
};

export default PluginModal;
