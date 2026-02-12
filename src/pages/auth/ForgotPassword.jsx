import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

// Forgot password page
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">We'll send you a reset link</p>
        </div>

        {submitted ? (
          <div>
            <Alert
              type="success"
              title="Email Sent!"
              message={`Password reset instructions have been sent to ${email}`}
            />
            <div className="mt-6">
              <Link to="/auth/login">
                <Button fullWidth>Back to Login</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              helperText="Enter the email associated with your account"
            />

            <Button type="submit" fullWidth>
              Send Reset Link
            </Button>

            <div className="mt-6 text-center">
              <Link to="/auth/login" className="text-sm text-blue-600 hover:text-blue-700">
                ← Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
