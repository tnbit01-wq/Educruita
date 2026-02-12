import React from 'react';

// Enhanced Button component with better visibility
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500 disabled:bg-emerald-400 disabled:hover:bg-emerald-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 focus:ring-gray-500 disabled:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 disabled:bg-red-400',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 disabled:bg-green-400',
    outline: 'border-2 border-gray-400 text-gray-800 bg-white hover:bg-gray-100 hover:border-gray-500 active:bg-gray-200 focus:ring-gray-500 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
