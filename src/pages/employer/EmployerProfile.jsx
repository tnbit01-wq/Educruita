import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';
import TextAreaField from '../../components/forms/TextAreaField';
import SelectField from '../../components/forms/SelectField';
import Badge from '../../components/common/Badge';
import {
    BuildingOfficeIcon,
    MapPinIcon,
    GlobeAltIcon,
    UsersIcon,
    CalendarIcon,
    PencilIcon,
    CheckCircleIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

const EmployerProfile = () => {
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    const [companyData, setCompanyData] = useState({
        name: '',
        tagline: '',
        industry: 'Information Technology',
        size: '1-10',
        founded: '',
        website: '',
        location: '',
        description: '',
        culture: '',
        benefits: [],
        socialMedia: {
            linkedin: '',
            twitter: '',
            facebook: '',
        },
        verified: false,
    });

    useEffect(() => {
        if (user) {
            setCompanyData({
                name: user.full_name || '',
                tagline: user.tagline || '',
                industry: user.industry || 'Information Technology',
                size: user.company_size || '1-10',
                founded: user.founded_year || '',
                website: user.website_url || '',
                location: user.location || '',
                description: user.description || '',
                culture: user.company_culture || '',
                benefits: user.benefits || [],
                socialMedia: user.social_media || {
                    linkedin: '',
                    twitter: '',
                    facebook: '',
                },
                verified: !!user.verified_date,
                verifiedDate: user.verified_date,
            });
            setFormData({
                name: user.full_name || '',
                tagline: user.tagline || '',
                industry: user.industry || 'Information Technology',
                size: user.company_size || '1-10',
                founded: user.founded_year || '',
                website: user.website_url || '',
                location: user.location || '',
                description: user.description || '',
                culture: user.company_culture || '',
                benefits: user.benefits || [],
                socialMedia: user.social_media || {
                    linkedin: '',
                    twitter: '',
                    facebook: '',
                },
            });
        }
    }, [user]);

    const [formData, setFormData] = useState(companyData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialMediaChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: { ...prev.socialMedia, [platform]: value }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUser({
                full_name: formData.name,
                tagline: formData.tagline,
                industry: formData.industry,
                company_size: formData.size,
                founded_year: formData.founded,
                website_url: formData.website,
                location: formData.location,
                description: formData.description,
                company_culture: formData.culture,
                benefits: formData.benefits,
                social_media: formData.socialMedia
            });
            setCompanyData(formData);
            setEditing(false);
            toast.success('Company profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(companyData);
        setEditing(false);
    };

    const [activeTab, setActiveTab] = useState('profile');

    // Team Data
    const [team, setTeam] = useState([
        { id: 1, name: 'John Doe', email: 'john@techcorp.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@techcorp.com', role: 'Recruiter', status: 'Active' },
    ]);

    // Documents Data
    const [documents, setDocuments] = useState([
        { id: 1, name: 'Incorporation Certificate', date: '2024-01-15', status: 'Verified' },
        { id: 2, name: 'Tax ID Proof', date: '2024-01-15', status: 'Verified' },
    ]);

    const handleInviteMember = () => {
        const email = prompt("Enter email to invite:");
        if (email) {
            setTeam([...team, { id: Date.now(), name: 'Pending User', email, role: 'Recruiter', status: 'Invited' }]);
            toast.success("Invitation sent!");
        }
    };

    const handleUploadDoc = () => {
        toast.success("Document uploaded successfully (mock)!");
        setDocuments([...documents, { id: Date.now(), name: 'New Document.pdf', date: new Date().toISOString().split('T')[0], status: 'Pending' }]);
    };

    // ... existing handleSave, handleInputChange ...

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your company information, team, and verification documents</p>
                </div>
                {activeTab === 'profile' && !editing && (
                    <Button onClick={() => setEditing(true)} className="bg-emerald-600">
                        <PencilIcon className="h-5 w-5 mr-2" />
                        Edit Profile
                    </Button>
                )}
                {activeTab === 'profile' && editing && (
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-emerald-600">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
                {['profile', 'team', 'documents'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'profile' && (
                <>
                    {/* Verification Status */}
                    {companyData.verified && (
                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                            <div className="flex items-center gap-3">
                                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Verified Company</h3>
                                    <p className="text-sm text-gray-600">
                                        Your company was verified on {new Date(companyData.verifiedDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Company Header */}
                    <Card>
                        <div className="flex items-start gap-6">
                            {/* Logo Upload Placeholder */}
                            <div className="relative group cursor-pointer">
                                <div className="h-24 w-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                                    {companyData.name.charAt(0)}
                                </div>
                                {editing && (
                                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs">Upload Logo</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                {editing ? (
                                    <div className="space-y-4">
                                        <InputField label="Company Name" name="name" value={formData.name} onChange={handleInputChange} required />
                                        <InputField label="Tagline" name="tagline" value={formData.tagline} onChange={handleInputChange} placeholder="A brief description of your company" />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-900">{companyData.name}</h2>
                                        <p className="text-gray-600 mt-1">{companyData.tagline}</p>
                                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                                            <span className="flex items-center"><BuildingOfficeIcon className="h-4 w-4 mr-1" />{companyData.industry}</span>
                                            <span className="flex items-center"><UsersIcon className="h-4 w-4 mr-1" />{companyData.size} employees</span>
                                            <span className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1" />Founded {companyData.founded}</span>
                                            <span className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1" />{companyData.location}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Company Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                            {editing ? (
                                <div className="space-y-4">
                                    <SelectField
                                        label="Industry"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: 'Information Technology', label: 'Information Technology' },
                                            { value: 'Finance', label: 'Finance' },
                                            { value: 'Healthcare', label: 'Healthcare' },
                                            { value: 'Education', label: 'Education' },
                                            { value: 'Manufacturing', label: 'Manufacturing' },
                                            { value: 'Retail', label: 'Retail' },
                                        ]}
                                    />
                                    <SelectField
                                        label="Company Size"
                                        name="size"
                                        value={formData.size}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: '1-10', label: '1-10 employees' },
                                            { value: '11-50', label: '11-50 employees' },
                                            { value: '51-200', label: '51-200 employees' },
                                            { value: '201-500', label: '201-500 employees' },
                                            { value: '500-1000', label: '500-1000 employees' },
                                            { value: '1000+', label: '1000+ employees' },
                                        ]}
                                    />
                                    <InputField label="Founded Year" name="founded" value={formData.founded} onChange={handleInputChange} type="number" />
                                    <InputField label="Website" name="website" value={formData.website} onChange={handleInputChange} type="url" />
                                    <InputField label="Location" name="location" value={formData.location} onChange={handleInputChange} />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div><p className="text-sm text-gray-500">Industry</p><p className="font-medium text-gray-900">{companyData.industry}</p></div>
                                    <div><p className="text-sm text-gray-500">Company Size</p><p className="font-medium text-gray-900">{companyData.size} employees</p></div>
                                    <div><p className="text-sm text-gray-500">Founded</p><p className="font-medium text-gray-900">{companyData.founded}</p></div>
                                    <div><p className="text-sm text-gray-500">Website</p><a href={companyData.website} className="font-medium text-emerald-600 hover:underline">{companyData.website}</a></div>
                                    <div><p className="text-sm text-gray-500">Location</p><p className="font-medium text-gray-900">{companyData.location}</p></div>
                                </div>
                            )}
                        </Card>

                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                            {editing ? (
                                <div className="space-y-4">
                                    <InputField label="LinkedIn" value={formData.socialMedia.linkedin} onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)} />
                                    <InputField label="Twitter" value={formData.socialMedia.twitter} onChange={(e) => handleSocialMediaChange('twitter', e.target.value)} />
                                    <InputField label="Facebook" value={formData.socialMedia.facebook} onChange={(e) => handleSocialMediaChange('facebook', e.target.value)} />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div><p className="text-sm text-gray-500">LinkedIn</p><a href={companyData.socialMedia.linkedin} className="font-medium text-emerald-600 hover:underline">{companyData.socialMedia.linkedin}</a></div>
                                    <div><p className="text-sm text-gray-500">Twitter</p><a href={companyData.socialMedia.twitter} className="font-medium text-emerald-600 hover:underline">{companyData.socialMedia.twitter}</a></div>
                                    <div><p className="text-sm text-gray-500">Facebook</p><a href={companyData.socialMedia.facebook} className="font-medium text-emerald-600 hover:underline">{companyData.socialMedia.facebook}</a></div>
                                </div>
                            )}
                        </Card>
                    </div>

                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
                        {editing ? (
                            <TextAreaField label="Company Description" name="description" value={formData.description} onChange={handleInputChange} rows={6} />
                        ) : (
                            <p className="text-gray-700 leading-relaxed">{companyData.description}</p>
                        )}
                    </Card>
                </>
            )}

            {activeTab === 'team' && (
                <Card title="Team Management">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-gray-600">Manage recruiters and admins for your company</p>
                        <Button onClick={handleInviteMember}><PlusIcon className="h-5 w-5 mr-2" /> Invite Member</Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {team.map(member => (
                                    <tr key={member.id}>
                                        <td className="px-6 py-4 font-medium">{member.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{member.email}</td>
                                        <td className="px-6 py-4 text-gray-500">{member.role}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>{member.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-red-600 hover:text-red-800 font-medium text-sm">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {activeTab === 'documents' && (
                <Card title="Company Documents">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-gray-600">Upload legal documents for verification</p>
                        <Button onClick={handleUploadDoc} variant="outline"><PlusIcon className="h-5 w-5 mr-2" /> Upload Document</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.map(doc => (
                            <div key={doc.id} className="border p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center mr-3 text-gray-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{doc.name}</p>
                                        <p className="text-sm text-gray-500">{doc.date}</p>
                                    </div>
                                </div>
                                <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'}>{doc.status}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default EmployerProfile;
