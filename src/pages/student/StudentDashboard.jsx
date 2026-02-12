import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
    AcademicCapIcon,
    TrophyIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';
import AICareerPathway from '../../components/common/AICareerPathway';
import { studentDashboardStats, announcements, polls, achievements } from '../../services/campusMockData';

const StudentDashboard = () => {
    const [readAnnouncements, setReadAnnouncements] = useState([]);
    const toast = useToast();

    const stats = [
        { label: 'CGPA', value: studentDashboardStats.cgpa, icon: AcademicCapIcon, color: 'from-blue-500 to-blue-600' },
        { label: 'Attendance', value: `${studentDashboardStats.attendance}%`, icon: ChartBarIcon, color: 'from-green-500 to-green-600' },
        { label: 'Achievements', value: studentDashboardStats.achievements, icon: TrophyIcon, color: 'from-yellow-500 to-yellow-600' },
        { label: 'Groups', value: studentDashboardStats.groups, icon: UserGroupIcon, color: 'from-purple-500 to-purple-600' },
        { label: 'Pending Tasks', value: studentDashboardStats.pendingAssignments, icon: ClipboardDocumentListIcon, color: 'from-red-500 to-red-600' },
        { label: 'Upcoming Exams', value: studentDashboardStats.upcomingExams, icon: CalendarIcon, color: 'from-indigo-500 to-indigo-600' },
    ];

    const handleMarkAsRead = (id) => {
        if (!readAnnouncements.includes(id)) {
            setReadAnnouncements([...readAnnouncements, id]);
            toast.success('Marked as read');
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            high: 'bg-red-100 text-red-700 border-red-200',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            low: 'bg-blue-100 text-blue-700 border-blue-200',
        };
        return colors[priority] || colors.low;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, Rahul Sharma!</p>
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
                <AICareerPathway />
                {/* Announcements */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Announcements</h2>
                    <div className="space-y-4">
                        {announcements.slice(0, 3).map((announcement) => (
                            <div
                                key={announcement.id}
                                className={`p-4 border rounded-lg transition-all ${readAnnouncements.includes(announcement.id)
                                    ? 'bg-gray-50 border-gray-200'
                                    : 'bg-white border-emerald-200 shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                                    <Badge className={getPriorityColor(announcement.priority)} size="sm">
                                        {announcement.priority}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{announcement.content}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>By {announcement.author} • {announcement.date}</span>
                                    {!readAnnouncements.includes(announcement.id) && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleMarkAsRead(announcement.id)}
                                        >
                                            Mark as Read
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Active Polls */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Polls</h2>
                    <div className="space-y-4">
                        {polls.filter(p => p.status === 'active').map((poll) => (
                            <div key={poll.id} className="p-4 border border-gray-200 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-3">{poll.question}</h3>
                                <div className="space-y-2">
                                    {poll.options.map((option) => {
                                        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                        return (
                                            <div key={option.id}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-gray-700">{option.text}</span>
                                                    <span className="text-sm font-semibold text-gray-900">{option.votes} votes</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-gray-500 mt-3">Ends on {poll.endDate}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recent Achievements */}
            <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.slice(0, 2).map((achievement) => (
                        <div key={achievement.id} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-all">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <TrophyIcon className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span>{achievement.date}</span>
                                        <span>•</span>
                                        <span>{achievement.likes} likes</span>
                                        <Badge variant="success" size="sm">{achievement.status}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button fullWidth variant="outline" className="justify-center">
                        Post Achievement
                    </Button>
                    <Button fullWidth variant="outline" className="justify-center">
                        Apply Leave
                    </Button>
                    <Button fullWidth variant="outline" className="justify-center">
                        Join Group
                    </Button>
                    <Button fullWidth variant="outline" className="justify-center">
                        Give Feedback
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default StudentDashboard;
