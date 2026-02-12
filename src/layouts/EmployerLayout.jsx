import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

// Employer/Recruiter layout with sidebar navigation
const EmployerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/employer/dashboard', icon: HomeIcon },
    { name: 'Company Profile', href: '/employer/profile', icon: BuildingOfficeIcon },
    { name: 'Job Management', href: '/employer/jobs', icon: BriefcaseIcon },
    { name: 'Applicant Tracking', href: '/employer/applicants', icon: UsersIcon },
    { name: 'Messages', href: '/employer/messages', icon: ChatBubbleLeftRightIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold">J</div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">JobPortal</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Company info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold uppercase">
              {(user?.full_name || user?.email || 'E').substring(0, 2)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900 truncate w-32">{user?.full_name || 'Employer'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Employer'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto sidebar-scroll">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-200 space-y-1">
          <Link
            to="/employer/settings"
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <Cog6ToothIcon className="h-5 w-5 mr-3" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex-1"></div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployerLayout;
