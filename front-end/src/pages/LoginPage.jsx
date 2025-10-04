import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Lưu token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Đăng nhập thành công!');
        // điều hướng sang trang khác
        if (data.user.username === 'admin') {
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
        <p className="mt-4 text-sm text-gray-600">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Quên mật khẩu?
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
