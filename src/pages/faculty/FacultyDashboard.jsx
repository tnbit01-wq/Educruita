import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
    UsersIcon,
    AcademicCapIcon,
    CalendarDaysIcon, // Replaced UserGroupIcon with CalendarDaysIcon for variety, but we can reuse UserGroupIcon if needed
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    DocumentCheckIcon,
    PlusIcon,
    HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { facultyDashboardStats, announcements, leaveApplications, groups, feedbacks } from '../../services/campusMockData';

const FacultyDashboard = () => {
    const toast = useToast();
    const [pendingLeaves, setPendingLeaves] = useState(leaveApplications.filter(l => l.status === 'pending'));

    const stats = [
        { label: 'Total Students', value: facultyDashboardStats.totalStudents, icon: UsersIcon, color: 'from-blue-500 to-blue-600' },
        { label: 'Courses', value: facultyDashboardStats.courses, icon: AcademicCapIcon, color: 'from-indigo-500 to-indigo-600' },
        { label: 'Pending Leaves', value: pendingLeaves.length, icon: CalendarDaysIcon, color: 'from-amber-500 to-amber-600' },
        { label: 'Group Requests', value: facultyDashboardStats.groupRequests, icon: UserGroupIcon, color: 'from-purple-500 to-purple-600' },
        { label: 'Feedback (Avg)', value: facultyDashboardStats.averageRating, icon: ChatBubbleLeftRightIcon, color: 'from-green-500 to-green-600' },
        { label: 'Total Feedback', value: facultyDashboardStats.feedbackReceived, icon: HandThumbUpIcon, color: 'from-teal-500 to-teal-600' }
    ];

    const handleApproveLeave = (id) => {
        setPendingLeaves(prev => prev.filter(leaf => leaf.id !== id));
        toast.success(`Leave application approved.`);
    };

    const handleRejectLeave = (id) => {
        setPendingLeaves(prev => prev.filter(leaf => leaf.id !== id));
        toast.error(`Leave application rejected.`); // Using error style for rejection, or could use info
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, Dr. Priya Mehta!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card hover>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Pending Leave Requests */}
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Pending Leave Requests</h2>
                        <Button variant="outline" size="sm">View All</Button>
                    </div>

                    {pendingLeaves.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No pending leave requests.</div>
                    ) : (
                        <div className="space-y-4">
                            {pendingLeaves.map((application) => (
                                <div key={application.id} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{application.studentName}</h3>
                                            <p className="text-sm text-gray-500">{application.rollNumber} • {application.leaveType}</p>
                                        </div>
                                        <Badge variant="warning">{application.days} days</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">{application.reason}</p>
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => handleRejectLeave(application.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">Reject</Button>
                                        <Button size="sm" onClick={() => handleApproveLeave(application.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Recent Feedback */}
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Feedback</h2>
                        <Button variant="outline" size="sm">View All</Button>
                    </div>
                    <div className="space-y-4">
                        {feedbacks.slice(0, 3).map((feedback) => (
                            <div key={feedback.id} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-900">{feedback.courseName}</h3>
                                    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                                        {feedback.rating} <span className="text-[10px]">★</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 italic">"{feedback.feedback}"</p>
                                <p className="text-xs text-gray-400 mt-2 text-right">
                                    {feedback.isAnonymous ? 'Anonymous Student' : feedback.studentName} • {feedback.date}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Quick Actions & Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Announcements</h2>
                    <div className="space-y-4">
                        {announcements.filter(a => a.authorRole === 'faculty' || a.author === 'Dr. Priya Mehta').slice(0, 2).map(ann => (
                            <div key={ann.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-900 truncate max-w-[200px]">{ann.title}</p>
                                    <p className="text-xs text-gray-500">{ann.date}</p>
                                </div>
                                <Button size="sm" variant="outline">Edit</Button>
                            </div>
                        ))}
                        <Button fullWidth className="mt-2 text-emerald-600 border-emerald-600 hover:bg-emerald-50" variant="outline">
                            <PlusIcon className="h-5 w-5 mr-2" /> Create New Announcement
                        </Button>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Group Approvals</h2>
                    <div className="space-y-4">
                        {groups.filter(g => g.pendingRequests && g.pendingRequests.length > 0).slice(0, 2).map((group) => (
                            <div key={group.id} className="p-3 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                                    <Badge variant="primary">{group.pendingRequests.length} requests</Badge>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">{group.category}</p>
                                <Button size="sm" fullWidth variant="outline">Review Requests</Button>
                            </div>
                        ))}
                        {groups.filter(g => g.pendingRequests && g.pendingRequests.length > 0).length === 0 && (
                            <div className="text-center py-4 text-gray-500 text-sm">No pending group requests</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FacultyDashboard;
