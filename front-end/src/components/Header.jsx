import { Link } from 'react-router-dom';
import { AiOutlineBars } from 'react-icons/ai';
import './Header.css'; // Importing the CSS file for header styles
import { BiCartDownload } from 'react-icons/bi';
import { IoIosSearch } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function Header({ setIsOpen, headerRef }) {
  const user = JSON.parse(localStorage.getItem('user')) || '';
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Đăng xuất thành công!');
    navigate('/');
  };
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY) {
        // Lăn xuống => ẩn
        setShowHeader(false);
      } else {
        // Lăn lên => hiện
        setShowHeader(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-10 bg-white shadow transition-transform duration-300 ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap">
          <div className="flex items-center space-x-4">
            {user.username === 'admin' ? null : (
              <div
                className="header-hover-effect rounded-md p-2 order-first m-0"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <AiOutlineBars className="md:text-2xl text-xl cursor-pointer" />
              </div>
            )}
            <h1 className="md:text-2xl text-xl font-bold text-blue-600 header-hover-effect p-2 rounded-md">
              <Link to={user.username === 'admin' ? '/admin' : '/'}>
                DevMarket
              </Link>
            </h1>
          </div>

          <div className="flex items-center space-x-4 flex-1 md:order-2 order-last justify-center mx-5">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-3  max-w-lg"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300">
              <IoIosSearch className="text-xl" />
            </button>
          </div>
          <div className="flex items-center space-x-4 md:order-3">
            {isLoggedIn ? (
              <div className="header-hover-effect rounded-md p-2">
                <Menu as="div" className="relative inline-block">
                  <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50">
                    Hello, {user.username}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 size-5 text-gray-400"
                    />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <div className="py-1">
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          Account settings
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          Support
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          License
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={handleLogout}
                          type="submit"
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
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
            <div>EN</div>
            {user.username === 'admin' ? null : (
              <Link to="/cart" className="text-blue-600 hover:underline">
                <BiCartDownload className="md:text-2xl text-xl" />
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
export default Header;
