import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';
import { useEffect } from 'react';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = '404';
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <Frown size={80} className="text-gray-600 mb-4" />
      <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-gray-600 mb-6">Page Not Found</p>
      <Link
        to="/"
        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to home
      </Link>
    </div>
  );
}
