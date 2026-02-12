import React from 'react';

// Textarea component
const TextAreaField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required = false,
  disabled = false,
  rows = 4,
  helperText
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default TextAreaField;
