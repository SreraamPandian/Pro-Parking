import React, { useState, useEffect } from 'react';
import { Car, LogIn, LogOut, ParkingCircle, DollarSign, Clock, AlertTriangle, X, Printer, Info } from 'lucide-react';
import StatCard from '../components/StatCard';
import VehicleFlowChart from '../components/VehicleFlowChart';
import { mockDashboardData } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
// Removed: import { useApp } from '../App'; // No longer needed for addNotification here

const Dashboard = () => {
  // Removed: const { addNotification } = useApp(); 
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOverdueAlertModal, setShowOverdueAlertModal] = useState(false);
  const [showPaperRefillPopup, setShowPaperRefillPopup] = useState(false); // New state for paper refill popup

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timerId);
  }, []);

  const handlePaperRefillAlertClick = () => {
    setShowPaperRefillPopup(true); // Show the dedicated popup
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Parking Management Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-2 lg:col-span-2">
          <StatCard
            title="Available Parking Slots"
            value={dashboardData.availableSlots}
            icon={<ParkingCircle size={32} className="text-white" />}
            color="bg-primary-blue"
            isAlert={dashboardData.availableSlots < 10}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Current Vehicles"
            value={dashboardData.currentVehicles}
            icon={<Car size={24} className="text-white" />}
            color="bg-primary-blue"
          />
          <StatCard
            title="Vehicles Entered Today"
            value={dashboardData.enteredToday}
            icon={<LogIn size={24} className="text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Vehicles Exited Today"
            value={dashboardData.exitedToday}
            icon={<LogOut size={24} className="text-white" />}
            color="bg-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <VehicleFlowChart data={dashboardData.vehicleFlow} />
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Report Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-primary-blue mb-1">Today's Revenue</p>
              <p className="text-xl font-bold text-primary-blue">$326.30</p>
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm text-green-500 mb-1">Most Active Time</p>
              <p className="text-xl font-bold text-green-700">08:00 - 10:00</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-md flex items-center">
              <div className="flex-1">
                <p className="text-sm text-orange-500 mb-1">Vehicle Types</p>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-primary-blue h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm">60% Staff</span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-sm">40% Visitor</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-md">
              <p className="text-sm text-purple-500 mb-1">Recent Activity</p>
              <div className="text-sm space-y-1">
                <div className="flex items-center">
                  <Clock size={12} className="text-purple-500 mr-1" />
                  <span className="text-gray-600">AB12 XYZ entered (5m ago)</span>
                </div>
                <div className="flex items-center">
                  <Clock size={12} className="text-purple-500 mr-1" />
                  <span className="text-gray-600">CD34 WXY exited (12m ago)</span>
                </div>
                <div className="flex items-center">
                  <DollarSign size={12} className="text-purple-500 mr-1" />
                  <span className="text-gray-600">Payment received: $6.50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button
          onClick={() => setShowOverdueAlertModal(true)}
          className="px-6 py-3 bg-primary-red text-white rounded-lg shadow-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
        >
          <AlertTriangle size={18} className="mr-2" />
          Show Overdue Alert
        </button>
        <button
          onClick={handlePaperRefillAlertClick} // Updated handler
          className="px-6 py-3 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <Printer size={18} className="mr-2" />
          Simulate Paper Refill Alert
        </button>
      </div>

      {/* Overdue Alert Modal */}
      <AnimatePresence>
        {showOverdueAlertModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center p-6 z-[100]"
            onClick={() => setShowOverdueAlertModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary-red flex items-center">
                  <AlertTriangle size={20} className="mr-2" />
                  Overdue Vehicle Alert
                </h3>
                <button
                  onClick={() => setShowOverdueAlertModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="text-gray-700 py-2">
                <p className="text-center text-md">
                  Vehicle CD34 WXY is still in the parking area 30 minutes after payment.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowOverdueAlertModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paper Refill Alert Popup */}
      <AnimatePresence>
        {showPaperRefillPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6 z-[100]" // Higher z-index if needed
            onClick={() => setShowPaperRefillPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-orange-600 flex items-center">
                  <Printer size={20} className="mr-2" />
                  Printer Alert
                </h3>
                <button
                  onClick={() => setShowPaperRefillPopup(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="text-gray-700 py-2">
                <p className="text-center text-md">
                  Printer paper is low in Kiosk 1. Please refill soon.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPaperRefillPopup(false)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
