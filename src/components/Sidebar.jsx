import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Car,
  Settings as SettingsIcon, // Renamed from Camera to SettingsIcon to avoid conflict
  CreditCard,
  DollarSign,
  ParkingSquare,
  FileText,
  Receipt,
  UserPlus,
  LogOut,
  MonitorPlay,
  Bell,
  ChevronsUpDown, // Icon for Boom Barrier
  HardDrive, // Icon for Device Configuration
  Building2, // Icon for Departments
  Calendar
} from 'lucide-react';
import NotificationModal from './NotificationModal';

const Sidebar = ({ onLogout, notifications, onMarkAsRead, onMarkAllAsRead, onClearAll }) => {
  const navigate = useNavigate();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/vehicles', icon: <Car size={20} />, label: 'Live Parking' },
    { path: '/slots', icon: <ParkingSquare size={20} />, label: 'Location Management' },
    { path: '/bookings', icon: <Calendar size={20} />, label: 'Booking' },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { path: '/payment-report', icon: <Receipt size={20} />, label: 'Payment Reports' },
    { path: '/pricing', icon: <DollarSign size={20} />, label: 'Pricing' },
    { path: '/passes', icon: <CreditCard size={20} />, label: 'Passes' },
    { path: '/device-config', icon: <HardDrive size={20} />, label: 'Device Config' }, // Updated
    { path: '/kiosk-management', icon: <MonitorPlay size={20} />, label: 'Kiosk Management' },
    { path: '/boom-barrier-control', icon: <ChevronsUpDown size={20} />, label: 'Boom Barrier Control' },
    { path: '/add-user', icon: <UserPlus size={20} />, label: 'Add User' },
    { path: '/departments', icon: <Building2 size={20} />, label: 'Departments' },
    { path: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' }
  ];

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read && !n.resolved).length;

  return (
    <>
      <div className="w-64 bg-white shadow-md h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://img-wrapper.vercel.app/image?url=https://i.ibb.co/K9fK5dK/Life-Line-Logo.png"
              alt="Pro-Parking Logo"
              className="w-10 h-auto"
            />
            <h1 className="text-lg font-bold text-primary-blue">Pro - Parking</h1>
          </div>
          <button
            onClick={() => setShowNotificationModal(true)}
            className="relative p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue"
            title="View Notifications"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full ring-1 ring-white bg-primary-red" />
            )}
          </button>
        </div>
        <nav className="mt-6 flex-grow">
          <ul>
            {navItems.map((item, index) => (
              <li key={index} className="mb-1">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 transition-colors duration-150 ${isActive
                      ? 'bg-blue-50 text-primary-blue border-r-4 border-primary-blue font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary-blue'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 mt-auto border-t">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-50 text-primary-red rounded-md hover:bg-red-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-red"
          >
            <LogOut size={18} className="mr-2" />
            <span>Logout</span>
          </button>
          <p className="mt-4 text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Pro-Parking
          </p>
        </div>
      </div>
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
        onClearAll={onClearAll}
      />
    </>
  );
};

export default Sidebar;
