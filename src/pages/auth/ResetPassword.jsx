import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

// Reset password page
const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setSuccess(true);
    setTimeout(() => {
      navigate('/auth/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h1>
          <p className="text-gray-600">Create a strong password</p>
        </div>

        {success ? (
          <Alert
            type="success"
            title="Password Reset Successful!"
            message="Redirecting to login..."
          />
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4">
                <Alert type="error" message={error} />
              </div>
            )}

            <InputField
              label="New Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
              helperText="Must be at least 8 characters"
            />

            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            />

            <Button type="submit" fullWidth>
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
