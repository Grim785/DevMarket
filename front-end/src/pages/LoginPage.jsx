import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  // Lấy login function từ context
  const { login } = useContext(AuthContext);

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Cập nhật context và localStorage
        login(data.user, data.token);

        alert('Đăng nhập thành công!');

        // Điều hướng
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Sai tài khoản hoặc mật khẩu');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Tài khoản"
          className="w-full border p-2 mb-3 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full border p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Đăng nhập
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Đăng ký
          </Link>
        </p>
        <p className="mt-2 text-sm text-gray-600">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Quên mật khẩu?
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
