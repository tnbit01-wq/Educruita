import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import TextAreaField from '../../components/forms/TextAreaField';
import Modal from '../../components/modals/Modal';
import AITextEnhancer from '../../components/common/AITextEnhancer';
import { PlusIcon, PencilIcon, EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline';

const EmployerJobs = () => {
  const { user } = useAuth();
  const [createJobModal, setCreateJobModal] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    type: 'Full-time',
    experience: '',
    location: '',
    workMode: 'hybrid',
    minSalary: '',
    maxSalary: '',
    education: 'Any Graduate',
    minCgpa: '',
    description: '',
    skills: [],
    visibility: 'public',
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          applications:applications(count)
        `)
        .eq('employer_id', user.id);

      if (error) throw error;

      const formattedJobs = (data || []).map(j => ({
        ...j,
        applicants: j.applications?.[0]?.count || 0,
        posted: new Date(j.created_at).toLocaleDateString(),
        views: 0, // Placeholder
        status: j.status === 'active' ? 'Active' : 'Closed'
      }));

      setJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const jobData = {
        employer_id: user.id,
        title: formData.title,
        type: formData.type,
        experience_required: formData.experience,
        location: formData.location,
        work_mode: formData.workMode,
        salary_range: formData.minSalary && formData.maxSalary
          ? `$${formData.minSalary}k - $${formData.maxSalary}k`
          : 'Competitive',
        education_required: formData.education,
        min_cgpa: formData.minCgpa ? parseFloat(formData.minCgpa) : null,
        description: formData.description,
        requirements: formData.skills,
        visibility: formData.visibility,
        status: 'active'
      };

      const { error: insertError } = await supabase
        .from('jobs')
        .insert([jobData]);

      if (insertError) throw insertError;

      toast.success('Job posted successfully!');
      setCreateJobModal(false);
      resetForm();
      await fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (deleteError) throw deleteError;

      toast.success('Job deleted successfully');
      await fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Full-time',
      experience: '',
      location: '',
      workMode: 'hybrid',
      minSalary: '',
      maxSalary: '',
      education: 'Any Graduate',
      minCgpa: '',
      description: '',
      skills: [],
      visibility: 'public',
    });
    setSkillInput('');
  };

  const activeJobs = jobs.filter(job => job.status === 'Active');
  const closedJobs = jobs.filter(job => job.status !== 'Active');

  const CreateJobForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Job Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        required
        placeholder="e.g. Senior Software Engineer"
      />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Job Type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          required
          options={[
            { value: 'Full-time', label: 'Full-time' },
            { value: 'Part-time', label: 'Part-time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Internship', label: 'Internship' }
          ]}
        />
        <InputField
          label="Experience Required"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          required
          placeholder="e.g. 3-5 years"
        />
        <SelectField
          label="Education Required"
          name="education"
          value={formData.education}
          onChange={handleInputChange}
          options={[
            { value: 'Any Graduate', label: 'Any Graduate' },
            { value: 'B.Tech/B.E.', label: 'B.Tech / B.E.' },
            { value: 'M.Tech/M.E.', label: 'M.Tech / M.E.' },
            { value: 'BCA/MCA', label: 'BCA / MCA' },
            { value: 'MBA', label: 'MBA' }
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
          placeholder="e.g. San Francisco, CA"
        />
        <SelectField
          label="Work Mode"
          name="workMode"
          value={formData.workMode}
          onChange={handleInputChange}
          required
          options={[
            { value: 'onsite', label: 'On-site' },
            { value: 'remote', label: 'Remote' },
            { value: 'hybrid', label: 'Hybrid' }
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Minimum Salary (k)"
          name="minSalary"
          value={formData.minSalary}
          onChange={handleInputChange}
          type="number"
          placeholder="e.g. 100"
        />
        <InputField
          label="Maximum Salary (k)"
          name="maxSalary"
          value={formData.maxSalary}
          onChange={handleInputChange}
          type="number"
          placeholder="e.g. 150"
        />
      </div>

      <InputField
        label="Minimum CGPA"
        name="minCgpa"
        value={formData.minCgpa}
        onChange={handleInputChange}
        type="number"
        step="0.1"
        placeholder="e.g. 7.0"
        helperText="Minimum CGPA required (out of 10)"
      />

      <TextAreaField
        label="Job Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        required
        rows={6}
        placeholder="Describe the role, responsibilities, and requirements..."
      />
      <AITextEnhancer
        text={formData.description}
        onImprove={(val) => handleInputChange({ target: { name: 'description', value: val } })}
        type="job_description"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
        <div className="flex gap-2">
          <InputField
            placeholder="Add skill (e.g. React)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
          />
          <Button type="button" variant="outline" onClick={handleAddSkill}>Add</Button>
        </div>
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill) => (
              <Badge
                key={skill}
                variant="primary"
                className="cursor-pointer hover:bg-red-100"
                onClick={() => handleRemoveSkill(skill)}
              >
                {skill} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      <SelectField
        label="Visibility"
        name="visibility"
        value={formData.visibility}
        onChange={handleInputChange}
        options={[
          { value: 'public', label: 'Public - Visible to all candidates' },
          { value: 'private', label: 'Private - Only via direct link' }
        ]}
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => { setCreateJobModal(false); resetForm(); }}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-emerald-500 to-teal-600">
          {submitting ? 'Posting...' : 'Post Job'}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600 mt-1">Create and manage your job postings</p>
        </div>
        <Button onClick={() => setCreateJobModal(true)} className="bg-gradient-to-r from-emerald-500 to-teal-600">
          <PlusIcon className="h-5 w-5 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Jobs', value: jobs.length, icon: '💼', color: 'from-blue-500 to-blue-600' },
          { label: 'Active Jobs', value: activeJobs.length, icon: '✅', color: 'from-green-500 to-green-600' },
          { label: 'Closed Jobs', value: closedJobs.length, icon: '📁', color: 'from-gray-500 to-gray-600' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
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

      {/* Tabs */}
      <Card padding="none">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'active'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Active Jobs ({activeJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'closed'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              Closed Jobs ({closedJobs.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {(activeTab === 'active' ? activeJobs : closedJobs).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {activeTab} jobs
              </h3>
              <p className="text-gray-600">
                {activeTab === 'active' ? 'Post your first job to get started' : 'No closed jobs yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'active' ? activeJobs : closedJobs).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {job.location} • {job.type} • {job.experience} • {job.education || 'Any Graduate'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={job.status === 'Active' ? 'success' : 'default'}>
                              {job.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                          <span>Posted {job.posted}</span>
                          <span>•</span>
                          <span>{job.applicants} applicants</span>
                          <span>•</span>
                          <span>{job.views} views</span>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            View Applicants ({job.applicants})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Create Job Modal */}
      <Modal
        isOpen={createJobModal}
        onClose={() => { setCreateJobModal(false); resetForm(); }}
        title="Create New Job Posting"
        size="lg"
      >
        <CreateJobForm />
      </Modal>
    </div>
  );
};

export default EmployerJobs;
