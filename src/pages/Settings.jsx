import React, { useState } from 'react';
import { Save, User, Mail, Phone, Building, Lock, LogOut as LogOutIcon, LogIn as LogInIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = ({ onLogout, onUser1Login }) => { // Added onUser1Login prop
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState({
    name: 'Life Line Admin',
    email: 'admin@lifeline.com',
    phone: '(555) 123-4567',
    organization: 'Pro-Parking System',
    position: 'Parking Administrator'
  });
  const [changePassword, setChangePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData({ ...accountData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setChangePassword({ ...changePassword, [name]: value });
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    alert('Account details saved successfully!');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setChangePassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSettingsPageLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const handleGoToUser1View = () => { // Renamed for clarity
    if (onLogout) { // Log out admin first
      onLogout();
    }
    if (onUser1Login) { // Log in User1
      onUser1Login();
    }
    navigate('/user1/live-parking'); // Navigate directly to User1's live parking page
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600">Manage your account details for parking system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGoToUser1View} // Updated handler
            className="px-4 py-2 bg-blue-50 text-primary-blue rounded-md hover:bg-blue-100 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue"
            title="Switch to User1 View (Live Parking)"
          >
            <LogInIcon size={18} className="mr-2" />
            User1 View
          </button>
          <button
            onClick={handleSettingsPageLogoutClick}
            className="px-4 py-2 bg-red-50 text-primary-red rounded-md hover:bg-red-100 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-red"
          >
            <LogOutIcon size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
          <form onSubmit={handleSaveAccount}>
            <div className="space-y-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', icon: <User size={16} className="text-gray-400" /> },
                { label: 'Email', name: 'email', type: 'email', icon: <Mail size={16} className="text-gray-400" /> },
                { label: 'Phone', name: 'phone', type: 'text', icon: <Phone size={16} className="text-gray-400" /> },
                { label: 'Organization', name: 'organization', type: 'text', icon: <Building size={16} className="text-gray-400" /> },
                { label: 'Position', name: 'position', type: 'text', icon: <User size={16} className="text-gray-400" /> }
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{field.icon}</div>
                    <input type={field.type} name={field.name} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={accountData[field.name]} onChange={handleAccountChange} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button type="submit" className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red">
                <Save size={18} className="mr-2" />Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
          <form onSubmit={handleSavePassword}>
            <div className="space-y-4">
              {[
                { label: 'Current Password', name: 'currentPassword', type: 'password' },
                { label: 'New Password', name: 'newPassword', type: 'password' },
                { label: 'Confirm New Password', name: 'confirmPassword', type: 'password' }
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={16} className="text-gray-400" /></div>
                    <input type={field.type} name={field.name} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" value={changePassword[field.name]} onChange={handlePasswordChange} required minLength={field.name === 'newPassword' ? 8 : undefined} />
                  </div>
                  {field.name === 'newPassword' && <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters.</p>}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button type="submit" className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
