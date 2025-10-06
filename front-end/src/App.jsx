import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext'; // <- thêm
import AboutPage from './pages/AboutPage';
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

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        {' '}
        {/* <- thêm */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="plugin/:id/:slug" element={<PluginDetails />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="orders" element={<OrderHistoryPage />} />
              <Route path="categories/:slug" element={<CategoryPage />} />
            </Route>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
