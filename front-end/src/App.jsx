import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import PluginDetails from './pages/PluginDetails';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import AdminPage from './pages/AdminPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Các trang nằm trong layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="plugin/:id/:slug" element={<PluginDetails />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="orders" element={<OrderHistoryPage />} />
              <Route path="categories/:slug" element={<CategoryPage />} />
              {/* 404 cho route nằm trong MainLayout */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Route ngoài layout */}
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />

            {/* 404 cho tất cả trường hợp khác (nằm ngoài layout) */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
