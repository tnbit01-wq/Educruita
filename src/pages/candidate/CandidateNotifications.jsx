import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
    BellIcon,
    BriefcaseIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const CandidateNotifications = () => {
    const [filter, setFilter] = useState('all');

    const notifications = [
        { id: 1, type: 'job', title: 'New Job Alert: React Developer', message: 'A new job matching your preferences was posted by TechCorp.', time: '2 hours ago', read: false },
        { id: 2, type: 'system', title: 'Profile Strength', message: 'Your profile is 80% complete. Add a project to reach 100%.', time: '1 day ago', read: false },
        { id: 3, type: 'application', title: 'Interview Scheduled', message: 'Your interview with Google is scheduled for tomorrow at 10 AM.', time: '1 day ago', read: true },
        { id: 4, type: 'application', title: 'Application Viewed', message: 'Your application for Senior Engineer was viewed by the recruiter.', time: '2 days ago', read: true },
        { id: 5, type: 'job', title: 'Job Alert: Frontend Engineer', message: 'New role at Airbnb matches your skills.', time: '3 days ago', read: true },
    ];

    const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

    const getIcon = (type) => {
        switch (type) {
            case 'job': return <BriefcaseIcon className="h-6 w-6 text-blue-500" />;
            case 'application': return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
            case 'system': return <InformationCircleIcon className="h-6 w-6 text-amber-500" />;
            default: return <BellIcon className="h-6 w-6 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-1">Stay updated with your job search activity</p>
                </div>
                <Button variant="outline">Mark all as read</Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-gray-200 pb-1">
                {['all', 'job', 'application', 'system'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-colors ${filter === f ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {f}s
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No notifications found</div>
                ) : (
                    filtered.map((note) => (
                        <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Card padding="md" className={`border-l-4 ${note.read ? 'border-gray-200 bg-white' : 'border-blue-500 bg-blue-50/30'}`}>
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-white p-2 rounded-full shadow-sm h-fit">
                                        {getIcon(note.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-medium ${note.read ? 'text-gray-800' : 'text-gray-900 font-semibold'}`}>{note.title}</h3>
                                            <span className="text-xs text-gray-500 flex items-center"><ClockIcon className="h-3 w-3 mr-1" />{note.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{note.message}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CandidateNotifications;
