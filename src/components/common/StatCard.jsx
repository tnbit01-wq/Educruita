import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const StatCard = ({ label, value, icon: Icon, gradient, trend, trendValue }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</h3>
            
            {trend && trendValue && (
              <div className="flex items-center mt-2">
                <span
                  className={`inline-flex items-center text-sm font-medium ${
                    trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend === 'up' ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {trendValue}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
