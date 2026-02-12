import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  BriefcaseIcon,
  UsersIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  PlusIcon,
  FunnelIcon,
  SparklesIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { STAT_GRADIENTS, THEMES, ANIMATION_VARIANTS } from '../../constants/designSystem';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');
  const [dashboardData, setDashboardData] = useState({
    stats: { activeJobs: 0, totalApplicants: 0, underReview: 0, shortlisted: 0 },
    activeJobsList: [],
    recentApplicants: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      // 1. Fetch Employer's Jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          applications:applications(count)
        `)
        .eq('employer_id', user.id);

      if (jobsError) throw jobsError;

      // 2. Fetch Recent Applications
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(title),
          candidate:profiles(full_name, avatar_url, summary)
        `)
        .in('job_id', (jobs || []).map(j => j.id))
        .order('created_at', { ascending: false })
        .limit(5);

      if (appsError) throw appsError;

      const activeJobs = (jobs || []).filter(j => j.status === 'active');
      const totalApplicants = (jobs || []).reduce((acc, j) => acc + (j.applications?.[0]?.count || 0), 0);

      setDashboardData({
        stats: {
          activeJobs: activeJobs.length,
          totalApplicants: totalApplicants,
          underReview: (applications || []).filter(a => a.status === 'applied').length,
          shortlisted: (applications || []).filter(a => a.status === 'shortlisted').length
        },
        activeJobsList: activeJobs,
        recentApplicants: (applications || []).map(app => ({
          id: app.id,
          name: app.candidate?.full_name || 'Candidate',
          position: app.job?.title,
          status: app.status
        }))
      });
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard data.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
      </div>
    );
  }

  const stats = [
    {
      label: 'Active Jobs',
      value: dashboardData?.stats?.activeJobs || 0,
      icon: BriefcaseIcon,
      gradient: STAT_GRADIENTS.indigo,
      trend: 'up',
      trendValue: '+3'
    },
    {
      label: 'Total Applicants',
      value: dashboardData?.stats?.totalApplicants || 0,
      icon: UsersIcon,
      gradient: STAT_GRADIENTS.green,
      trend: 'up',
      trendValue: '+18%'
    },
    {
      label: 'In Pipeline',
      value: dashboardData?.stats?.underReview || 0,
      icon: FunnelIcon,
      gradient: STAT_GRADIENTS.blue,
      trend: 'up',
      trendValue: '+12'
    },
    {
      label: 'Shortlisted',
      value: dashboardData?.stats?.shortlisted || 0,
      icon: TrophyIcon,
      gradient: STAT_GRADIENTS.purple,
      trend: 'up',
      trendValue: '+3'
    },
  ];

  const activeJobs = dashboardData?.activeJobsList?.map(job => ({
    ...job,
    department: 'Engineering', // Mock
    applicants: 12, // Mock or fetch real
    newApplicants: 2,
    views: 125,
    shortlisted: 1,
    interviewed: 0,
    status: 'Active',
    urgent: false
  })) || [];

  const recentApplicants = dashboardData?.recentApplicants?.map(app => ({
    ...app,
    initials: app.name.split(' ').map(n => n[0]).join(''),
    appliedDate: '1 day ago',
    experience: 'N/A',
    location: 'Unknown',
    matchScore: 85,
    skills: ['React', 'Node'],
  })) || [];

  const hiringPipeline = [
    { stage: 'Applied', count: 456, percentage: 100, color: 'bg-gray-500' },
    { stage: 'Screening', count: 187, percentage: 41, color: 'bg-blue-500' },
    { stage: 'Interview', count: 67, percentage: 15, color: 'bg-indigo-500' },
    { stage: 'Offer', count: 12, percentage: 3, color: 'bg-purple-500' },
    { stage: 'Hired', count: 8, percentage: 2, color: 'bg-green-500' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-700 border-blue-200',
      'Reviewing': 'bg-amber-100 text-amber-700 border-amber-200',
      'Shortlisted': 'bg-purple-100 text-purple-700 border-purple-200',
      'Interviewing': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Offer': 'bg-green-100 text-green-700 border-green-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // ... inside EmployerDashboard component

  // Color Palette Constants
  const COLORS = {
    primary: '#4361ee',
    secondary: '#3f37c9',
    success: '#4cc9f0',
    warning: '#f72585',
    error: '#e63946',
    text: '#212529',
    muted: '#6c757d',
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={ANIMATION_VARIANTS.fadeIn}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#212529]">Recruiter Dashboard</h1>
          <p className="text-lg text-[#6c757d]">Welcome back, Recruiter Hero! 👋</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#4361ee] hover:bg-[#3f37c9] text-white border-none">
            <PlusIcon className="w-5 h-5 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Company Profile Alert */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#4cc9f0]/10 border-l-4 border-[#4cc9f0] rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex-1">
          <div className="font-semibold text-[#212529] mb-2">Company Profile Completion (85%)</div>
          <div className="w-full bg-[#4361ee]/10 rounded-full h-2 mb-2">
            <div className="bg-[#4361ee] h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-sm text-[#6c757d]">Complete your company profile to attract top talent and increase applicant quality.</p>
        </div>
        <Button className="bg-[#4361ee] hover:bg-[#3f37c9] text-white whitespace-nowrap">
          Complete Profile →
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="text-sm text-[#6c757d] mb-1">Active Jobs</div>
          <div className="text-3xl font-bold text-[#4361ee]">{dashboardData?.stats?.activeJobs || 0}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="text-sm text-[#6c757d] mb-1">Total Applicants</div>
          <div className="text-3xl font-bold text-[#4361ee]">{dashboardData?.stats?.totalApplicants || 0}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="text-sm text-[#6c757d] mb-1">Interviews This Week</div>
          <div className="text-3xl font-bold text-[#4361ee]">12</div>
        </div>
      </div>

      {/* New Applicants & Pending Reviews */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* New Applicants - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#212529]">New Applicants</h2>
              <button className="text-[#4361ee] hover:text-[#3f37c9] text-sm font-medium">View All →</button>
            </div>
            <div className="p-6 space-y-4">
              {recentApplicants.map((applicant, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4361ee] to-[#f72585] flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                        {applicant.initials}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                            <p className="text-sm text-[#6c757d]">{applicant.position || 'Software Engineer'}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 my-3 text-sm text-[#6c757d]">
                          <span className="flex items-center gap-1">⭐ {applicant.matchScore}/100 Match</span>
                          <span className="flex items-center gap-1">💼 {applicant.experience || '5 years'} exp</span>
                          <span className="flex items-center gap-1">📍 {applicant.location || 'Remote'}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {applicant.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="px-2 py-1 bg-[#4361ee]/10 text-[#4361ee] text-xs rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                          <span className="px-2 py-1 bg-[#4cc9f0]/10 text-[#4cc9f0] text-xs rounded-full font-medium">Top Candidate</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1">Save</Button>
                      <Button className="flex-1 bg-[#4361ee] hover:bg-[#3f37c9] text-white">Review</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Job Performance Section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#212529]">Job Performance</h2>
              <button className="text-[#4361ee] hover:text-[#3f37c9] text-sm font-medium">View Analytics →</button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeJobs.map((job, idx) => (
                <div key={job.id} className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-[#212529] mb-1 truncate">{job.title}</h4>
                  <p className="text-xs text-[#6c757d] mb-4">{job.department}</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6c757d]">Applicants</span>
                        <span className="font-medium text-[#212529]">{job.applicants}</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#4cc9f0]/20 rounded-full">
                        <div className="h-1.5 bg-[#4cc9f0] rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6c757d]">Interviews</span>
                        <span className="font-medium text-[#212529]">{job.interviewed || 5}</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#f72585]/20 rounded-full">
                        <div className="h-1.5 bg-[#f72585] rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6c757d]">Offers</span>
                        <span className="font-medium text-[#212529]">{Math.floor((job.interviewed || 5) / 3)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#4361ee]/20 rounded-full">
                        <div className="h-1.5 bg-[#4361ee] rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Pending Reviews - 1/3 width */}
        <div className="space-y-6">
          {/* Pending Reviews Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#212529]">Pending Reviews</h2>
              <button className="text-[#4361ee] hover:text-[#3f37c9] text-sm font-medium">View All →</button>
            </div>
            <div className="p-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className={`flex justify-between items-start ${i !== 2 ? 'mb-4 pb-4 border-b border-gray-50' : ''}`}>
                  <div>
                    <h4 className="font-semibold text-sm text-[#212529] mb-1">Candidate #{100 + i}</h4>
                    <p className="text-xs text-[#6c757d]">Applied {i + 1} hours ago</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${i === 0 ? 'bg-[#f72585]/10 text-[#f72585] border-[#f72585]/20' : 'bg-[#4361ee]/10 text-[#4361ee] border-[#4361ee]/20'}`}>
                    {i === 0 ? 'Priority' : 'New'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card (Extra) */}
          <div className="bg-[#4361ee] rounded-xl shadow-md p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
            <p className="text-white/80 text-sm mb-4">Contact our support team for assistance with your job postings.</p>
            <Button className="w-full bg-white text-[#4361ee] hover:bg-gray-50 border-none">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployerDashboard;
