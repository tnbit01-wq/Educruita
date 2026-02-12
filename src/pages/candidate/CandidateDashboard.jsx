import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import mockApi from '../../services/mockApi';
import { useToast } from '../../contexts/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import {
  BriefcaseIcon,
  ClockIcon, // Ensure ClockIcon is imported
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HeartIcon,
  BookmarkIcon,
  BellIcon,
  SparklesIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { STAT_GRADIENTS, THEMES, ANIMATION_VARIANTS } from '../../constants/designSystem';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    stats: { applied: 0, interviews: 0, views: 0 },
    recommendedJobs: [],
    recentApplications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const profileCompletion = user ? 85 : 0; // Simple logic for now

  useEffect(() => {
    if (user) {
      fetchDashboard();
    } else {
      setLoading(false); // If no user, stop loading and show empty state or login prompt
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      // 1. Fetch Candidate's Applications
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(
            id,
            title,
            location,
            salary_range,
            type,
            employer:profiles(full_name)
          )
        `)
        .eq('candidate_id', user.id);

      if (appsError) throw appsError;

      // 2. Fetch Recommended Jobs (just latest Active jobs for now)
      const { data: recJobs, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:profiles(full_name)
        `)
        .eq('status', 'active')
        .limit(3);

      if (jobsError) throw jobsError;

      const formattedApps = (apps || []).map(app => ({
        id: app.id,
        title: app.job?.title,
        company: app.job?.employer?.full_name,
        logo: (app.job?.employer?.full_name || 'C').substring(0, 2).toUpperCase(),
        appliedDate: new Date(app.created_at).toLocaleDateString(),
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        stage: 1,
        totalStages: 4
      }));

      const formattedJobs = (recJobs || []).map(j => ({
        id: j.id,
        title: j.title,
        company: j.employer?.full_name,
        location: j.location,
        salary: j.salary_range,
        type: j.type || 'Full-time',
        skills: j.requirements || [],
        match: 95,
        posted: new Date(j.created_at).toLocaleDateString(),
        logo: (j.employer?.full_name || 'C').substring(0, 2).toUpperCase(),
        applicants: 10 // Mock until real count logic
      }));

      setDashboardData({
        stats: {
          applied: apps?.length || 0,
          interviews: apps?.filter(a => a.status === 'interviewing').length || 0,
          views: 45 // Mock
        },
        recommendedJobs: formattedJobs,
        recentApplications: formattedApps.slice(0, 4)
      });
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard data.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Transform backend stats to UI format
  const stats = dashboardData ? [
    {
      label: 'Total Applications',
      value: dashboardData.stats.applied,
      icon: BriefcaseIcon,
      gradient: STAT_GRADIENTS.blue,
      trend: 'up',
      trendValue: '+12%'
    },
    {
      label: 'In Progress',
      value: dashboardData.stats.interviews, // Using interviews as proxy for in-progress or could be calculated
      icon: ClockIcon,
      gradient: STAT_GRADIENTS.yellow,
      trend: 'up',
      trendValue: '+3'
    },
    {
      label: 'Interviews',
      value: dashboardData.stats.interviews,
      icon: CheckCircleIcon,
      gradient: STAT_GRADIENTS.green,
      trend: 'up',
      trendValue: '+2'
    },
    {
      label: 'Profile Views',
      value: dashboardData.stats.views,
      icon: SparklesIcon,
      gradient: STAT_GRADIENTS.purple,
      trend: 'up',
      trendValue: '+45%'
    },
  ] : [];

  const recommendedJobs = dashboardData?.recommendedJobs?.map(job => ({
    ...job,
    logo: job.company.substring(0, 2).toUpperCase(), // Generate simple logo
    locationType: 'Hybrid', // Mock default
    match: 95, // Mock default
    urgent: false // Mock default
  })) || [];

  const recentApplications = dashboardData?.recentApplications || [];

  // Mock activity feed (keep static for now as backend doesn't have it yet)
  const activityFeed = [
    {
      id: 1,
      type: 'view',
      message: 'Your profile was viewed by',
      company: 'Tech Innovators Inc',
      time: '2 hours ago',
      icon: SparklesIcon,
    },
    {
      id: 2,
      type: 'match',
      message: 'New job match:',
      company: 'Senior React Developer',
      time: '5 hours ago',
      icon: FireIcon,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Under Review': 'bg-amber-100 text-amber-700 border-amber-200',
      'Interview Scheduled': 'bg-blue-100 text-blue-700 border-blue-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200',
      'Accepted': 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const toggleSaveJob = async (jobId) => {
    try {
      const result = await mockApi.toggleSaveJob(jobId);
      setSavedJobs(prev =>
        prev.includes(jobId)
          ? prev.filter(id => id !== jobId)
          : [...prev, jobId]
      );
      toast.success(result.saved ? 'Job saved successfully' : 'Job removed from saved');
    } catch (error) {
      console.error('Error toggling save job:', error);
      toast.error('Failed to update saved jobs');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
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

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={ANIMATION_VARIANTS.fadeIn}
      className="space-y-6"
    >
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Animated Background Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full -ml-36 -mb-36"
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
              <p className="text-emerald-100 text-lg">Ready to take the next step in your career journey?</p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/30 cursor-pointer"
              >
                <FireIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">{recommendedJobs.length} New Matches</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/30 cursor-pointer"
              >
                <BellIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">{dashboardData.stats.interviews} Interviews</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile</h3>
              <p className="text-sm text-gray-600">Stand out to employers - get 3x more interview calls!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="text-lg px-4 py-1.5 font-bold">{profileCompletion}%</Badge>
          </div>
        </div>
        <ProgressBar percentage={profileCompletion} color="orange" className="h-3 mb-4" />
        <div className="flex gap-3 flex-wrap">
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg">
            Complete Now →
          </Button>
          <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
            Skip for Now
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={ANIMATION_VARIANTS.staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Jobs - 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🎯 Perfect Matches</h2>
              <p className="text-sm text-gray-600 mt-1">Jobs tailored to your skills and preferences</p>
            </div>
            <Button variant="outline" size="sm">
              View All →
            </Button>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {recommendedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="group bg-white p-6 border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Urgent Badge */}
                {job.urgent && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
                      <FireIcon className="w-3 h-3" />
                      Urgent
                    </span>
                  </div>
                )}

                <div className="flex gap-4">
                  {/* Company Logo */}
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xl">{job.logo}</span>
                  </div>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {savedJobs.includes(job.id) ? (
                          <HeartSolidIcon className="w-6 h-6 text-red-500" />
                        ) : (
                          <HeartIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Job Meta */}
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        {job.salary}
                      </span>
                      <Badge variant="primary" size="sm">{job.type}</Badge>
                      <Badge variant="secondary" size="sm">{job.locationType}</Badge>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {job.skills.map(skill => (
                        <span key={skill} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Posted {job.posted}</span>
                        <span>•</span>
                        <span>{job.applicants} applicants</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Match Score */}
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
                          <ArrowTrendingUpIcon className="h-4 w-4" />
                          <span className="text-sm font-semibold">{job.match}% Match</span>
                        </div>

                        {/* Apply Button */}
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg"
                        >
                          Quick Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>

            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Company Logo */}
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                      {app.logo}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-0.5 truncate">{app.title}</h4>
                      <p className="text-xs text-gray-600">{app.company}</p>
                      <p className="text-xs text-gray-500 mt-1">{app.appliedDate}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`text-xs font-medium px-2.5 py-1 rounded-md border inline-block ${getStatusColor(app.status)}`}>
                    {app.status}
                  </div>

                  {/* Progress Bar */}
                  {app.status !== 'Rejected' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Stage {app.stage} of {app.totalStages}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${(app.stage / app.totalStages) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Interview Date */}
                  {app.interviewDate && (
                    <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                      📅 Interview: {app.interviewDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>

            <div className="space-y-4">
              {activityFeed.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">
                        {activity.message}{' '}
                        <span className="font-semibold text-gray-900">{activity.company}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateDashboard;
