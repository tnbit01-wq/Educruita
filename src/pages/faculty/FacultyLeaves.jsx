import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import { leaveApplications } from '../../services/campusMockData';

const FacultyLeaves = () => {
    const [leaves, setLeaves] = useState(leaveApplications);
    const toast = useToast();

    const handleAction = (id, status) => {
        setLeaves(prev => prev.map(leave =>
            leave.id === id ? { ...leave, status: status, reviewedBy: 'Me', reviewDate: new Date().toISOString().split('T')[0] } : leave
        ));
        toast.success(`Leave request ${status} successfully`);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>

            <Card>
                <div className="space-y-4">
                    {leaves.map((leave) => (
                        <div key={leave.id} className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-gray-900">{leave.studentName}</h3>
                                    <span className="text-xs text-gray-400">({leave.rollNumber})</span>
                                    <Badge variant={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}>
                                        {leave.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                    <strong>Type:</strong> {leave.leaveType} • <strong>Duration:</strong> {leave.days} days ({leave.startDate} to {leave.endDate})
                                </p>
                                <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded w-full md:w-auto">
                                    "{leave.reason}"
                                </p>
                            </div>

                            {leave.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => handleAction(leave.id, 'rejected')}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={() => handleAction(leave.id, 'approved')}
                                    >
                                        Approve
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default FacultyLeaves;
