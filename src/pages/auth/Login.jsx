import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState(null); // 'candidate', 'employer', etc.
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const roles = [
    { id: 'candidate', name: 'Candidate', icon: User, color: 'emerald', desc: 'Find your dream job' },
    { id: 'employer', name: 'Employer', icon: Briefcase, color: 'blue', desc: 'Hire top talent' },
    { id: 'student', name: 'Student', icon: CheckCircle, color: 'indigo', desc: 'Manage campus life' },
    { id: 'faculty', name: 'Faculty', icon: Shield, color: 'violet', desc: 'Manage classes & leaves' },
    { id: 'admin', name: 'Admin', icon: Lock, color: 'rose', desc: 'Moderate platform' },
    { id: 'superadmin', name: 'Super Admin', icon: Shield, color: 'amber', desc: 'System configuration' }
  ];

  // Helper to get normalized role route
  const getDashboardRoute = (role) => {
    const roleRoutes = {
      candidate: '/candidate/dashboard',
      employer: '/employer/dashboard',
      student: '/student/dashboard',
      faculty: '/faculty/dashboard',
      admin: '/admin/dashboard',
      superadmin: '/superadmin/dashboard',
      super_admin: '/superadmin/dashboard'
    };
    return roleRoutes[role] || '/candidate/dashboard';
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role || user.user_metadata?.role;
      if (role) {
        console.log('User already authenticated. Redirecting...');
        navigate(getDashboardRoute(role), { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Login attempt in ${mode} mode for:`, formData.email);
      const data = await login(formData.email, formData.password);

      if (!data?.user) {
        throw new Error('Login failed: No user data received');
      }

      // Verify role matches mode (optional, but good for "separate modes" feel)
      const userRole = data.user.user_metadata?.role;
      const targetRoute = getDashboardRoute(userRole || mode);

      toast.success(`Welcome back! Redirecting to ${mode} dashboard...`);
      navigate(targetRoute, { replace: true });

    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Invalid email or password');
      toast.error(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  if (!mode) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Select your Mode</h1>
          <p className="text-emerald-100/60 text-lg">Choose how you want to access the platform</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setMode(role.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 backdrop-blur-xl"
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-${role.color}-500/20 text-${role.color}-400 ring-1 ring-${role.color}-500/50 group-hover:scale-110 transition-transform`}>
                <role.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{role.name}</h3>
              <p className="text-emerald-100/40 text-sm leading-relaxed">{role.desc}</p>
              <div className="mt-8 flex items-center text-xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                Continue as {role.name} →
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeRole = roles.find(r => r.id === mode);

  return (
    <Card className="w-full max-w-md mx-auto border-white/10 bg-white/5 backdrop-blur-xl animate-in zoom-in-95 duration-300 shadow-2xl overflow-hidden">
      <div className={`h-1.5 w-full bg-${activeRole.color}-500/50`} />
      <CardHeader className="space-y-1 text-center relative pt-8">
        <button
          onClick={() => setMode(null)}
          className="absolute left-6 top-8 text-emerald-100/40 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
        >
          ← Back
        </button>
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-${activeRole.color}-500/10 text-${activeRole.color}-400 ring-1 ring-${activeRole.color}-500/20`}>
          <activeRole.icon size={32} />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight text-white">{activeRole.name} Login</CardTitle>
        <CardDescription className="text-emerald-100/60 text-base">
          Enter your credentials for {activeRole.name} portal
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-200 text-sm animate-shake">
              <AlertCircle size={20} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-emerald-100/20 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all rounded-xl shadow-inner"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-emerald-100/20 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all rounded-xl shadow-inner"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm pt-2">
            <label className="flex items-center gap-2 text-emerald-100/40 cursor-pointer hover:text-emerald-100/80 transition-colors group">
              <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/20 transition-all" />
              Keep me signed in
            </label>
            <Link to="/auth/forgot-password" title="Coming soon!" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className={`w-full h-12 bg-${activeRole.color}-500 hover:bg-${activeRole.color}-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-${activeRole.color}-500/20 hover:shadow-${activeRole.color}-500/40 disabled:opacity-50`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                Signing in...
              </div>
            ) : (
              `Sign In as ${activeRole.name}`
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-emerald-100/20">or</span></div>
        </div>
        <p className="text-sm text-emerald-100/40 text-center">
          New to JobPortal?{' '}
          <Link to="/auth/register" className="text-white hover:text-emerald-400 font-bold underline transition-colors decoration-emerald-500/30">
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;
