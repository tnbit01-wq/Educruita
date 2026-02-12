import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import { mockEmployerJobs } from '../../services/mockData';
import { MagnifyingGlassIcon, BuildingOfficeIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const AdminEmployerModeration = () => {
    const toast = useToast();
    const [employers, setEmployers] = useState([
        { id: 'emp_1', name: 'TechCorp Solutions', email: 'hr@techcorp.com', status: 'verified', postedJobs: 12, reports: 0 },
        { id: 'emp_2', name: 'Innovation Labs', email: 'recruiter@innolabs.io', status: 'pending', postedJobs: 0, reports: 0 },
        { id: 'emp_3', name: 'DataFlow Inc', email: 'jobs@dataflow.com', status: 'verified', postedJobs: 5, reports: 1 },
        { id: 'emp_4', name: 'StartupXYZ', email: 'founder@startup.xyz', status: 'suspended', postedJobs: 2, reports: 15 },
    ]);

    const handleAction = (id, action) => {
        setEmployers(prev => prev.map(e => e.id === id ? { ...e, status: action === 'verify' ? 'verified' : 'suspended' } : e));
        toast.success(`Employer ${action === 'verify' ? 'verified' : 'suspended'} successfully`);
    };

    const StatusBadge = ({ status }) => {
        const variants = { verified: 'success', pending: 'warning', suspended: 'danger' };
        return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Employer Moderation</h1>
                <p className="text-gray-600">Verify companies and manage access</p>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="text" placeholder="Search companies..." className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div className="flex gap-2">
                        <select className="border rounded-lg px-3 py-2 text-sm text-gray-600">
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Verified</option>
                            <option>Suspended</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employers.map((emp) => (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                                                <BuildingOfficeIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{emp.name}</div>
                                                <div className="text-sm text-gray-500">{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={emp.status} /></td>
                                    <td className="px-6 py-4 text-gray-500">{emp.postedJobs}</td>
                                    <td className="px-6 py-4 text-gray-500">{emp.reports > 0 ? <span className="text-red-500 font-bold">{emp.reports}</span> : '0'}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {emp.status === 'pending' && (
                                            <button onClick={() => handleAction(emp.id, 'verify')} className="text-emerald-600 hover:text-emerald-800 font-medium text-sm">Verify</button>
                                        )}
                                        {emp.status !== 'suspended' && (
                                            <button onClick={() => handleAction(emp.id, 'suspend')} className="text-red-600 hover:text-red-800 font-medium text-sm">Suspend</button>
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

export default AdminEmployerModeration;
