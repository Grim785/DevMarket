import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineBars } from 'react-icons/ai';
import { BiCartDownload } from 'react-icons/bi';
import { IoIosSearch } from 'react-icons/io';
import { useState, useEffect, useContext } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { AuthContext } from '../contexts/AuthContext';
import './Header.css';

function Header({ setIsOpen, headerRef }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [keyword, setKeyword] = useState('');

  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    alert('Đăng xuất thành công!');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) navigate('/');
    else navigate(`/?search=${encodeURIComponent(keyword)}`);
  };

  // Ẩn header khi scroll xuống
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowHeader(currentY <= lastScrollY);
      setLastScrollY(currentY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-10 bg-white shadow transition-transform duration-300 ${
        showHeader ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-y-3">
        {/* ===== Left Section: Logo + Sidebar Toggle ===== */}
        <div className="flex items-center space-x-3 order-1">
          {user?.role !== 'admin' && (
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <AiOutlineBars className="text-2xl text-gray-700" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-blue-600">
            <Link to={user?.role === 'admin' ? '/admin' : '/'}>DevMarket</Link>
          </h1>
        </div>

        {/* ===== Middle Section: Search Bar ===== */}
        <div className="order-3 md:order-2 basis-full md:basis-auto flex justify-center flex-1">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-full max-w-md space-x-2"
          >
            <input
              type="text"
              placeholder="Search plugin..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              <IoIosSearch className="text-xl" />
            </button>
          </form>
        </div>

        {/* ===== Right Section: User Menu + Cart ===== */}
        <div className="flex items-center space-x-4 order-2 md:order-3">
          {isLoggedIn ? (
            <Menu as="div" className="relative">
              <MenuButton className="inline-flex justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 border border-gray-300 shadow-sm hover:bg-gray-50">
                {user.username}
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg border border-gray-100 focus:outline-none">
                <div className="py-1">
                  <MenuItem>
                    <Link
                      to="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Account settings
                    </Link>
                  </MenuItem>

                  {user?.role !== 'admin' && (
                    <MenuItem>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Order History
                      </Link>
                    </MenuItem>
                  )}

                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          ) : (
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>
          )}

          {user?.role !== 'admin' && (
            <Link to="/cart" className="text-blue-600 hover:text-blue-800">
              <BiCartDownload className="text-2xl" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
