import React from 'react';

// Empty state component for no data scenarios
const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-center mb-6 max-w-md">{description}</p>
      )}
      {action && action}
    </div>
  );
};

export default EmptyState;
