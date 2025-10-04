// src/layouts/MainLayout.jsx
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { useState, useEffect, useRef } from 'react';
import CategorySidebar from '../components/CategorySidebar'; // Assuming CategorySidebar is a component in the same directory

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Effect to handle body overflow when sidebar is open
  // This prevents the body from scrolling when the sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen]);

  // Đo chiều cao của header
  // để tránh nội dung bị che khuất khi sidebar mở
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeight(); // Đo lần đầu
    window.addEventListener('resize', updateHeight); // Đo lại khi thay đổi màn hình
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header setIsOpen={setIsOpen} headerRef={headerRef} />
      <CategorySidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-1" style={{ paddingTop: `${headerHeight}px` }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
