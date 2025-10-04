import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function CategorySidebar({ isOpen, setIsOpen }) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch('http://localhost:4000/api/categories/fetchAllCategories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

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
        <div className="p-4 border-b font-bold text-lg">Danh mục Plugin</div>
        <ul className="p-4 space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`}
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
