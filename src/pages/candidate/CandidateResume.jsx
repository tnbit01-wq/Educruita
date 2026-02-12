import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/modals/Modal';
import AIResumeScorer from '../../components/common/AIResumeScorer';
import { DocumentTextIcon, EyeIcon, ArrowDownTrayIcon, PlusIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { uploadFile, deleteFile } from '../../lib/storage';
import { supabase } from '../../lib/supabaseClient';

// Resume Management with templates and preview
const CandidateResume = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    if (user) {
      setResumes(user.resumes || []);
    }
  }, [user]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    try {
      setUploading(true);
      const fileName = `${user.id}/resumes/${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('resumes', fileName, file);

      const newResume = {
        id: Date.now(),
        name: file.name,
        url: publicUrl,
        path: fileName,
        uploadedAt: new Date().toLocaleDateString()
      };

      const updatedResumes = [...resumes, newResume];
      await updateUser({ resumes: updatedResumes });
      setResumes(updatedResumes);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resume) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await deleteFile('resumes', resume.path);
      const updatedResumes = resumes.filter(r => r.id !== resume.id);
      await updateUser({ resumes: updatedResumes });
      setResumes(updatedResumes);
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const templates = [
    { id: 'modern', name: 'Modern', preview: '/templates/modern.png' },
    { id: 'classic', name: 'Classic', preview: '/templates/classic.png' },
    { id: 'minimal', name: 'Minimal', preview: '/templates/minimal.png' },
    { id: 'professional', name: 'Professional', preview: '/templates/professional.png' },
  ];

  const resumeVersions = [
    {
      id: 1,
      name: 'Software Engineer Resume',
      template: 'Modern',
      lastUpdated: '2 days ago',
      downloads: 15
    },
    {
      id: 2,
      name: 'Full Stack Developer Resume',
      template: 'Classic',
      lastUpdated: '1 week ago',
      downloads: 8
    },
    {
      id: 3,
      name: 'React Developer Resume',
      template: 'Minimal',
      lastUpdated: '2 weeks ago',
      downloads: 12
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resume Management</h1>
        <p className="text-gray-600 mt-1">Create and manage your professional resumes</p>
      </div>

      <AIResumeScorer />

      {/* Template Selection */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Resume Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedTemplate === template.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="aspect-[3/4] bg-gray-100 rounded mb-3 flex items-center justify-center">
                <DocumentTextIcon className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-center font-medium text-gray-900">{template.name}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={() => setPreviewOpen(true)}>
            <EyeIcon className="h-5 w-5 mr-2" />
            Preview Resume
          </Button>
          <Button variant="outline">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Resume
          </Button>
        </div>
      </Card>

      {/* Resume Versions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
          <div className="flex gap-2">
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleUpload}
            />
            <Button
              onClick={() => document.getElementById('resume-upload').click()}
              disabled={uploading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </Button>
            <Badge variant="info">{resumes.length} versions</Badge>
          </div>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No resumes uploaded yet. Upload one or create a new one above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div key={resume.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{resume.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>Uploaded: {resume.uploadedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(resume.url, '_blank')}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDelete(resume)}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Resume Preview Modal */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Resume Preview"
        size="lg"
      >
        <div className="bg-gray-100 p-8 rounded-lg min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <DocumentTextIcon className="h-32 w-32 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Resume preview will be displayed here</p>
            <p className="text-sm text-gray-500 mt-2">Template: {selectedTemplate}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download PDF
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CandidateResume;
