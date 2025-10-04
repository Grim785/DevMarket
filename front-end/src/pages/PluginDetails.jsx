import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FaDownload } from 'react-icons/fa';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useEffect, useState } from 'react';

function PluginDetails() {
  const [plugin, setPlugin] = useState({});
  const { id } = useParams();
  const isUserLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    fetch(`http://localhost:4000/api/plugins/fetchplugin/${id}`)
      .then((res) => res.json())
      .then(setPlugin)
      .catch((err) => console.error('Error fetching plugin details:', err));
  }, [id]);

  const handleDownload = async (id, name) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/plugins/download/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.zip`; // đặt tên file khi tải
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleAddToCart = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ pluginId: Number(id) }), // ép kiểu sang số
      });

      const data = await res.json(); // luôn parse JSON để biết backend trả gì

      if (res.ok) {
        alert('✅ Added to cart!');
      } else {
        alert('❌ Error: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('⚠️ Failed to add to cart, please try again.');
    }
  };

  const averageRating = plugin.reviews?.length
    ? plugin.reviews.reduce((sum, r) => sum + r.stars, 0) /
      plugin.reviews.length
    : 0;

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-500 mb-4 inline-block">
        &larr; Back to Home
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="bg-white p-6">
          <img
            src="https://microsoft.design/wp-content/uploads/2025/02/Waves-2.png"
            className="w-full h-64 sm:object-cover object-contain mb-4 rounded-lg"
          />
        </div>

        {/* Info */}
        <div className="bg-white p-6">
          <h1 className="text-2xl font-bold mb-2">{plugin.name}</h1>
          <p className="text-gray-600 mb-2">by {plugin.author}</p>
          <p className="text-gray-600 mb-2">Version: {plugin.version}</p>
          <p className="text-gray-600 mb-2">File Size: {plugin.fileSize}</p>
          <p className="text-gray-600 mb-2">Updated At: {plugin.updatedAt}</p>

          <div className="mb-2">
            <strong className="text-gray-700">Tags:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {plugin.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-200 text-sm text-gray-800 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-gray-600 mb-2">
            <strong>Price:</strong>{' '}
            {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
          </p>

          <p className="text-yellow-500 mb-2">
            {'★'.repeat(Math.round(plugin.rating || 0))} (
            {(plugin.rating || 0).toFixed(1)})
          </p>

          <div className="flex items-center mb-4">
            {isUserLoggedIn ? (
              <>
                <button
                  onClick={() => handleDownload(plugin.id, plugin.name)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2 inline-flex items-center gap-2"
                >
                  <FaDownload />
                  Download
                </button>

                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Login to Download / Add to Cart
              </Link>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div className="prose prose-sm text-gray-600">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {plugin.description || ''}
            </ReactMarkdown>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <p className="text-yellow-500 mb-4">
            ★ {averageRating.toFixed(1)} average based on{' '}
            {plugin.reviews?.length || 0} reviews
          </p>

          {plugin.reviews?.length > 0 ? (
            plugin.reviews.map((review, index) => (
              <div key={index} className="mb-4 border-b pb-2">
                <p className="font-semibold">{review.user}</p>
                <p className="text-yellow-500 mb-2">
                  {'★'.repeat(review.stars)}{' '}
                  <span className="text-gray-500">({review.stars})</span>
                </p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PluginDetails;
