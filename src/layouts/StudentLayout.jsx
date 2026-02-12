import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    TrophyIcon,
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    BellIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    AcademicCapIcon,
    Cog6ToothIcon,
    RssIcon,
    SparklesIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const StudentLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
        { name: 'Achievements', href: '/student/achievements', icon: TrophyIcon },
        { name: 'Groups', href: '/student/groups', icon: UserGroupIcon },
        { name: 'Mentorship Feed', href: '/student/feed', icon: RssIcon },
        { name: 'Messages', href: '/student/messages', icon: ChatBubbleLeftRightIcon },
        { name: 'Settings', href: '/student/settings', icon: Cog6ToothIcon },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        await logout();
        navigate('/auth/login');
    };

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
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <AcademicCapIcon className="h-8 w-8 text-emerald-600 mr-2" />
                        <h1 className="text-xl font-bold text-gray-900">Campus<span className="text-emerald-600">Connect</span></h1>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                        <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                            {(user?.full_name || user?.email || 'S').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900 truncate w-32">{user?.full_name || 'Student'}</p>
                            <p className="text-xs text-gray-500">Student • {user?.department || 'Candidate'}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto sidebar-scroll">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
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
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
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

export default StudentLayout;
