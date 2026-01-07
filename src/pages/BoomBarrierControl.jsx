import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, Loader2, ShieldCheck, ShieldAlert, Timer } from 'lucide-react'; // Removed ChevronsUpDown
import { mockBarrierData as initialBarrierData } from '../data/mockData';
import { motion } from 'framer-motion';

const BoomBarrierControl = () => {
  const [barriers, setBarriers] = useState(
    initialBarrierData.filter(b => b.name.includes("Main Entrance Barrier") || b.name.includes("Main Exit Barrier"))
  );
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const activeTimers = {};
    barriers.forEach(barrier => {
      if (barrier.status === 'open' && barrier.autoCloseTime) {
        const intervalId = setInterval(() => {
          const remaining = Math.max(0, Math.round((barrier.autoCloseTime - Date.now()) / 1000));
          setTimers(prev => ({ ...prev, [barrier.id]: remaining }));
          if (remaining <= 0) {
            clearInterval(activeTimers[barrier.id]);
            // Trigger auto-close sequence
            setBarriers(prevBs => prevBs.map(b => b.id === barrier.id ? { ...b, status: 'closing', autoCloseTime: null } : b));
            setTimeout(() => {
              setBarriers(prevBs => prevBs.map(b => b.id === barrier.id ? { ...b, status: 'closed' } : b));
            }, 2500); // Closing animation duration
          }
        }, 1000);
        activeTimers[barrier.id] = intervalId;
      } else if (timers[barrier.id] !== undefined && barrier.status !== 'open') {
        // Clear timer if barrier is no longer open or autoCloseTime is removed
        clearInterval(activeTimers[barrier.id]);
        setTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[barrier.id];
          return newTimers;
        });
      }
    });

    return () => {
      Object.values(activeTimers).forEach(clearInterval);
    };
  }, [barriers]); // Rerun effect when barriers state changes

  const getStatusInfo = (status) => {
    switch (status) {
      case 'open':
        return { text: 'Open', color: 'text-green-600', bgColor: 'bg-green-100', icon: <ShieldCheck size={24} />, borderColor: 'border-green-500' };
      case 'closed':
        return { text: 'Closed', color: 'text-primary-red', bgColor: 'bg-red-100', icon: <ShieldAlert size={24} />, borderColor: 'border-primary-red' };
      case 'opening':
        return { text: 'Opening...', color: 'text-primary-blue', bgColor: 'bg-blue-100', icon: <Loader2 size={24} className="animate-spin" />, borderColor: 'border-primary-blue' };
      case 'closing':
        return { text: 'Closing...', color: 'text-primary-blue', bgColor: 'bg-blue-100', icon: <Loader2 size={24} className="animate-spin" />, borderColor: 'border-primary-blue' };
      default:
        return { text: 'Unknown', color: 'text-gray-500', bgColor: 'bg-gray-100', icon: <ShieldAlert size={24} />, borderColor: 'border-gray-300' };
    }
  };

  const handleOpenBarrier = (barrierId) => {
    setBarriers(prevBarriers =>
      prevBarriers.map(barrier =>
        barrier.id === barrierId ? { ...barrier, status: 'opening', autoCloseTime: null } : barrier
      )
    );
    setTimers(prev => ({ ...prev, [barrierId]: undefined })); // Clear any existing timer display for this barrier

    setTimeout(() => { // Simulate opening
      const autoCloseTimestamp = Date.now() + 5000; // Auto-close in 5 seconds
      setBarriers(prevBarriers =>
        prevBarriers.map(barrier =>
          barrier.id === barrierId ? { ...barrier, status: 'open', autoCloseTime: autoCloseTimestamp } : barrier
        )
      );
    }, 2500); // Opening animation duration
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Boom Barrier Control</h1>
        <p className="text-gray-600 mt-1">Remotely operate and monitor parking boom barriers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {barriers.map((barrier) => {
          const statusInfo = getStatusInfo(barrier.status);
          const isOperating = barrier.status === 'opening' || barrier.status === 'closing';
          const isOpen = barrier.status === 'open';

          return (
            <motion.div
              key={barrier.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: barriers.indexOf(barrier) * 0.1 }}
            >
              <div className={`p-5 border-b-4 ${statusInfo.borderColor}`}>
                <h3 className="text-xl font-semibold text-gray-700">{barrier.name}</h3>
                <p className="text-sm text-gray-500">{barrier.location}</p>
              </div>

              <div className="p-6 flex flex-col items-center justify-center space-y-5">
                <div className={`flex items-center justify-center w-24 h-24 rounded-full ${statusInfo.bgColor} mb-3`}>
                  <span className={statusInfo.color}>{statusInfo.icon}</span>
                </div>
                <p className={`text-lg font-medium ${statusInfo.color}`}>{statusInfo.text}</p>

                {isOpen && timers[barrier.id] > 0 && (
                  <div className="flex items-center text-sm text-primary-blue">
                    <Timer size={16} className="mr-1.5 animate-pulse" />
                    <span>Auto-closing in {timers[barrier.id]}s</span>
                  </div>
                )}

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden relative my-2">
                  <motion.div
                    className={`h-full absolute top-0 left-0 ${isOpen ? 'bg-green-500' : barrier.status === 'closed' ? 'bg-primary-red' : 'bg-primary-blue'}`}
                    initial={{ width: barrier.status === 'closed' ? '0%' : isOpen ? '100%' : '50%' }}
                    animate={{ width: barrier.status === 'closed' ? '0%' : isOpen ? '100%' : '50%' }}
                    transition={{ duration: 0.5, type: "spring" }}
                  />
                  {isOperating && (
                    <motion.div
                      className={`h-full absolute top-0 ${barrier.status === 'opening' ? 'left-0' : 'right-0'} w-1/2 ${barrier.status === 'opening' ? 'bg-green-400' : 'bg-red-400'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.5, ease: "linear" }}
                    />
                  )}
                </div>
                <p className="text-xs text-gray-400">Barrier Status Indicator</p>
              </div>

              <div className="p-5 bg-gray-50">
                <button
                  onClick={() => handleOpenBarrier(barrier.id)}
                  disabled={isOpen || isOperating}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150
                    ${isOpen || isOperating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    }`}
                >
                  <ArrowUpCircle size={18} className="mr-2" />
                  Open Barrier
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BoomBarrierControl;
