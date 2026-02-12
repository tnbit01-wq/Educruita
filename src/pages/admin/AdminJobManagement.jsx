import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import {
    BriefcaseIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
    TrashIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const AdminJobManagement = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('pending');

    const [jobs, setJobs] = useState([
        { id: 1, title: 'Senior React Developer', company: 'TechCorp', status: 'pending', posted: '2 hours ago', featured: false },
        { id: 2, title: 'UX Designer', company: 'Creative Studio', status: 'active', posted: '1 day ago', featured: true },
        { id: 3, title: 'Product Manager', company: 'StartupXYZ', status: 'pending', posted: '5 hours ago', featured: false },
        { id: 4, title: 'Data Scientist', company: 'DataFlow', status: 'active', posted: '3 days ago', featured: false },
        { id: 5, title: 'Intern - Marketing', company: 'RetailGiant', status: 'expired', posted: '1 month ago', featured: false },
    ]);

    const handleApprove = (id) => {
        setJobs(jobs.map(j => j.id === id ? { ...j, status: 'active' } : j));
        toast.success("Job approved and published!");
    };

    const handleReject = (id) => {
        setJobs(jobs.filter(j => j.id !== id));
        toast.error("Job posting rejected and removed.");
    };

    const toggleFeatured = (id) => {
        setJobs(jobs.map(j => j.id === id ? { ...j, featured: !j.featured } : j));
        toast.success("Job feature status updated");
    };

    const filteredJobs = jobs.filter(j => j.status === activeTab);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Job & Application Management</h1>
                <p className="text-gray-600">Monitor postings, approve content, and manage featured jobs</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
                {['pending', 'active', 'expired'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setActiveTab(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === status
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {status} Jobs
                    </button>
                ))}
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No jobs found in this category.
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                <span className="font-medium text-gray-900">{job.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{job.company}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{job.posted}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleFeatured(job.id)}
                                                className={`p-1 rounded-full hover:bg-gray-100 ${job.featured ? 'text-amber-500' : 'text-gray-300'}`}
                                            >
                                                {job.featured ? <StarIconSolid className="h-5 w-5" /> : <StarIcon className="h-5 w-5" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {activeTab === 'pending' && (
                                                <>
                                                    <button onClick={() => handleApprove(job.id)} className="text-emerald-600 hover:text-emerald-800" title="Approve">
                                                        <CheckCircleIcon className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleReject(job.id)} className="text-red-600 hover:text-red-800" title="Reject">
                                                        <XCircleIcon className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                            {activeTab !== 'pending' && (
                                                <button onClick={() => handleReject(job.id)} className="text-red-600 hover:text-red-800" title="Delete">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminJobManagement;
