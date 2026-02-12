import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import { studentDirectory } from '../../services/campusMockData';
import { MagnifyingGlassIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const AdminStudentModeration = () => {
    const toast = useToast();
    // Enrich mock data with status
    const [students, setStudents] = useState(studentDirectory.map(s => ({ ...s, status: 'active' })));

    const StatusBadge = ({ status }) => <Badge variant="success">{status.toUpperCase()}</Badge>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Moderation</h1>
                <p className="text-gray-600">Verify student identities and academic status</p>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="text" placeholder="Search students..." className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((std) => (
                                <tr key={std.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                                                <AcademicCapIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{std.name}</div>
                                                <div className="text-sm text-gray-500">{std.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{std.rollNumber}</td>
                                    <td className="px-6 py-4 text-gray-500">{std.department}</td>
                                    <td className="px-6 py-4"><StatusBadge status={std.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View Profile</button>
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

export default AdminStudentModeration;
