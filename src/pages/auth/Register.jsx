import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'candidate'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Starting registration with:', {
        email: formData.email,
        fullName: formData.name,
        role: formData.role
      });

      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        role: formData.role
      });

      console.log('Registration successful');
      setSuccess(true);
      toast.success('Registration successful! Please check your email for verification link.');
    } catch (err) {
      console.error('Registration failed - Full error:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
        statusCode: err.statusCode
      });

      let errorMessage = 'Failed to register. ';

      if (err.message?.includes('already registered')) {
        errorMessage += 'This email is already registered.';
      } else if (err.message?.includes('invalid')) {
        errorMessage += 'Please check your input and try again.';
      } else if (err.code === '23505') {
        errorMessage += 'This email is already in use.';
      } else {
        errorMessage += err.message || 'Please try again later.';
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="text-emerald-400" />
          </div>
          <CardTitle className="text-white">Check your email</CardTitle>
          <CardDescription className="text-emerald-100/60">
            We've sent a verification link to <span className="text-emerald-300 font-medium">{formData.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-emerald-100/40 mb-6">
            Click the link in the email to confirm your account and get started.
          </p>
          <Button
            variant="outline"
            className="w-full border-white/10 text-emerald-100/60 hover:text-white"
            onClick={() => navigate('/auth/login')}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-light tracking-wide text-white">
          Create Account
        </CardTitle>
        <CardDescription className="text-emerald-100/60">
          Join the future of hiring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-red-200 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <div className="relative group">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-emerald-100/50 group-focus-within:text-emerald-400 transition-colors" />
              <Input
                name="name"
                placeholder="Full Name"
                className="pl-9"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-emerald-100/50 group-focus-within:text-emerald-400 transition-colors" />
              <Input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="pl-9"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-emerald-100/50 group-focus-within:text-emerald-400 transition-colors" />
              <Input
                name="phone"
                placeholder="Phone Number"
                className="pl-9"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-emerald-100/50 group-focus-within:text-emerald-400 transition-colors" />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                className="pl-9"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-emerald-100/50 group-focus-within:text-emerald-400 transition-colors" />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="pl-9"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-emerald-100/60 ml-1">Select your role</p>
            <div className="grid grid-cols-3 gap-2">
              {['candidate', 'employer', 'student', 'faculty', 'admin'].map((role) => (
                <label
                  key={role}
                  className={`
                    cursor-pointer border rounded-md py-2 px-3 text-[10px] font-medium text-center transition-all uppercase tracking-tighter
                    ${formData.role === role
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-white/5 border-white/10 text-emerald-100/40 hover:bg-white/10 hover:text-emerald-100/80'}
                  `}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {role}
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-500/80 hover:bg-emerald-500 text-white font-medium" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-emerald-100/40">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Register;
