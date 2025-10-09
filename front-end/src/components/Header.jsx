import { Link } from 'react-router-dom';
import { AiOutlineBars } from 'react-icons/ai';
import './Header.css';
import { BiCartDownload } from 'react-icons/bi';
import { IoIosSearch } from 'react-icons/io';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { AuthContext } from '../contexts/AuthContext';

function Header({ setIsOpen, headerRef }) {
  const { user, logout } = useContext(AuthContext); // Lấy user và logout từ context
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [keyword, setKeyword] = useState('');

  const handleLogout = () => {
    logout(); // gọi context để logout
    alert('Đăng xuất thành công!');
    navigate('/'); // chuyển về trang chủ
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      navigate('/');
    } else {
      navigate(`/?search=${encodeURIComponent(keyword)}`);
    }
  };

  // Ẩn/hiện header khi scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
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
      <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap">
        {/* Logo & Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          {user?.role !== 'admin' && (
            <div
              className="header-hover-effect rounded-md p-2 order-first m-0"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <AiOutlineBars className="md:text-2xl text-xl cursor-pointer" />
            </div>
          )}
          <h1 className="md:text-2xl text-xl font-bold text-blue-600 header-hover-effect p-2 rounded-md">
            <Link to={user?.role === 'admin' ? '/admin' : '/'}>DevMarket</Link>
          </h1>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4 flex-1 md:order-2 order-last justify-center mx-5">
          <form
            onSubmit={handleSearch}
            className="flex items-center space-x-2 flex-1 justify-center"
          >
            <input
              type="text"
              placeholder="Search plugin..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-2  w-full max-w-md"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              <IoIosSearch className="text-xl" />
            </button>
          </form>
        </div>

        {/* User menu */}
        <div className="flex items-center space-x-4 md:order-3">
          {isLoggedIn ? (
            <div className="header-hover-effect rounded-md p-2">
              <Menu as="div" className="relative inline-block">
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50">
                  {user.username}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 size-5 text-gray-400"
                  />
                </MenuButton>

                <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition">
                  <div className="py-1">
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Account settings
                      </a>
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
                        type="button"
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            </div>
          ) : (
            <div className="header-hover-effect rounded-md p-2">
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          )}
          {user?.role !== 'admin' && (
            <Link to="/cart" className="text-blue-600 hover:underline">
              <BiCartDownload className="md:text-2xl text-xl" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
