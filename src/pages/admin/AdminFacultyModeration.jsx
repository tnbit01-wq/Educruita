import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import { facultyUsers } from '../../services/campusMockData';
import { MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const AdminFacultyModeration = () => {
    const toast = useToast();
    // Default mock faculty
    const [faculty, setFaculty] = useState([
        { id: 'fac_1', name: 'Dr. Priya Mehta', email: 'priya@college.edu', department: 'Computer Science', status: 'active' },
        { id: 'fac_2', name: 'Prof. Rajesh Kumar', email: 'rajesh@college.edu', department: 'Electronics', status: 'pending' },
    ]);

    const handleApprove = (id) => {
        setFaculty(prev => prev.map(f => f.id === id ? { ...f, status: 'active' } : f));
        toast.success("Faculty approved successfully");
    };

    const StatusBadge = ({ status }) => {
        const variants = { active: 'success', pending: 'warning' };
        return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Faculty Moderation</h1>
                <p className="text-gray-600">Approve and manage faculty accounts</p>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="text" placeholder="Search faculty..." className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty Member</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {faculty.map((fac) => (
                                <tr key={fac.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                <UserGroupIcon className="h-5 w-5" />
                                            </div>
                                            <div className="font-medium text-gray-900">{fac.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{fac.department}</td>
                                    <td className="px-6 py-4"><StatusBadge status={fac.status} /></td>
                                    <td className="px-6 py-4 text-gray-500">{fac.email}</td>
                                    <td className="px-6 py-4 text-right">
                                        {fac.status === 'pending' && (
                                            <button onClick={() => handleApprove(fac.id)} className="text-emerald-600 hover:text-emerald-800 font-medium text-sm">Approve</button>
                                        )}
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

export default AdminFacultyModeration;
