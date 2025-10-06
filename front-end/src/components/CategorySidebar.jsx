import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

function CategorySidebar({ isOpen, setIsOpen }) {
  const socket = useSocket();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:4000/api/categories/fetchAllCategories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewCate = () => {
      fetchData();
    };

    const handleUpdateCate = () => {
      fetchData();
    };
    const handleDeleteCate = () => {
      fetchData();
    };

    socket.on('newCategory', handleNewCate);
    socket.on('updateCategory', handleUpdateCate);
    socket.on('deleteCategory', handleDeleteCate);

    return () => {
      socket.off('newCategory', handleNewCate);
      socket.off('updateCategory', handleUpdateCate);
      socket.off('deleteCategory', handleDeleteCate);
    };
  });

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b font-bold text-lg">Categories</div>
        <ul className="p-4 space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/categories/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                className="block text-gray-700 hover:text-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default CategorySidebar;
