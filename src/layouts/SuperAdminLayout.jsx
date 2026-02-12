import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

// Super Admin layout for system owner
const SuperAdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/superadmin/dashboard', icon: HomeIcon },
    { name: 'User & Role Management', href: '/superadmin/users', icon: UsersIcon },
    { name: 'Platform Configuration', href: '/superadmin/config', icon: Cog6ToothIcon },
    { name: 'CMS', href: '/superadmin/cms', icon: DocumentTextIcon },
    { name: 'Analytics', href: '/superadmin/analytics', icon: ChartBarIcon },
    { name: 'Compliance & Security', href: '/superadmin/compliance', icon: ShieldCheckIcon },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-indigo-700">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white rounded flex items-center justify-center text-indigo-900 font-bold">S</div>
            <h1 className="text-xl font-bold tracking-tight">Super Admin</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 border-b border-indigo-700">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center text-indigo-900 font-bold">
              {(user?.full_name || user?.email || 'SA').substring(0, 2).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold truncate w-32">{user?.full_name || 'Super Admin'}</p>
              <p className="text-xs text-indigo-300 capitalize">{user?.role || 'Super Admin'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto sidebar-scroll-dark">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700 font-normal'
                  }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-700 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-300 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      <div className="lg:pl-64">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex-1"></div>

            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <BellIcon className="h-6 w-6" />
            </button>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
