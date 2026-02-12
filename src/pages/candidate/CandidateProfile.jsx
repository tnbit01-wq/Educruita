import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import TextAreaField from '../../components/forms/TextAreaField';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import AITextEnhancer from '../../components/common/AITextEnhancer';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
  FolderIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../contexts/ToastContext';
import { uploadFile } from '../../lib/storage';
import { CameraIcon } from '@heroicons/react/24/outline';

// Candidate Profile Management
const CandidateProfile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'male',
    linkedin_url: '',
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: []
  });

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: PencilIcon },
    { id: 'education', label: 'Education', icon: AcademicCapIcon },
    { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
    { id: 'skills', label: 'Skills', icon: WrenchScrewdriverIcon },
    { id: 'projects', label: 'Projects', icon: FolderIcon },
    { id: 'certifications', label: 'Certifications', icon: TrophyIcon },
  ];

  // Calculate Profile Strength
  const calculateStrength = () => {
    let score = 0;
    if (profile.fullName) score += 10;
    if (profile.email) score += 10;
    if (profile.summary) score += 10;
    if (profile.education.length > 0) score += 20;
    if (profile.experience.length > 0) score += 20;
    if (profile.skills.length > 0) score += 15;
    if (profile.projects.length > 0) score += 10;
    if (profile.certifications.length > 0) score += 5;
    return Math.min(score, 100);
  };
  const profileStrength = calculateStrength();

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || 'male',
        linkedin_url: user.linkedin_url || '',
        summary: user.summary || '',
        education: user.education || [],
        experience: user.experience || [],
        skills: user.skills || [],
        projects: user.projects || [],
        certifications: user.certifications || []
      });
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({
        full_name: profile.fullName,
        phone: profile.phone,
        dob: profile.dob,
        gender: profile.gender,
        linkedin_url: profile.linkedin_url,
        summary: profile.summary,
        education: profile.education,
        experience: profile.experience,
        skills: profile.skills,
        projects: profile.projects,
        certifications: profile.certifications
      });
      toast.success('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const updateProfileField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('avatars', fileName, file);

      await updateUser({ avatar_url: publicUrl });
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setSaving(false);
    }
  };

  // --- Sub-components (Tabs) ---

  const PersonalInfoTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="text-gray-400 font-bold text-2xl">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
            <CameraIcon className="h-8 w-8" />
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
          <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
          <button
            type="button"
            onClick={() => document.querySelector('input[type="file"]').click()}
            className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-500"
          >
            Upload new photo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          value={profile.fullName || ''}
          onChange={(e) => updateProfileField('fullName', e.target.value)}
          required
        />
        <InputField
          label="Email"
          type="email"
          value={profile.email || ''}
          onChange={(e) => updateProfileField('email', e.target.value)}
          required
          disabled
        />
        <InputField
          label="Phone"
          type="tel"
          value={profile.phone || ''}
          onChange={(e) => updateProfileField('phone', e.target.value)}
          required
        />
        <InputField
          label="Date of Birth"
          type="date"
          value={profile.dob || ''}
          onChange={(e) => updateProfileField('dob', e.target.value)}
        />
        <InputField
          label="Preferred Role"
          placeholder="e.g. Frontend Developer"
          value={profile.preferredRole || ''}
          onChange={(e) => updateProfileField('preferredRole', e.target.value)}
        />
        <InputField
          label="Preferred Location"
          placeholder="e.g. Bangalore, Remote"
          value={profile.preferredLocation || ''}
          onChange={(e) => updateProfileField('preferredLocation', e.target.value)}
        />
      </div>
      <TextAreaField
        label="Professional Summary"
        rows={4}
        value={profile.summary || ''}
        placeholder="Briefly describe your professional background and goals..."
        onChange={(e) => updateProfileField('summary', e.target.value)}
      />
      <AITextEnhancer
        text={profile.summary}
        onImprove={(val) => updateProfileField('summary', val)}
        type="profile_summary"
      />
    </div>
  );

  const EducationTab = () => {
    const items = profile.education || [];
    const handleUpdate = (index, field, value) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateProfileField('education', newItems);
    };
    return (
      <div className="space-y-6">
        {items.map((edu, index) => (
          <Card key={index} padding="md" className="border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Education #{index + 1}</h3>
              <button onClick={() => updateProfileField('education', items.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Degree" value={edu.degree} onChange={(e) => handleUpdate(index, 'degree', e.target.value)} />
              <InputField label="Field of Study" value={edu.field} onChange={(e) => handleUpdate(index, 'field', e.target.value)} />
              <InputField label="Institution" value={edu.institution} onChange={(e) => handleUpdate(index, 'institution', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <InputField label="Year" value={edu.year} onChange={(e) => handleUpdate(index, 'year', e.target.value)} />
                <InputField label="CGPA (Max 10)" type="number" step="0.1" max="10" value={edu.cgpa} onChange={(e) => handleUpdate(index, 'cgpa', e.target.value)} />
              </div>
            </div>
          </Card>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => updateProfileField('education', [...items, {}])}><PlusIcon className="h-5 w-5 mr-2" /> Add Education</Button>
      </div>
    );
  };

  const ExperienceTab = () => {
    const items = profile.experience || [];
    const handleUpdate = (index, field, value) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateProfileField('experience', newItems);
    };
    return (
      <div className="space-y-6">
        {items.map((exp, index) => (
          <Card key={index} padding="md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Experience #{index + 1}</h3>
              <button onClick={() => updateProfileField('experience', items.filter((_, i) => i !== index))} className="text-red-500"><TrashIcon className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Job Title" value={exp.title} onChange={(e) => handleUpdate(index, 'title', e.target.value)} />
              <InputField label="Company" value={exp.company} onChange={(e) => handleUpdate(index, 'company', e.target.value)} />
              <InputField label="From" type="date" value={exp.from} onChange={(e) => handleUpdate(index, 'from', e.target.value)} />
              <InputField label="To" type="date" value={exp.to} onChange={(e) => handleUpdate(index, 'to', e.target.value)} disabled={exp.current} />
            </div>
            <div className="mt-2 flex items-center mb-2">
              <input type="checkbox" checked={exp.current} onChange={(e) => handleUpdate(index, 'current', e.target.checked)} className="mr-2" /> <label>Currently Here</label>
            </div>
            <TextAreaField label="Description" value={exp.description} onChange={(e) => handleUpdate(index, 'description', e.target.value)} />
            <AITextEnhancer
              text={exp.description}
              onImprove={(val) => handleUpdate(index, 'description', val)}
              type="experience_description"
            />
          </Card>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => updateProfileField('experience', [...items, {}])}><PlusIcon className="h-5 w-5 mr-2" /> Add Experience</Button>
      </div>
    );
  };

  const SkillsTab = () => {
    const items = profile.skills || [];
    const [newItem, setNewItem] = useState('');
    const suggestions = ['Python', 'Java', 'C++', 'SQL', 'AWS', 'Docker', 'Git', 'Machine Learning'];

    return (
      <div className="space-y-6">
        <Card padding="md">
          <h3 className="font-semibold mb-4">Your Skills</h3>
          <div className="space-y-4">
            {items.map((skill, index) => (
              <div key={index} className="flex items-center gap-4 border-b pb-2 last:border-0">
                <span className="font-medium w-32">{skill.name}</span>
                <input type="range" className="flex-1" min="0" max="100" value={skill.proficiency} onChange={(e) => {
                  const newSkills = [...items];
                  newSkills[index].proficiency = parseInt(e.target.value);
                  updateProfileField('skills', newSkills);
                }} />
                <span className="text-sm text-gray-500 w-12">{skill.proficiency}%</span>
                <button onClick={() => updateProfileField('skills', items.filter((_, i) => i !== index))} className="text-red-500"><TrashIcon className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">Add Skill</label>
            <div className="flex gap-2 mt-1">
              <input className="flex-1 border rounded px-3 py-2" placeholder="e.g. TypeScript" value={newItem} onChange={e => setNewItem(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter' && newItem) {
                    updateProfileField('skills', [...items, { name: newItem, proficiency: 50 }]);
                    setNewItem('');
                  }
                }}
              />
              <Button onClick={() => {
                if (newItem) {
                  updateProfileField('skills', [...items, { name: newItem, proficiency: 50 }]);
                  setNewItem('');
                }
              }}>Add</Button>
            </div>

            {/* Auto Suggestions */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Suggested based on your role:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.filter(s => !items.find(i => i.name === s)).map(s => (
                  <button key={s} onClick={() => updateProfileField('skills', [...items, { name: s, proficiency: 50 }])}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-100 transition">
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const ProjectsTab = () => {
    const items = profile.projects || [];
    const handleUpdate = (index, field, value) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateProfileField('projects', newItems);
    };

    return (
      <div className="space-y-6">
        {items.map((proj, index) => (
          <Card key={index} padding="md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Project #{index + 1}</h3>
              <button onClick={() => updateProfileField('projects', items.filter((_, i) => i !== index))} className="text-red-500"><TrashIcon className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <InputField label="Project Name" value={proj.name} onChange={e => handleUpdate(index, 'name', e.target.value)} />
              <TextAreaField label="Description" value={proj.description} onChange={e => handleUpdate(index, 'description', e.target.value)} />
              <AITextEnhancer
                text={proj.description}
                onImprove={(val) => handleUpdate(index, 'description', val)}
                type="project_description"
              />
              <InputField label="Technologies Used (comma separated)" value={proj.technologies} onChange={e => handleUpdate(index, 'technologies', e.target.value)} placeholder="React, Node, MongoDB" />
              <InputField label="Link (GitHub/Demo)" value={proj.link} onChange={e => handleUpdate(index, 'link', e.target.value)} />
            </div>
          </Card>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => updateProfileField('projects', [...items, {}])}><PlusIcon className="h-5 w-5 mr-2" /> Add Project</Button>
      </div>
    );
  };

  const CertificationsTab = () => {
    const items = profile.certifications || [];
    const handleUpdate = (index, field, value) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateProfileField('certifications', newItems);
    };

    return (
      <div className="space-y-6">
        {items.map((cert, index) => (
          <Card key={index} padding="md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Certification #{index + 1}</h3>
              <button onClick={() => updateProfileField('certifications', items.filter((_, i) => i !== index))} className="text-red-500"><TrashIcon className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Certification Name" value={cert.name} onChange={e => handleUpdate(index, 'name', e.target.value)} />
              <InputField label="Issuing Authority" value={cert.issuer} onChange={e => handleUpdate(index, 'issuer', e.target.value)} />
              <InputField label="Date Issued" type="date" value={cert.date} onChange={e => handleUpdate(index, 'date', e.target.value)} />
              <InputField label="Credential URL" value={cert.url} onChange={e => handleUpdate(index, 'url', e.target.value)} />
            </div>
          </Card>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => updateProfileField('certifications', [...items, {}])}><PlusIcon className="h-5 w-5 mr-2" /> Add Certification</Button>
      </div>
    );
  };

  // --- Main Render ---
  if (loading) {
    return <div className="flex h-96 items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Strength */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Complete your profile to get better job recommendations</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg className="h-full w-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4"></circle>
              <circle cx="24" cy="24" r="20" fill="none" stroke={profileStrength > 80 ? "#059669" : "#3b82f6"} strokeWidth="4"
                strokeDasharray="125" strokeDashoffset={125 - (125 * profileStrength) / 100}></circle>
            </svg>
            <span className="absolute text-xs font-bold">{profileStrength}%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Profile Strength</p>
            <p className="text-xs text-gray-500">{profileStrength < 100 ? 'Add more details to reach 100%' : 'Excellent!'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <Card padding="none" className="overflow-hidden">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-l-4 transition-all w-full text-left whitespace-nowrap
                                ${activeTab === tab.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50'}
                            `}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <Card>
            {activeTab === 'personal' && <PersonalInfoTab />}
            {activeTab === 'education' && <EducationTab />}
            {activeTab === 'experience' && <ExperienceTab />}
            {activeTab === 'skills' && <SkillsTab />}
            {activeTab === 'projects' && <ProjectsTab />}
            {activeTab === 'certifications' && <CertificationsTab />}

            <div className="pt-6 border-t mt-6 flex justify-end">
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
