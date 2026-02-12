import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import Modal from '../../components/modals/Modal';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  BookmarkIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon,
  BellIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const CandidateJobs = () => {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailModal, setJobDetailModal] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const toast = useToast();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);

  // Mock Recommended Jobs
  const recommendedJobs = [
    { id: 101, title: 'Frontend Developer', company: 'Google', location: 'Remote', match: 95, skills: ['React', 'TS'] },
    { id: 102, title: 'React Native Eng', company: 'Uber', location: 'Bangalore', match: 92, skills: ['React Native', 'Mobile'] },
    { id: 103, title: 'UI Engineer', company: 'Airbnb', location: 'Singapore', match: 88, skills: ['Design', 'React'] },
  ];

  const [filters, setFilters] = useState({
    type: '',
    experience: '',
    minSalary: '',
    minCgpa: '',
  });

  const [sortBy, setSortBy] = useState('recent');
  const [alertPreferences, setAlertPreferences] = useState({ role: '', location: '', frequency: 'daily' });

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          employer:profiles(full_name)
        `)
        .eq('status', 'active');

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      if (locationQuery) {
        query = query.ilike('location', `%${locationQuery}%`);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Map Supabase data to existing UI structure
      const formattedJobs = (data || []).map(j => ({
        ...j,
        company: j.employer?.full_name || 'Anonymous Company',
        salary: j.salary_range || 'Not Disclosed',
        experience: '2-4 years', // Default if not in schema yet
        skills: j.requirements || ['General']
      }));

      setJobs(formattedJobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('candidate_id', user.id);

      if (error) throw error;
      setSavedJobs((data || []).map(s => s.job_id));
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    }
  };

  const handleToggleSave = async (jobId) => {
    if (!user) {
      toast.error('Please login to save jobs');
      return;
    }

    const isSaved = savedJobs.includes(jobId);

    try {
      if (isSaved) {
        // Unsave
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('job_id', jobId)
          .eq('candidate_id', user.id);

        if (error) throw error;
        setSavedJobs(prev => prev.filter(id => id !== jobId));
        toast.success('Job removed from saved');
      } else {
        // Save
        const { error } = await supabase
          .from('saved_jobs')
          .insert([{ job_id: jobId, candidate_id: user.id }]);

        if (error) throw error;
        setSavedJobs(prev => [...prev, jobId]);
        toast.success('Job saved successfully!');
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
      toast.error('Failed to update saved jobs');
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchSavedJobs();
    } else {
      // If no user, clear saved jobs and just fetch jobs
      setSavedJobs([]);
      fetchJobs();
    }
  }, [user, searchQuery, locationQuery, filters]);

  const handleSearch = () => fetchJobs();
  const handleJobClick = (job) => { setSelectedJob(job); setJobDetailModal(true); };

  const handleApply = async () => {
    if (!user) {
      toast.error('You must be logged in to apply');
      return;
    }
    setApplying(true);
    try {
      const { error: applyError } = await supabase
        .from('applications')
        .insert([
          {
            job_id: selectedJob.id,
            candidate_id: user.id,
            status: 'applied'
          }
        ]);

      if (applyError) {
        if (applyError.code === '23505') {
          toast.error('You have already applied to this job');
        } else {
          throw applyError;
        }
      } else {
        toast.success(`Successfully applied to ${selectedJob.title}!`);
      }
      setJobDetailModal(false);
    } catch (error) {
      console.error('Apply error:', error);
      toast.error('Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const createJobAlert = () => {
    toast.success('Job Alert Created! You will be notified via email.');
    setAlertModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Search</h1>
          <p className="text-gray-600 mt-1">Find your dream job with AI-powered recommendations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setAlertModal(true)}>
            <BellIcon className="h-5 w-5 mr-2 text-amber-500" />
            Job Alerts
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Recommended Jobs Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <SparklesIcon className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recommended for you</h3>
          <Badge variant="primary">AI Powered</Badge>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {recommendedJobs.map(job => (
            <div key={job.id} className="min-w-[280px] bg-white p-4 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500" onClick={() => handleJobClick(job)}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{job.title}</h4>
                <span className="text-xs font-bold text-green-600">{job.match}% Match</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{job.company} • {job.location}</p>
              <div className="flex gap-2">
                {job.skills.map(s => <span key={s} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <InputField
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <div className="w-full md:w-64">
            <InputField
              placeholder="Location"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              icon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectField label="Job Type" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} options={[{ value: '', label: 'All' }, { value: 'Full-time', label: 'Full-time' }, { value: 'Internship', label: 'Internship' }]} />
              <SelectField label="Experience" value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })} options={[{ value: '', label: 'All' }, { value: 'entry', label: 'Entry Level' }, { value: 'mid', label: 'Mid Level' }]} />
              <InputField label="Min Salary (k)" type="number" value={filters.minSalary} onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })} />
              <InputField label="Min CGPA" type="number" step="0.1" value={filters.minCgpa} onChange={(e) => setFilters({ ...filters, minCgpa: e.target.value })} />
            </div>
            <div className="mt-4 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setFilters({ type: '', experience: '', minSalary: '', minCgpa: '' })}>Clear</Button>
              <Button onClick={handleSearch}>Apply Filters</Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Job Results */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">{loading ? 'Searching...' : `${jobs.length} jobs found`}</p>
          <SelectField options={[{ value: 'recent', label: 'Most Recent' }, { value: 'relevant', label: 'Most Relevant' }, { value: 'salary', label: 'Highest Salary' }]} value={sortBy} onChange={(e) => setSortBy(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2"><p>No jobs found.</p></div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card hover className="cursor-pointer hover:border-emerald-300" onClick={() => handleJobClick(job)}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1" />{job.location}</span>
                        <span className="flex items-center"><BriefcaseIcon className="h-4 w-4 mr-1" />{job.experience}</span>
                        <span className="flex items-center"><CurrencyDollarIcon className="h-4 w-4 mr-1" />{job.salary}</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleToggleSave(job.id); }} className="text-gray-400 hover:text-emerald-600">
                      {savedJobs.includes(job.id) ? <HeartSolidIcon className="h-6 w-6 text-emerald-600" /> : <HeartIcon className="h-6 w-6" />}
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <Modal isOpen={jobDetailModal} onClose={() => setJobDetailModal(false)} title={selectedJob.title} size="lg">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-bold">{selectedJob.company}</h4>
                <p className="text-gray-500">{selectedJob.location}</p>
              </div>
              <Badge variant="primary">{selectedJob.type}</Badge>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm"><span>Salary</span><span className="font-semibold">{selectedJob.salary}</span></div>
              <div className="flex justify-between text-sm"><span>Experience</span><span className="font-semibold">{selectedJob.experience}</span></div>
              <div className="flex justify-between text-sm"><span>Skills</span><span className="font-semibold">{selectedJob.skills.join(', ')}</span></div>
            </div>

            <div><h5 className="font-semibold mb-2">Description</h5><p className="text-sm text-gray-600">{selectedJob.description}</p></div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setJobDetailModal(false)}>Close</Button>
              <Button onClick={handleApply} disabled={applying} className="flex-1 bg-emerald-600">{applying ? 'Applying...' : 'Apply Now'}</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Alert Modal */}
      <Modal isOpen={alertModal} onClose={() => setAlertModal(false)} title="Create Job Alert">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Get notified when new jobs match your preferences.</p>
          <InputField label="Job Role" value={alertPreferences.role} onChange={e => setAlertPreferences({ ...alertPreferences, role: e.target.value })} placeholder="e.g. React Developer" />
          <InputField label="Location" value={alertPreferences.location} onChange={e => setAlertPreferences({ ...alertPreferences, location: e.target.value })} placeholder="e.g. Remote" />
          <SelectField label="Frequency" value={alertPreferences.frequency} onChange={e => setAlertPreferences({ ...alertPreferences, frequency: e.target.value })} options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }]} />
          <div className="flex justify-end pt-4">
            <Button onClick={createJobAlert} className="bg-emerald-600">Create Alert</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CandidateJobs;
