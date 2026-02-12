import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useToast } from '../../contexts/ToastContext';
import {
    MagnifyingGlassIcon,
    UserIcon,
    FlagIcon,
    DocumentCheckIcon,
    ArrowTopRightOnSquareIcon,
    TagIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const AdminCandidateModeration = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('profiles');

    const [candidates, setCandidates] = useState([
        { id: 'cand_1', name: 'Alex Johnson', email: 'alex@example.com', status: 'active', profileScore: 85, reports: 0, resumeTags: ['React', 'Senior'] },
        { id: 'cand_2', name: 'Sarah Smith', email: 'sarah@example.com', status: 'active', profileScore: 92, reports: 0, resumeTags: ['UX/UI', 'Lead'] },
        { id: 'cand_3', name: 'Mike Brown', email: 'mike@example.com', status: 'shadow_banned', profileScore: 45, reports: 3, resumeTags: [] },
    ]);

    const [bgvRequests, setBgvRequests] = useState([
        { id: 1, candidate: 'Alex Johnson', docType: 'Degree Certificate', status: 'pending', date: '2 hours ago' },
        { id: 2, candidate: 'Mike Brown', docType: 'ID Proof', status: 'pending', date: '1 day ago' },
    ]);

    const handleAction = (id, action) => {
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: action === 'restore' ? 'active' : 'shadow_banned' } : c));
        toast.success(`Candidate ${action === 'restore' ? 'restored' : 'flagged'} successfully`);
    };

    const handleTagResume = (id) => {
        const tag = prompt("Enter tag to add:");
        if (tag) toast.success("Tag added to resume profile");
    };

    const handleBGV = (id, action) => {
        setBgvRequests(prev => prev.filter(r => r.id !== id));
        toast.success(`Document ${action === 'approve' ? 'verified' : 'rejected'}`);
    };

    const StatusBadge = ({ status }) => {
        const variants = { active: 'success', shadow_banned: 'danger' };
        return <Badge variant={variants[status]}>{status.replace('_', ' ').toUpperCase()}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Candidate Moderation</h1>
                <p className="text-gray-600">Review profiles, verify documents, and manage flagged accounts</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
                <button
                    onClick={() => setActiveTab('profiles')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'profiles' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <UserIcon className="h-4 w-4 mr-2" /> Profiles
                </button>
                <button
                    onClick={() => setActiveTab('bgv')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'bgv' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <DocumentCheckIcon className="h-4 w-4 mr-2" /> BGV Requests
                    {bgvRequests.length > 0 && <span className="ml-2 bg-red-100 text-red-600 px-2 rounded-full text-xs">{bgvRequests.length}</span>}
                </button>
            </div>

            <Card>
                {activeTab === 'profiles' ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative w-64">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input type="text" placeholder="Search candidates..." className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume Analysis</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {candidates.map((cand) => (
                                        <tr key={cand.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                        <UserIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{cand.name}</div>
                                                        <div className="text-sm text-gray-500">{cand.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><StatusBadge status={cand.status} /></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className={`text-lg font-bold ${cand.profileScore > 80 ? 'text-green-600' : 'text-amber-600'}`}>
                                                        {cand.profileScore}
                                                    </span>
                                                    <span className="text-gray-400 text-xs ml-1">/100</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {cand.resumeTags.map(tag => (
                                                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">{tag}</span>
                                                    ))}
                                                    <button
                                                        onClick={() => handleTagResume(cand.id)}
                                                        className="px-2 py-0.5 text-xs text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200"
                                                    >
                                                        + Tag
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm" title="Review Resume">
                                                    <ArrowTopRightOnSquareIcon className="h-5 w-5 inline" />
                                                </button>
                                                {cand.status === 'shadow_banned' ? (
                                                    <button onClick={() => handleAction(cand.id, 'restore')} className="text-emerald-600 hover:text-emerald-800 font-medium text-sm">Restore</button>
                                                ) : (
                                                    <button onClick={() => handleAction(cand.id, 'ban')} className="text-red-600 hover:text-red-800 font-medium text-sm inline-flex items-center">
                                                        <FlagIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    // BGV Tab
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bgvRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">All documents processed.</td>
                                    </tr>
                                ) : (
                                    bgvRequests.map(req => (
                                        <tr key={req.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{req.candidate}</td>
                                            <td className="px-6 py-4 text-gray-500 flex items-center">
                                                <DocumentCheckIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                {req.docType}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{req.date}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleBGV(req.id, 'approve')}
                                                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium"
                                                >
                                                    <CheckCircleIcon className="h-4 w-4 mr-1" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleBGV(req.id, 'reject')}
                                                    className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium"
                                                >
                                                    <XCircleIcon className="h-4 w-4 mr-1" /> Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminCandidateModeration;
