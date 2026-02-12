import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import {
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    MegaphoneIcon,
    TicketIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const AdminSupport = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('tickets');

    // Ticket State
    const [tickets, setTickets] = useState([
        { id: 1, subject: 'Login Issue', user: 'alex@example.com', status: 'open', priority: 'high', date: '2 hours ago' },
        { id: 2, subject: 'Payment Failed', user: 'recruiter@tech.com', status: 'open', priority: 'medium', date: '5 hours ago' },
        { id: 3, subject: 'Feature Request', user: 'student@college.edu', status: 'closed', priority: 'low', date: '1 day ago' },
    ]);

    // Broadcast State
    const [broadcast, setBroadcast] = useState({
        subject: '',
        message: '',
        audience: 'all',
        channels: { email: true, push: false, inapp: true }
    });

    const handleResolve = (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed' } : t));
        toast.success("Ticket marked as resolved");
    };

    const handleSendBroadcast = () => {
        if (!broadcast.subject || !broadcast.message) {
            toast.error("Please fill in subject and message");
            return;
        }
        toast.success(`Broadcast sent to ${broadcast.audience.toUpperCase()} group!`);
        setBroadcast({ ...broadcast, subject: '', message: '' });
    };

    const PriorityBadge = ({ priority }) => {
        const variants = { high: 'danger', medium: 'warning', low: 'default' };
        return <Badge variant={variants[priority]}>{priority.toUpperCase()}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Support & Communication</h1>
                <p className="text-gray-600">Solve user issues and broadcast platform announcements</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
                <button
                    onClick={() => setActiveTab('tickets')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'tickets' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <TicketIcon className="h-4 w-4 mr-2" /> Support Tickets
                    <span className="ml-2 bg-red-100 text-red-600 px-2 rounded-full text-xs">
                        {tickets.filter(t => t.status === 'open').length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('broadcast')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'broadcast' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <MegaphoneIcon className="h-4 w-4 mr-2" /> Broadcast Center
                </button>
            </div>

            <Card>
                {activeTab === 'tickets' ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{ticket.subject}</td>
                                        <td className="px-6 py-4 text-gray-500">{ticket.user}</td>
                                        <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                                        <td className="px-6 py-4">
                                            <Badge variant={ticket.status === 'open' ? 'warning' : 'success'}>
                                                {ticket.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{ticket.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            {ticket.status === 'open' && (
                                                <button onClick={() => handleResolve(ticket.id)} className="text-emerald-600 hover:text-emerald-800 flex items-center justify-end w-full">
                                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                    Resolve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Broadcast Tab
                    <div className="max-w-2xl mx-auto space-y-6 py-4">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                <select
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={broadcast.audience}
                                    onChange={(e) => setBroadcast({ ...broadcast, audience: e.target.value })}
                                >
                                    <option value="all">All Users</option>
                                    <option value="candidates">Candidates Only</option>
                                    <option value="employers">Employers Only</option>
                                    <option value="students">Students & Faculty</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Broadcast Subject</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. System Maintenance Update"
                                    value={broadcast.subject}
                                    onChange={(e) => setBroadcast({ ...broadcast, subject: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
                                <textarea
                                    rows={5}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Write your announcement here..."
                                    value={broadcast.message}
                                    onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-6">
                                <label className="flex items-center space-x-2 text-sm text-gray-700">
                                    <input type="checkbox" checked={broadcast.channels.email} onChange={(e) => setBroadcast({ ...broadcast, channels: { ...broadcast.channels, email: e.target.checked } })} className="rounded text-indigo-600 focus:ring-indigo-500" />
                                    <span>Send Email</span>
                                </label>
                                <label className="flex items-center space-x-2 text-sm text-gray-700">
                                    <input type="checkbox" checked={broadcast.channels.inapp} onChange={(e) => setBroadcast({ ...broadcast, channels: { ...broadcast.channels, inapp: e.target.checked } })} className="rounded text-indigo-600 focus:ring-indigo-500" />
                                    <span>In-App Notification</span>
                                </label>
                                <label className="flex items-center space-x-2 text-sm text-gray-700">
                                    <input type="checkbox" checked={broadcast.channels.push} onChange={(e) => setBroadcast({ ...broadcast, channels: { ...broadcast.channels, push: e.target.checked } })} className="rounded text-indigo-600 focus:ring-indigo-500" />
                                    <span>Mobile Push</span>
                                </label>
                            </div>

                            <button
                                onClick={handleSendBroadcast}
                                className="w-full flex justify-center py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all"
                            >
                                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                                Send Broadcast
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminSupport;
