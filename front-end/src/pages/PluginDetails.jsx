import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FaDownload } from 'react-icons/fa';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useEffect, useState, useContext } from 'react';
import PaymentPage from './PaymentPage';
import { AuthContext } from '../contexts/AuthContext';

function PluginDetails() {
  const { token, user } = useContext(AuthContext);
  const [plugin, setPlugin] = useState({});
  const { id } = useParams();
  const isUserLoggedIn = !!localStorage.getItem('token');
  const [checkout, setCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const fetchPlugin = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/plugins/fetchplugin/${id}`
        );
        if (!res.ok) throw new Error('Failed to fetch plugin');
        const data = await res.json();
        setPlugin(data || {}); // lấy plugin từ response
      } catch (err) {
        console.error('Error fetching plugin details:', err);
      }
    };
    fetchPlugin();
  }, [id]);

  useEffect(() => {
    const checkPurchased = async () => {
      if (!token) return;

      try {
        const res = await fetch(
          `http://localhost:4000/api/plugins/${id}/purchased`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error('Failed to check purchase');
        const data = await res.json();
        setPurchased(data.purchased); // true/false
      } catch (err) {
        console.error('Error checking purchase:', err);
      }
    };

    checkPurchased();
  }, [id, token]);

  const handleDownload = async (id, name) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/plugins/download/${id}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download failed:', err);
      alert(err.message);
    }
  };

  const handlePayment = async () => {
    if (!token || !user) return;

    if (Number(plugin.price) === 0) {
      // Plugin Free, chỉ download
      handleDownload(plugin.id, plugin.name);
      return;
    }

    try {
      const res = await fetch(
        'http://localhost:4000/api/payment/create-payment-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            products: [
              {
                pluginId: plugin.id,
                name: plugin.name,
                price: Number(plugin.price),
              },
            ],
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to create payment intent');
      const data = await res.json();
      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setCheckout(true);
    } catch (err) {
      console.error(err);
      alert('Payment initiation failed: ' + err.message);
    }
  };

  // Nếu đang checkout, render trang Payment
  if (checkout && clientSecret && orderId) {
    return <PaymentPage clientSecret={clientSecret} orderId={orderId} />;
  }

  const handleAddToCart = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ pluginId: Number(id) }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Added to cart!');
      } else {
        alert('❌ Error: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('⚠️ Failed to add to cart, please try again.');
    }
  };

  const reviews = plugin.reviews || [];
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length
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
            {Number(plugin.price) === 0 ? 'Free' : `$${plugin.price}`}
          </p>

          <p className="text-yellow-500 mb-2">
            {'★'.repeat(Math.round(averageRating))} ({averageRating.toFixed(1)})
          </p>

          <div className="flex items-center mb-4">
            {isUserLoggedIn ? (
              <>
                {purchased ? (
                  <button
                    onClick={() => handleDownload(plugin.id, plugin.name)}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 inline-flex items-center gap-2"
                  >
                    <FaDownload /> Download
                  </button>
                ) : Number(plugin.price) === 0 ? (
                  <button
                    onClick={() => handleDownload(plugin.id, plugin.name)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 inline-flex items-center gap-2"
                  >
                    <FaDownload /> Download
                  </button>
                ) : (
                  <button
                    onClick={handlePayment}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 inline-flex items-center gap-2"
                  >
                    {plugin.price} $
                  </button>
                )}

                {!purchased && (
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                )}
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
            ★ {averageRating.toFixed(1)} average based on {reviews.length}{' '}
            reviews
          </p>

          {reviews.length > 0 ? (
            reviews.map((review, index) => (
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
