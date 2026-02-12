import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useToast } from '../../contexts/ToastContext';
import { DocumentTextIcon, MegaphoneIcon, HomeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const SuperAdminCMS = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('landing');

    // Mock Data
    const [heroText, setHeroText] = useState({
        title: 'The intelligent ecosystem connecting talent, education, and opportunity',
        subtitle: 'Experience the future of recruitment and campus management.'
    });

    const staticPages = [
        { id: 1, title: 'About Us', lastUpdated: '2 days ago', status: 'Published' },
        { id: 2, title: 'Privacy Policy', lastUpdated: '1 month ago', status: 'Published' },
        { id: 3, title: 'Terms of Service', lastUpdated: '1 month ago', status: 'Published' },
        { id: 4, title: 'Contact Support', lastUpdated: '1 week ago', status: 'Draft' },
    ];

    const announcements = [
        { id: 1, title: 'Platform Maintenance Scheduled', date: '2025-10-15', category: 'System' },
        { id: 2, title: 'New AI Features Released', date: '2025-10-10', category: 'Product' },
        { id: 3, title: 'Career Fair Registration Open', date: '2025-10-05', category: 'Events' },
    ];

    const handleSave = () => {
        toast.success("Content updated successfully!");
    };

    const tabs = [
        { id: 'landing', label: 'Landing Page', icon: HomeIcon },
        { id: 'pages', label: 'Static Pages', icon: DocumentTextIcon },
        { id: 'announcements', label: 'Blog & Announcements', icon: MegaphoneIcon },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
                <p className="text-gray-600">Update landing page, legal documents, and announcements</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon className="h-4 w-4 mr-2" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Landing Page Editor */}
            {activeTab === 'landing' && (
                <Card title="Hero Section Configuration">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Main Headline</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                value={heroText.title}
                                onChange={(e) => setHeroText({ ...heroText, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subheadline</label>
                            <textarea
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                value={heroText.subtitle}
                                onChange={(e) => setHeroText({ ...heroText, subtitle: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end border-t pt-4">
                            <Button onClick={handleSave}>Publish Changes</Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Static Pages */}
            {activeTab === 'pages' && (
                <Card title="Page Management">
                    <div className="space-y-4">
                        {staticPages.map(page => (
                            <div key={page.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{page.title}</h3>
                                    <p className="text-xs text-gray-500">Last updated: {page.lastUpdated}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${page.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {page.status}
                                    </span>
                                    <Button size="sm" variant="outline">
                                        <PencilSquareIcon className="h-4 w-4 mr-1" /> Edit
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button className="mt-4" fullWidth variant="outline">
                            + Create New Page
                        </Button>
                    </div>
                </Card>
            )}

            {/* Announcements */}
            {activeTab === 'announcements' && (
                <Card title="Announcements & Blog">
                    <div className="space-y-4">
                        {announcements.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                    <p className="text-xs text-gray-500">{item.date} • {item.category}</p>
                                </div>
                                <Button size="sm" variant="outline">
                                    Manage
                                </Button>
                            </div>
                        ))}
                        <Button className="mt-4" fullWidth>
                            Post New Announcement
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SuperAdminCMS;
