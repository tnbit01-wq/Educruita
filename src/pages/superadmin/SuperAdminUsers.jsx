import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import {
    UserGroupIcon,
    ShieldCheckIcon,
    AcademicCapIcon,
    BriefcaseIcon,
    PlusIcon,
    TrashIcon,
    PencilSquareIcon,
    UserIcon,
    KeyIcon
} from '@heroicons/react/24/outline';
import { studentDirectory, facultyUsers } from '../../services/campusMockData';

// Mock Admins
const mockAdmins = [
    { id: 1, name: 'Main Admin', email: 'admin@platform.com', role: 'Admin', status: 'Active', lastActive: '2 mins ago' },
    { id: 2, name: 'Support Lead', email: 'support@platform.com', role: 'Support', status: 'Active', lastActive: '1 hour ago' },
];

// Mock Candidates
const mockCandidates = [
    { id: 1, name: 'Alice Walker', email: 'alice.walker@example.com', role: 'Candidate', status: 'Active', joined: '2 days ago' },
    { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com', role: 'Candidate', status: 'Pending Verification', joined: '5 hours ago' },
    { id: 3, name: 'Charlie Davis', email: 'charlie.d@example.com', role: 'Candidate', status: 'Active', joined: '1 week ago' },
];

const SuperAdminUsers = () => {
    const [activeTab, setActiveTab] = useState('admins');
    const toast = useToast();

    const tabs = [
        { id: 'admins', label: 'System Admins', icon: ShieldCheckIcon },
        { id: 'candidates', label: 'Candidates', icon: UserIcon },
        { id: 'students', label: 'Students', icon: AcademicCapIcon },
        { id: 'faculty', label: 'Faculty', icon: UserGroupIcon },
        { id: 'employers', label: 'Employers', icon: BriefcaseIcon },
    ];

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            toast.success('User deleted successfully');
        }
    };

    const StatusBadge = ({ status }) => (
        <Badge variant={status === 'Active' ? 'success' : status === 'Pending Verification' ? 'warning' : 'default'}>{status}</Badge>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User & Role Management</h1>
                    <p className="text-gray-600">Control access and permissions across the entire platform</p>
                </div>
                <Button>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create New User
                </Button>
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

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role/Dept</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Admins View */}
                            {activeTab === 'admins' && mockAdmins.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-500 hover:text-amber-600 mr-4" title="Reset Password"><KeyIcon className="h-5 w-5" /></button>
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Revoke</button>
                                    </td>
                                </tr>
                            ))}

                            {/* Candidates View */}
                            {activeTab === 'candidates' && mockCandidates.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-500 hover:text-amber-600 mr-3" title="Reset Password"><KeyIcon className="h-5 w-5" /></button>
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3"><PencilSquareIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                                    </td>
                                </tr>
                            ))}

                            {/* Students View */}
                            {activeTab === 'students' && studentDirectory.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="Active" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-500 hover:text-amber-600 mr-3" title="Reset Password"><KeyIcon className="h-5 w-5" /></button>
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3"><PencilSquareIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                                    </td>
                                </tr>
                            ))}

                            {/* Faculty View */}
                            {activeTab === 'faculty' && facultyUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CS Department</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status="Active" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-500 hover:text-amber-600 mr-3" title="Reset Password"><KeyIcon className="h-5 w-5" /></button>
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3"><PencilSquareIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SuperAdminUsers;
