import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/modals/Modal';
import { ClockIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const CandidateApplications = () => {
  const { user } = useAuth();
  const [selectedApp, setSelectedApp] = useState(null);
  const [timelineModal, setTimelineModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs (
            id,
            title,
            employer:profiles(full_name)
          )
        `)
        .eq('candidate_id', user.id);

      if (fetchError) throw fetchError;

      const formattedApps = (data || []).map(app => ({
        id: app.id,
        title: app.job?.title || 'Unknown Job',
        company: app.job?.employer?.full_name || 'Anonymous',
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        appliedDate: new Date(app.created_at).toLocaleDateString(),
        stage: 1, // Mock until real multi-stage tracker is added
        totalStages: 4,
        timeline: [
          { stage: 'Applied', date: new Date(app.created_at).toLocaleDateString(), completed: true },
          { stage: 'Reviewing', date: null, completed: app.status !== 'applied' },
          { stage: 'Interview', date: null, completed: false },
          { stage: 'Decision', date: null, completed: false },
        ]
      }));

      setApplications(formattedApps);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch applications.');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('applications')
        .delete()
        .eq('id', appId);

      if (deleteError) throw deleteError;

      setApplications(prev => prev.filter(app => app.id !== appId));
      toast.success('Application withdrawn successfully');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error('Failed to withdraw application');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl">
        <p>{error}</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'Under Review': { variant: 'warning', icon: ClockIcon, color: 'bg-amber-100 text-amber-700 border-amber-200' },
      'Interview Scheduled': { variant: 'primary', icon: ClockIcon, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      'Shortlisted': { variant: 'info', icon: CheckCircleIcon, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      'Rejected': { variant: 'danger', icon: XCircleIcon, color: 'bg-red-100 text-red-700 border-red-200' },
      'Accepted': { variant: 'success', icon: CheckCircleIcon, color: 'bg-green-100 text-green-700 border-green-200' },
    };
    const config = statusMap[status] || { variant: 'default', icon: ClockIcon, color: 'bg-gray-100 text-gray-700 border-gray-200' };
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="h-4 w-4 mr-1.5" />
        {status}
      </span>
    );
  };

  const handleViewTimeline = (app) => {
    setSelectedApp(app);
    setTimelineModal(true);
  };

  // Calculate stats
  const stats = {
    total: applications.length,
    underReview: applications.filter(app => app.status === 'Under Review').length,
    interviews: applications.filter(app => app.status === 'Interview Scheduled').length,
    rejected: applications.filter(app => app.status === 'Rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">Track your job application status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Applied', value: stats.total, color: 'from-blue-500 to-blue-600', icon: '📝' },
          { label: 'Under Review', value: stats.underReview, color: 'from-amber-500 to-amber-600', icon: '⏳' },
          { label: 'Interviews', value: stats.interviews, color: 'from-emerald-500 to-emerald-600', icon: '🎯' },
          { label: 'Rejected', value: stats.rejected, color: 'from-red-500 to-red-600', icon: '❌' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`text-4xl bg-gradient-to-br ${stat.color} w-14 h-14 rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600">Start applying to jobs to see them here</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="transition-all duration-200 hover:shadow-lg hover:border-emerald-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{app.title}</h3>
                        <p className="text-gray-600 mt-1">{app.company}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>Applied on {app.appliedDate}</span>
                      {app.interviewDate && (
                        <span className="text-emerald-600 font-medium">
                          Interview: {app.interviewDate}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{app.stage} of {app.totalStages} stages</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(app.stage / app.totalStages) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" onClick={() => handleViewTimeline(app)}>
                        View Timeline
                      </Button>
                      {app.status !== 'Rejected' && app.status !== 'Accepted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdraw(app.id)}
                          className="text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Timeline Modal */}
      {selectedApp && (
        <Modal
          isOpen={timelineModal}
          onClose={() => setTimelineModal(false)}
          title={`Application Timeline - ${selectedApp.title}`}
          size="md"
        >
          <div className="space-y-8">
            {selectedApp.timeline.map((stage, index) => {
              const isCompleted = stage.completed;
              const isCurrent = !stage.completed && index > 0 && selectedApp.timeline[index - 1].completed;
              const isPending = !stage.completed && !isCurrent;

              return (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < selectedApp.timeline.length - 1 && (
                    <div
                      className={`absolute left-4 top-10 w-0.5 h-16 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                    ></div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Status dot */}
                    <div
                      className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center border-2 ${isCompleted
                        ? 'bg-emerald-500 border-emerald-500'
                        : isCurrent
                          ? 'bg-blue-500 border-blue-500 animate-pulse'
                          : 'bg-white border-gray-300'
                        }`}
                    >
                      {isCompleted && <CheckCircleIcon className="h-5 w-5 text-white" />}
                      {isCurrent && <ClockIcon className="h-5 w-5 text-white" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h4 className={`font-semibold text-base ${isPending ? 'text-gray-400' : 'text-gray-900'}`}>
                        {stage.stage}
                      </h4>
                      {stage.date && (
                        <p className="text-sm text-gray-500 mt-1">
                          {stage.date}
                        </p>
                      )}
                      {isCurrent && (
                        <Badge variant="primary" size="sm" className="mt-2">
                          Current Stage
                        </Badge>
                      )}
                      {isCompleted && (
                        <p className="text-xs text-emerald-600 mt-1">✓ Completed</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-8 pt-4 border-t">
            <Button variant="outline" onClick={() => setTimelineModal(false)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CandidateApplications;
