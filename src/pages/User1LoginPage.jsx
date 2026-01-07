import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ParkingCircle } from 'lucide-react'; // Using ParkingCircle as relevant icon

const User1LoginPage = ({ onUser1Login }) => {
  const [username, setUsername] = useState('user1'); // Default User1 username
  const [password, setPassword] = useState('password'); // Default User1 password (use secure ones in real app!)
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation for User1 (replace with actual authentication)
    if (username === 'user1' && password === 'password') {
      onUser1Login(); // Call the specific login handler for User1
      navigate('/user1/live-parking'); // Navigate to User1's allowed page
    } else {
      setError('Invalid username or password.');
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
            Pro-Parking System
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Live Parking Access - Sign In
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="user1-username" className="sr-only">
                Username
              </label>
              <input
                id="user1-username"
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
              <label htmlFor="user1-password" className="sr-only">
                Password
              </label>
              <input
                id="user1-password"
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

          {error && (
            <p className="text-sm text-center text-red-600">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red transition duration-150 ease-in-out"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ParkingCircle className="h-5 w-5 text-red-300 group-hover:text-red-200" aria-hidden="true" />
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

export default User1LoginPage;
