import React from 'react';

// Checkbox component
const Checkbox = ({ label, name, checked, onChange, disabled = false }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
      />
      <span className="ml-2 text-sm text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;
