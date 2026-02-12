import React from 'react';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import {
    ChartBarIcon,
    ArrowDownTrayIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    DocumentCheckIcon
} from '@heroicons/react/24/outline';
import { STAT_GRADIENTS } from '../../constants/designSystem';

const SuperAdminAnalytics = () => {
    // Mock Data for "Total candidates, employers, jobs, applications" is already covered in Dashboard, 
    // but we will visualize "Profile Completion" and "Resume Downloads" here.

    const resumeStats = [
        { label: 'Total Downloads', value: '12,450', change: '+15%', trend: 'up' },
        { label: 'Avg Downloads/Candidate', value: '3.2', change: '+5%', trend: 'up' },
    ];

    const bgvStats = [
        { status: 'Verified', count: 850, color: 'bg-emerald-500' },
        { status: 'Pending', count: 120, color: 'bg-yellow-500' },
        { status: 'Rejected', count: 45, color: 'bg-red-500' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600">Deep dive into platform performance and user metrics</p>
            </div>

            {/* Resume & Profile Metrics */}
            <h2 className="text-xl font-bold text-gray-800">Engagement & Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Resume Downloads"
                    value={resumeStats[0].value}
                    icon={ArrowDownTrayIcon}
                    gradient={STAT_GRADIENTS.blue}
                />
                <StatCard
                    label="Profile Completion Avg"
                    value="78%"
                    icon={UserGroupIcon}
                    gradient={STAT_GRADIENTS.purple}
                />
                <StatCard
                    label="Monthly Revenue"
                    value="₹38,50,000"
                    icon={CurrencyDollarIcon}
                    gradient={STAT_GRADIENTS.emerald}
                />
                <StatCard
                    label="BGV Verifications"
                    value="1,015"
                    icon={DocumentCheckIcon}
                    gradient={STAT_GRADIENTS.amber}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual Chart Placeholder for Revenue */}
                <Card title="Revenue & Subscription Analytics">
                    <div className="h-64 flex items-end justify-between space-x-2 px-4">
                        {[40, 65, 50, 80, 95, 70, 85, 100, 90, 75, 60, 95].map((h, i) => (
                            <div key={i} className="w-full bg-emerald-100 rounded-t-lg relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                ></div>
                                <div className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                    ₹{h}k
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
                        <span>Jan</span><span>Dec</span>
                    </div>
                </Card>

                {/* BGV Status Report */}
                <Card title="BGV Document Verification Status">
                    <div className="flex items-center justify-center py-6">
                        {/* Simple Donut Chart Representation */}
                        <div className="relative h-48 w-48 rounded-full border-8 border-gray-100 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-8 border-emerald-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                            <div className="absolute inset-0 rounded-full border-8 border-yellow-500 rotate-90" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)' }}></div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-gray-800">1,015</span>
                                <span className="text-xs text-gray-500">Total Requests</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 mt-4">
                        {bgvStats.map((stat) => (
                            <div key={stat.status} className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full ${stat.color} mr-2`}></div>
                                    <span>{stat.status}</span>
                                </div>
                                <span className="font-semibold">{stat.count}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Detailed Reports Table Placeholder */}
            <Card title="Downloadable Reports">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-4 py-3">Report Name</th>
                                <th className="px-4 py-3">Generated</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="px-4 py-3">Monthly_Revenue_Oct2025.pdf</td>
                                <td className="px-4 py-3 text-gray-500">Oct 31, 2025</td>
                                <td className="px-4 py-3 text-right"><button className="text-blue-600 hover:underline">Download</button></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Student_Profile_Completion.csv</td>
                                <td className="px-4 py-3 text-gray-500">Nov 02, 2025</td>
                                <td className="px-4 py-3 text-right"><button className="text-blue-600 hover:underline">Download</button></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">BGV_Audit_Log.csv</td>
                                <td className="px-4 py-3 text-gray-500">Nov 05, 2025</td>
                                <td className="px-4 py-3 text-right"><button className="text-blue-600 hover:underline">Download</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SuperAdminAnalytics;
