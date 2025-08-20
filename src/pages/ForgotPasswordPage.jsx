import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, ArrowLeft } from 'lucide-react'; // Added User icon

const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState(''); // Changed from email to identifier
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // const navigate = useNavigate(); // Not used for now, but can be if auto-redirect is needed

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!identifier) {
      setError('Please enter your username or email address.');
      return;
    }
    // Basic validation (can be improved if needed to distinguish email vs username)
    // For now, just checking if it's not empty.

    // Simulate API call for sending temporary password
    console.log('Forgot password request for identifier:', identifier);
    setMessage(`A temporary password has been sent to your registered email. Please use it to log in and reset your password immediately.`);
    
    setIdentifier(''); 
    // User would then (conceptually) use this temporary password to log in, 
    // and then be prompted to change it, possibly via the ResetPasswordPage.
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg">
        <div className="flex flex-col items-center">
          <img 
            src="https://img-wrapper.vercel.app/image?url=https://i.ibb.co/K9fK5dK/Life-Line-Logo.png" 
            alt="Life Line Hospital Logo" 
            className="w-24 h-auto mb-4" 
          />
          <h2 className="text-xl font-bold text-center text-gray-800">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Enter your username or email address below. We'll send a temporary password to your registered email.
          </p>
        </div>
        
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier-forgot" className="block text-sm font-medium text-gray-700 mb-1">
              Username or Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Heuristically show Mail or User icon, or a generic one */}
                {identifier.includes('@') ? <Mail size={16} className="text-gray-400" /> : <User size={16} className="text-gray-400" />}
              </div>
              <input
                id="identifier-forgot"
                name="identifier"
                type="text" // Changed from email to text to allow username
                autoComplete="username email"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
                placeholder="Enter username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <p className="text-sm text-center text-green-600 bg-green-50 p-3 rounded-md">{message}</p>
          )}
          {error && (
            <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red transition duration-150 ease-in-out"
            >
              Send Temporary Password
            </button>
          </div>
        </form>
        
        <div className="text-sm text-center mt-6">
          <Link to="/login" className="font-medium text-primary-blue hover:text-blue-700 flex items-center justify-center">
            <ArrowLeft size={16} className="mr-1" />
            Back to Sign In
          </Link>
        </div>

         <p className="mt-8 text-xs text-center text-gray-500">
            &copy; {new Date().getFullYear()} Life Line Hospital Parking.
          </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
