import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Lifeprolineparking');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (username && password) {
      if (username === 'admin' && password === 'Lifeprolineparking') {
        if (typeof onLogin === 'function') {
          onLogin();
        }
        navigate('/');
      } else {
        setError('Invalid username or password.');
      }
    } else {
      setError('Please enter both username and password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-xl rounded-lg">
        <div className="flex flex-col items-center">
          <img
            src="https://img-wrapper.vercel.app/image?url=https://i.ibb.co/K9fK5dK/Life-Line-Logo.png"
            alt="Pro-Parking Logo"
            className="w-32 h-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Pro-Parking
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Admin Panel - Please sign in
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username-admin-login" className="sr-only">
                Username
              </label>
              <input
                id="username-admin-login"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-admin-login" className="sr-only">
                Password
              </label>
              <input
                id="password-admin-login"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-blue hover:text-blue-700">
                Forgot your password?
              </Link>
            </div>
          </div>

          {error && (
            <p className="text-sm text-center text-red-600">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red transition duration-150 ease-in-out"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ShieldCheck className="h-5 w-5 text-red-300 group-hover:text-red-200" aria-hidden="true" />
              </span>
              Sign in
            </button>
          </div>
        </form>
        <p className="mt-4 text-xs text-center text-gray-500">
          &copy; {new Date().getFullYear()} Pro-Parking. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
