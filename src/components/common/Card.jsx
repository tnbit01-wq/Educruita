import React from 'react';

// Reusable Card component with enhanced visibility
const Card = ({ children, className = '', padding = 'md', hover = false, title }) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: 'p-0'
  };

  const hoverEffect = hover ? 'hover:shadow-xl hover:border-emerald-300 transition-all duration-200' : '';

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 border-gray-200 ${paddings[padding]} ${hoverEffect} ${className}`}>
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gray-200">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
