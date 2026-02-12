import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { useToast } from '../../contexts/ToastContext';
import {
    UserCircleIcon,
    BellIcon,
    LockClosedIcon,
    GlobeAltIcon,
    MoonIcon
} from '@heroicons/react/24/outline';

const Toggle = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-gray-700 font-medium">{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </button>
    </div>
);

const SettingsPage = ({ role, userDefaults, ProfileComponent }) => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('profile');

    // Mock State
    const [profile, setProfile] = useState(userDefaults || {
        name: 'User Name',
        email: 'user@example.com',
        bio: 'Passionate about technology and innovation.',
        phone: '+1 234 567 890'
    });

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
        updates: true
    });

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    const tabs = [
        { id: 'profile', label: 'Edit Profile', icon: UserCircleIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'security', label: 'Security', icon: LockClosedIcon },
        { id: 'preferences', label: 'Preferences', icon: GlobeAltIcon },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon className="h-5 w-5 mr-3" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    {activeTab === 'profile' && (
                        ProfileComponent ? (
                            <ProfileComponent />
                        ) : (
                            <Card title="Profile Information">
                                <div className="space-y-4">
                                    {/* Default/Fallback Profile Form Content */}
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                                            {profile.name.charAt(0)}
                                        </div>
                                        <Button variant="outline" size="sm">Change Avatar</Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                className="mt-1 block w-full rounded-md border p-2 border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                                            <textarea
                                                rows={3}
                                                value={profile.bio}
                                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button onClick={handleSave}>Save Changes</Button>
                                    </div>
                                </div>
                            </Card>
                        )
                    )}

                    {activeTab === 'notifications' && (
                        <Card title="Notification Preferences">
                            <div className="space-y-2">
                                <Toggle
                                    label="Email Notifications"
                                    enabled={notifications.email}
                                    onChange={(val) => setNotifications({ ...notifications, email: val })}
                                />
                                <Toggle
                                    label="Push Notifications"
                                    enabled={notifications.push}
                                    onChange={(val) => setNotifications({ ...notifications, push: val })}
                                />
                                <Toggle
                                    label="Product Updates"
                                    enabled={notifications.updates}
                                    onChange={(val) => setNotifications({ ...notifications, updates: val })}
                                />
                                <Toggle
                                    label="Marketing Emails"
                                    enabled={notifications.marketing}
                                    onChange={(val) => setNotifications({ ...notifications, marketing: val })}
                                />
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave}>Save Preferences</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card title="Security Settings">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                    <input type="password" className="mt-1 block w-full rounded-md border p-2 border-gray-300" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input type="password" className="mt-1 block w-full rounded-md border p-2 border-gray-300" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <input type="password" className="mt-1 block w-full rounded-md border p-2 border-gray-300" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave}>Update Password</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'preferences' && (
                        <Card title="App Preferences">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Theme</label>
                                    <select className="mt-1 block w-full rounded-md border p-2 border-gray-300">
                                        <option>Light Mode</option>
                                        <option>Dark Mode</option>
                                        <option>System Default</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Language</label>
                                    <select className="mt-1 block w-full rounded-md border p-2 border-gray-300">
                                        <option>English (US)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave}>Save Preferences</Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
