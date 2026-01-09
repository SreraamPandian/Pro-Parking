import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useOutletContext as useAppOutletContextOriginal } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import User1Header from './components/User1Header';
import Dashboard from './pages/Dashboard';
import VehicleDetails from './pages/VehicleDetails';
import DeviceConfiguration from './pages/DeviceConfiguration';
import Passes from './pages/Passes';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import SlotManagement from './pages/SlotManagement';
import Reports from './pages/Reports';
import PaymentReport from './pages/PaymentReport';
import LoginPage from './pages/LoginPage';
import User1LoginPage from './pages/User1LoginPage';
import AddUser from './pages/AddUser';
import KioskManagement from './pages/KioskManagement';
import BoomBarrierControl from './pages/BoomBarrierControl';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Departments from './pages/Departments';
import Booking from './pages/Booking';
import { mockVehicleData as initialMockVehicleData } from './data/mockData';

const AdminLayout = ({ onLogout, vehiclesData, updateVehiclesData, notifications, onMarkNotificationAsRead, onMarkAllNotificationsAsRead, onClearAllNotifications, addNotification }) => (
  <div className="flex h-screen bg-gray-100">
    <Sidebar
      onLogout={onLogout}
      notifications={notifications}
      onMarkAsRead={onMarkNotificationAsRead}
      onMarkAllAsRead={onMarkAllNotificationsAsRead}
      onClearAll={onClearAllNotifications}
    />
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Outlet context={{ vehiclesData, updateVehiclesData, addNotification }} />
      </div>
    </div>
  </div>
);

const User1Layout = ({ onLogout, vehiclesData, updateVehiclesData }) => (
  <div className="flex flex-col h-screen bg-gray-100">
    <User1Header onLogout={onLogout} />
    <div className="flex-1 overflow-auto">
      <Outlet context={{ vehiclesData, updateVehiclesData }} />
    </div>
  </div>
);

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const User1ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) return <Navigate to="/user1" replace />;
  return children;
};

export const useApp = () => useAppOutletContextOriginal();


function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => localStorage.getItem('isAdminAuthenticated') === 'true');
  const [isUser1Authenticated, setIsUser1Authenticated] = useState(() => localStorage.getItem('isUser1Authenticated') === 'true');

  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('appNotifications');
    let parsedNotifications = savedNotifications ? JSON.parse(savedNotifications) : [];

    const sampleOverdueNotification = {
      id: 'sample_overdue_vehicle_1',
      message: 'Vehicle CD34 WXY is still in the parking area 30 minutes after payment.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
      type: 'overdue_exit',
      vehicleId: 'CD34WXY_sample',
      resolved: false
    };

    // Ensure sample overdue is added if not present
    if (!parsedNotifications.some(n => n.id === sampleOverdueNotification.id && n.type === 'overdue_exit')) {
      parsedNotifications.push(sampleOverdueNotification);
    }
    return parsedNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  });

  const [vehiclesData, setVehiclesData] = useState(() => {
    const savedVehicles = localStorage.getItem('appVehiclesData');
    if (savedVehicles) {
      const parsed = JSON.parse(savedVehicles);
      // Check if data is stale (missing location field)
      if (parsed.length > 0 && !parsed[0].location) {
        return initialMockVehicleData;
      }
      return parsed;
    }
    return initialMockVehicleData;
  });

  useEffect(() => { localStorage.setItem('isAdminAuthenticated', isAdminAuthenticated); }, [isAdminAuthenticated]);
  useEffect(() => { localStorage.setItem('isUser1Authenticated', isUser1Authenticated); }, [isUser1Authenticated]);
  useEffect(() => { localStorage.setItem('appNotifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('appVehiclesData', JSON.stringify(vehiclesData)); }, [vehiclesData]);

  const updateGlobalVehiclesData = useCallback((newVehiclesData) => {
    setVehiclesData(newVehiclesData);
  }, []);

  const addNotification = useCallback((message, type, details = {}) => {
    const newNotif = {
      id: `${type}_${details.vehicleId || details.kioskId || ''}_${Date.now()}`,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type: type,
      vehicleId: details.vehicleId || null,
      resolved: type === 'paper_refill' ? true : false,
      details: details
    };

    if (type === 'overdue_exit' && details.vehicleId) {
      setNotifications(prev => [newNotif, ...prev.filter(n => !(n.vehicleId === details.vehicleId && n.type === 'overdue_exit' && !n.resolved))].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } else {
      setNotifications(prev => [newNotif, ...prev].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    }
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications(prev => prev.filter(n => {
      if (n.id === 'sample_overdue_vehicle_1') return !n.read; // Keep sample if unread
      if (n.type === 'overdue_exit') return !n.read || !n.resolved;
      if (n.type === 'paper_refill') return !n.read; // Paper refill is auto-resolved, clear if read
      return !n.read; // Default for other types
    }));
  }, []);


  useEffect(() => {
    const checkOverdueVehicles = () => {
      const now = new Date();
      vehiclesData.forEach(vehicle => {
        if (vehicle.paymentProcessedTime && !vehicle.exitTime) {
          const paymentTime = new Date(vehicle.paymentProcessedTime);
          const diffMinutes = (now - paymentTime) / (1000 * 60);

          if (diffMinutes > 30) {
            const existingNotification = notifications.find(
              n => n.type === 'overdue_exit' && n.vehicleId === vehicle.id && !n.resolved
            );
            if (!existingNotification) {
              const overdueMinutes = Math.floor(diffMinutes - 30);
              addNotification(
                `Vehicle ${vehicle.vehicleNumber} (paid at ${new Date(vehicle.paymentProcessedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) is ${overdueMinutes} min overdue for exit.`,
                'overdue_exit',
                { vehicleId: vehicle.id }
              );
            }
          }
        }
        if (vehicle.exitTime) {
          setNotifications(prev => prev.map(n =>
            (n.type === 'overdue_exit' && n.vehicleId === vehicle.id && !n.resolved) ?
              { ...n, resolved: true, read: true } : n
          ));
        }
      });
    };

    const intervalId = setInterval(checkOverdueVehicles, 60000);
    return () => clearInterval(intervalId);
  }, [vehiclesData, addNotification, notifications]);


  const handleAdminLogin = () => { setIsAdminAuthenticated(true); setIsUser1Authenticated(false); localStorage.removeItem('isUser1Authenticated'); };
  const handleAdminLogout = () => { setIsAdminAuthenticated(false); localStorage.removeItem('isAdminAuthenticated'); };
  const handleUser1Login = () => { setIsUser1Authenticated(true); setIsAdminAuthenticated(false); localStorage.removeItem('isAdminAuthenticated'); };
  const handleUser1Logout = () => { setIsUser1Authenticated(false); localStorage.removeItem('isUser1Authenticated'); };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAdminAuthenticated ? <LoginPage onLogin={handleAdminLogin} /> : <Navigate to="/" replace />} />
        <Route path="/user1" element={!isUser1Authenticated ? <User1LoginPage onUser1Login={handleUser1Login} /> : <Navigate to="/user1/live-parking" replace />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />


        <Route
          element={
            <ProtectedRoute isAuthenticated={isAdminAuthenticated}>
              <AdminLayout
                onLogout={handleAdminLogout}
                vehiclesData={vehiclesData}
                updateVehiclesData={updateGlobalVehiclesData}
                notifications={notifications}
                onMarkNotificationAsRead={markNotificationAsRead}
                onMarkAllNotificationsAsRead={markAllNotificationsAsRead}
                onClearAllNotifications={clearAllNotifications}
                addNotification={addNotification}
              />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<VehicleDetails />} />
          <Route path="/device-config" element={<DeviceConfiguration />} />
          <Route path="/passes" element={<Passes />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/slots" element={<SlotManagement />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/payment-report" element={<PaymentReport />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/kiosk-management" element={<KioskManagement />} />
          <Route path="/boom-barrier-control" element={<BoomBarrierControl />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/settings" element={<Settings onLogout={handleAdminLogout} onUser1Login={handleUser1Login} />} />
          <Route path="/user1/live-parking" element={<Navigate to="/" replace />} />
          <Route path="/user1/*" element={<Navigate to="/" replace />} />
        </Route>

        <Route
          element={
            <User1ProtectedRoute isAuthenticated={isUser1Authenticated}>
              <User1Layout
                onLogout={handleUser1Logout}
                vehiclesData={vehiclesData}
                updateVehiclesData={updateGlobalVehiclesData}
              />
            </User1ProtectedRoute>
          }
        >
          <Route path="/user1/live-parking" element={<VehicleDetails />} />
          <Route path="/" element={<Navigate to="/user1/live-parking" replace />} />
          <Route path="/*" element={<Navigate to="/user1/live-parking" replace />} />
        </Route>

        <Route path="/*" element={
          isAdminAuthenticated ? <Navigate to="/" replace /> :
            isUser1Authenticated ? <Navigate to="/user1/live-parking" replace /> :
              <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
