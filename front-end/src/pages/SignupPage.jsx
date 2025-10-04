import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigator = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSignup = (e) => {
    e.preventDefault();

    fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigator('/'); // Redirect to home page after successful signup
        } else {
          alert(data.message || 'Signup failed');
        }
      })
      .catch((error) => {
        console.error('Error during signup:', error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign Up for DevMarket
        </h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              placeholder="Choose a username"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              name="password"
              className="w-full px-3 py-2 border rounded"
              placeholder="Choose a password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Sign Up
          </button>
          <Link to="/login" className="text-blue-600 hover:underline">
            Already have an account? Log in
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
