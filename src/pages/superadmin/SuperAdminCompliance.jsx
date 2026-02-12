import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import {
    ShieldCheckIcon,
    CloudArrowUpIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const SuperAdminCompliance = () => {
    const toast = useToast();
    const [backupStatus, setBackupStatus] = useState('Idle');
    const [lastBackup, setLastBackup] = useState('2 hours ago');

    const auditLogs = [
        { id: 1, action: 'User Login', user: 'admin@jobportal.com', ip: '192.168.1.1', time: '10 mins ago', status: 'success' },
        { id: 2, action: 'Delete Job Post', user: 'recruiter@tech.com', ip: '10.0.0.45', time: '1 hour ago', status: 'warning' },
        { id: 3, action: 'Export User Data', user: 'superadmin@portal.com', ip: '192.168.1.5', time: '3 hours ago', status: 'success' },
        { id: 4, action: 'Failed Login Attempt', user: 'unknown@ip', ip: '45.32.11.2', time: '5 hours ago', status: 'danger' },
    ];

    const fraudAlerts = [
        { id: 1, type: 'Multiple Failed Logins', risk: 'High', source: 'IP 45.33.22.11', time: '10m ago' },
        { id: 2, type: 'Suspicious Job Posting', risk: 'Medium', source: 'User #8821', time: '1h ago' },
    ];

    const handleBackup = () => {
        setBackupStatus('Backing up...');
        setTimeout(() => {
            setBackupStatus('Idle');
            setLastBackup('Just now');
            toast.success("System backup completed successfully!");
        }, 2000);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            success: 'bg-emerald-100 text-emerald-800',
            warning: 'bg-yellow-100 text-yellow-800',
            danger: 'bg-red-100 text-red-800',
            high: 'bg-red-100 text-red-800',
            medium: 'bg-amber-100 text-amber-800'
        };
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status.toLowerCase()] || 'bg-gray-100'}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Compliance & Security</h1>
                <p className="text-gray-600">Audit logs, system backups, and data privacy controls</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Data Backup & Recovery */}
                <Card title="Data Backup">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-center mb-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                <CloudArrowUpIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Last backup</p>
                                <p className="font-semibold text-gray-900">{lastBackup}</p>
                            </div>
                        </div>
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Schedule</span>
                                <span className="font-medium">Daily</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Retention</span>
                                <span className="font-medium">30 Days</span>
                            </div>
                        </div>
                        <Button fullWidth onClick={handleBackup} disabled={backupStatus !== 'Idle'}>
                            {backupStatus === 'Idle' ? 'Backup Now' : 'Processing...'}
                        </Button>
                    </div>
                </Card>

                {/* GDPR & Privacy */}
                <Card title="GDPR Controls">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <span className="flex items-center text-gray-700">
                                <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-600" /> Encryption
                            </span>
                            <span className="text-green-600 font-medium text-xs">Active</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Data Export</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Cookie Consent</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                        <Button variant="outline" fullWidth size="sm" className="mt-2">Privacy Policy</Button>
                    </div>
                </Card>

                {/* Fraud Detection - New Feature */}
                <Card title="Fraud Monitor">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Risk Level</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">LOW</span>
                        </div>
                        <div className="space-y-2">
                            {fraudAlerts.map(alert => (
                                <div key={alert.id} className="p-2 border border-red-100 bg-red-50 rounded-lg text-xs">
                                    <div className="flex justify-between font-semibold text-red-800">
                                        <span>{alert.type}</span>
                                        <span>{alert.risk}</span>
                                    </div>
                                    <div className="flex justify-between text-red-600 mt-1">
                                        <span>{alert.source}</span>
                                        <span>{alert.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" fullWidth size="sm" className="text-red-600 border-red-200 hover:bg-red-50">View All Alerts</Button>
                    </div>
                </Card>
            </div>

            {/* Audit Logs */}
            <Card title="System Audit Logs">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{log.action}</td>
                                    <td className="px-6 py-4 text-gray-500">{log.user}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.ip}</td>
                                    <td className="px-6 py-4 text-gray-500">{log.time}</td>
                                    <td className="px-6 py-4 text-right">
                                        <StatusBadge status={log.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-center">
                    <button className="text-sm text-blue-600 hover:underline flex items-center">
                        View All Logs <ArrowPathIcon className="h-4 w-4 ml-1" />
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default SuperAdminCompliance;
