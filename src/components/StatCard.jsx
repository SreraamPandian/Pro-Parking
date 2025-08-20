import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, isAlert }) => {
  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md p-6 ${isAlert ? 'border-l-4 border-red-500' : ''}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className={`${title === 'Available Parking Slots' ? 'text-4xl' : 'text-2xl'} font-bold`}>{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
      {isAlert && (
        <div className="mt-3 text-sm text-red-600 font-medium">
          Attention required!
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
