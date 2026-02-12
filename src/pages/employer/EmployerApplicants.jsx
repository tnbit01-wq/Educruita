import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/modals/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import TextAreaField from '../../components/forms/TextAreaField';
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    StarIcon,
    PencilSquareIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const EmployerApplicants = () => {
    const { user } = useAuth();
    const [selectedJob, setSelectedJob] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [detailModal, setDetailModal] = useState(false);
    const [scheduleModal, setScheduleModal] = useState(false);
    const [interviewData, setInterviewData] = useState({ date: '', time: '', type: 'Video Call' });
    const [activeDetailTab, setActiveDetailTab] = useState('profile');
    const [selectedIds, setSelectedIds] = useState([]);
    const [noteInput, setNoteInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [applicants, setApplicants] = useState([]);
    const [jobs, setJobs] = useState([]);

    const toast = useToast();

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            // 1. Fetch employer's jobs
            const { data: jobsData, error: jobsError } = await supabase
                .from('jobs')
                .select('id, title')
                .eq('employer_id', user.id);

            if (jobsError) throw jobsError;

            const jobsList = [{ id: 'all', title: 'All Jobs' }, ...(jobsData || [])];
            setJobs(jobsList);

            // 2. Fetch applications for these jobs
            const { data: appsData, error: appsError } = await supabase
                .from('applications')
                .select(`
                    *,
                    job:jobs(id, title),
                    candidate:profiles(
                        id,
                        full_name,
                        email,
                        phone,
                        location,
                        skills,
                        experience,
                        education,
                        summary
                    )
                `)
                .in('job_id', (jobsData || []).map(j => j.id));

            if (appsError) throw appsError;

            const formattedApps = (appsData || []).map(app => ({
                id: app.id,
                name: app.candidate?.full_name || 'Unknown',
                email: app.candidate?.email || '',
                phone: app.candidate?.phone || '',
                location: app.candidate?.location || '',
                jobTitle: app.job?.title || '',
                jobId: app.job_id,
                appliedDate: new Date(app.created_at).toLocaleDateString(),
                status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
                matchScore: 85, // Mock for now
                experience: Array.isArray(app.candidate?.experience) ? `${app.candidate.experience.length} years` : 'N/A', // Assuming experience is an array of objects, or a single value
                education: Array.isArray(app.candidate?.education) && app.candidate.education.length > 0
                    ? app.candidate.education[0].degree
                    : 'N/A',
                skills: app.candidate?.skills || [],
                resume: app.resume_url,
                coverLetter: app.cover_letter || '',
                currentCTC: app.current_ctc || 'N/A', // Assuming these fields exist in applications or candidate profile
                expectedCTC: app.expected_ctc || 'N/A',
                noticePeriod: app.notice_period || 'N/A',
                starred: false, // Could store in a separate table
                notes: [], // Could store in a separate table
                summary: app.candidate?.summary || ''
            }));

            setApplicants(formattedApps);
        } catch (error) {
            console.error('Error fetching applicants:', error);
            toast.error('Failed to load applicants');
        } finally {
            setLoading(false);
        }
    };

    const statuses = [
        { value: 'all', label: 'All Status' },
        { value: 'Applied', label: 'Applied' },
        { value: 'Reviewing', label: 'Reviewing' },
        { value: 'Shortlisted', label: 'Shortlisted' },
        { value: 'Interviewing', label: 'Interviewing' },
        { value: 'Accepted', label: 'Accepted' },
        { value: 'Rejected', label: 'Rejected' },
    ];

    // Filter Logic
    const filteredApplicants = applicants.filter(app => {
        const matchesJob = selectedJob === 'all' || app.jobId === selectedJob;
        const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
        const matchesSearch = searchQuery === '' ||
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesJob && matchesStatus && matchesSearch;
    });

    // Actions
    const handleStatusChange = async (appId, newStatus) => {
        try {
            const { error } = await supabase
                .from('applications')
                .update({ status: newStatus.toLowerCase() })
                .eq('id', appId);

            if (error) throw error;

            setApplicants(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleToggleStar = (id) => {
        setApplicants(prev => prev.map(app => app.id === id ? { ...app, starred: !app.starred } : app));
    };

    // Bulk Actions
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkAction = (action) => {
        setApplicants(prev => prev.map(app => selectedIds.includes(app.id) ? { ...app, status: action } : app));
        toast.success(`${action} applied to ${selectedIds.length} applicants`);
        setSelectedIds([]);
    };

    // Notes
    const handleAddNote = () => {
        if (!noteInput.trim()) return;
        const newNote = { id: Date.now(), text: noteInput, date: new Date().toISOString().split('T')[0] };
        const updatedApplicant = { ...selectedApplicant, notes: [...selectedApplicant.notes, newNote] };

        setApplicants(prev => prev.map(app => app.id === selectedApplicant.id ? updatedApplicant : app));
        setSelectedApplicant(updatedApplicant);
        setNoteInput('');
        toast.success("Note added");
    };

    // Interview
    const handleScheduleParams = () => {
        handleStatusChange(selectedApplicant.id, 'Interview Scheduled');
        toast.success(`Interview scheduled for ${interviewData.date} at ${interviewData.time}`);
        setScheduleModal(false);
        setDetailModal(false);
    };

    const getStatusBadge = (status) => {
        const variants = {
            'Under Review': 'warning',
            'Shortlisted': 'success',
            'Rejected': 'danger',
            'Hired': 'success',
            'Interview Scheduled': 'primary'
        };
        return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Applicant Tracking</h1>
                <p className="text-gray-600 mt-1">Review, shortlist, and schedule interviews</p>
            </div>

            {/* Stats - Reduced for brevity, focusing on list features */}

            {/* Filters */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="w-full md:w-1/3">
                        <InputField
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <SelectField value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} options={jobs.map(j => ({ value: j.id, label: j.title }))} />
                        <SelectField value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} options={statuses} />
                    </div>
                </div>
            </Card>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-indigo-700">{selectedIds.length} applicants selected</span>
                    <div className="space-x-2">
                        <Button size="sm" onClick={() => handleBulkAction('Shortlisted')} className="bg-green-600">Shortlist</Button>
                        <Button size="sm" onClick={() => handleBulkAction('Rejected')} className="bg-red-600">Reject</Button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="space-y-3">
                {filteredApplicants.map((app) => (
                    <Card key={app.id} padding="p-4" className={selectedIds.includes(app.id) ? 'border-emerald-400 ring-1 ring-emerald-400' : ''}>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                className="mt-2 h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                checked={selectedIds.includes(app.id)}
                                onChange={() => toggleSelect(app.id)}
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                                            {app.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-emerald-600" onClick={() => { setSelectedApplicant(app); setDetailModal(true); }}>
                                                {app.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">{app.jobTitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <button onClick={() => handleToggleStar(app.id)}>
                                            {app.starred ? <StarSolidIcon className="h-5 w-5 text-amber-400" /> : <StarIcon className="h-5 w-5 text-gray-400" />}
                                        </button>
                                        {getStatusBadge(app.status)}
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span className="flex items-center"><EnvelopeIcon className="h-4 w-4 mr-1" /> {app.email}</span>
                                    <span className="flex items-center text-emerald-600 font-medium"><span className="bg-emerald-50 px-2 py-0.5 rounded">{app.matchScore}% Match</span></span>
                                    <span className="flex items-center"><BriefcaseIcon className="h-4 w-4 mr-1" /> {app.experience}</span>
                                </div>

                                <div className="mt-3 flex justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => { setSelectedApplicant(app); setDetailModal(true); }}>View Details</Button>
                                    {app.status !== 'Interview Scheduled' && (
                                        <Button size="sm" onClick={() => { setSelectedApplicant(app); setScheduleModal(true); }}>Schedule Interview</Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Applicant Detail Modal */}
            <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} title="Applicant Details" size="lg">
                {selectedApplicant && (
                    <div>
                        <div className="flex space-x-4 border-b mb-4">
                            <button className={`pb-2 ${activeDetailTab === 'profile' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`} onClick={() => setActiveDetailTab('profile')}>Profile</button>
                            <button className={`pb-2 ${activeDetailTab === 'notes' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`} onClick={() => setActiveDetailTab('notes')}>Internal Notes</button>
                        </div>

                        {activeDetailTab === 'profile' ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><label className="text-gray-500">Email</label><p className="font-medium">{selectedApplicant.email}</p></div>
                                    <div><label className="text-gray-500">Phone</label><p className="font-medium">{selectedApplicant.phone}</p></div>
                                    <div><label className="text-gray-500">Current CTC</label><p className="font-medium">{selectedApplicant.currentCTC}</p></div>
                                    <div><label className="text-gray-500">Expected CTC</label><p className="font-medium">{selectedApplicant.expectedCTC}</p></div>
                                    <div><label className="text-gray-500">Education</label><p className="font-medium">{selectedApplicant.education}</p></div>
                                    <div><label className="text-gray-500">Experience</label><p className="font-medium">{selectedApplicant.experience}</p></div>
                                </div>
                                <div>
                                    <label className="text-gray-500 text-sm">Skills</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedApplicant.skills.map(s => <Badge key={s} variant="default">{s}</Badge>)}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm"><DocumentTextIcon className="h-4 w-4 mr-2" /> Download Resume</Button>
                                    <Button variant="outline" size="sm" onClick={() => { setScheduleModal(true); setDetailModal(false); }}>Schedule Interview</Button>
                                </div>
                            </div>
                        ) : (
                            // NOTES TAB
                            <div className="space-y-4">
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {selectedApplicant.notes.length === 0 ? <p className="text-gray-400 italic">No notes yet.</p> : (
                                        selectedApplicant.notes.map(note => (
                                            <div key={note.id} className="bg-yellow-50 p-3 rounded border border-yellow-200">
                                                <p className="text-sm text-gray-800">{note.text}</p>
                                                <p className="text-xs text-gray-500 mt-1">{note.date}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 border rounded px-3 py-2 text-sm"
                                        placeholder="Add a private note..."
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                    />
                                    <Button size="sm" onClick={handleAddNote}>Add</Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Schedule Interview Modal */}
            <Modal isOpen={scheduleModal} onClose={() => setScheduleModal(false)} title="Schedule Interview">
                <div className="space-y-4">
                    <p>Schedule an interview with <span className="font-bold">{selectedApplicant?.name}</span></p>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Date" type="date" value={interviewData.date} onChange={e => setInterviewData({ ...interviewData, date: e.target.value })} />
                        <InputField label="Time" type="time" value={interviewData.time} onChange={e => setInterviewData({ ...interviewData, time: e.target.value })} />
                    </div>
                    <SelectField label="Type" value={interviewData.type} onChange={e => setInterviewData({ ...interviewData, type: e.target.value })}
                        options={[{ value: 'Video Call', label: 'Video Call' }, { value: 'Phone', label: 'Phone' }, { value: 'In-Person', label: 'In-Person' }]}
                    />
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setScheduleModal(false)}>Cancel</Button>
                        <Button className="bg-blue-600" onClick={handleScheduleParams}>Confirm Schedule</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EmployerApplicants;
