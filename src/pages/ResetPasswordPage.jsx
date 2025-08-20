import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useParams(); // Example: Get token from URL

  // In a real app, you'd validate the token here with an API call.
  // For this demo, we'll assume the token is valid if present.
  useEffect(() => {
    if (token) {
      console.log("Password reset token:", token);
      // You might want to verify the token with a backend here.
      // If token is invalid, setError("Invalid or expired reset token.") and potentially redirect.
    }
  }, [token]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Simulate API call for resetting password
    console.log('Resetting password with new password:', password);
    setMessage('Your password has been reset successfully! You will be redirected to login shortly.');
    // In a real app, you'd make an API call here.
    
    setTimeout(() => {
      navigate('/login');
    }, 3000); // Redirect to login after 3 seconds
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
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Enter your new password below.
          </p>
        </div>
        
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-gray-400" />
              </div>
              <input
                id="new-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
             <p className="mt-1 text-xs text-gray-500">Minimum 8 characters.</p>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                </div>
                <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
              Reset Password
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

export default ResetPasswordPage;
