import React from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Alert component for notifications and messages
const Alert = ({ type = 'info', title, message, onClose }) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />,
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />,
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <InformationCircleIcon className="h-5 w-5 text-blue-600" />,
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
    },
  };
  
  const config = types[type];
  
  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${config.titleColor}`}>{title}</h3>}
          {message && <p className={`text-sm mt-1 ${config.messageColor}`}>{message}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto flex-shrink-0">
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
