import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const EmployerProfileForm = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select(`
                        *,
                        employer:employer_profiles(*)
                    `)
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                reset({
                    company_name: profile.employer?.company_name || profile.full_name || '',
                    contact_person_name: profile.employer?.contact_person_name || '',
                    contact_email: profile.employer?.contact_email || profile.email || '',
                    contact_phone: profile.employer?.contact_phone || profile.phone || '',
                    company_website: profile.employer?.company_website || profile.website_url || '',

                    industry_sector: profile.employer?.industry_sector || '',
                    company_size: profile.employer?.company_size || '1-10',
                    company_type: profile.employer?.company_type || 'Startup',
                    founded_year: profile.employer?.founded_year || '',
                    headquarters_location: profile.employer?.headquarters_location || profile.location || '',

                    company_description: profile.employer?.company_description || '',
                    mission_statement: profile.employer?.mission_statement || '',

                    benefits: profile.employer?.benefits?.join(', ') || '',
                    branch_locations: profile.employer?.branch_locations?.join(', ') || '',

                    linkedin_url: profile.social_media_links?.linkedin || '',
                    twitter_url: profile.social_media_links?.twitter || '',
                    facebook_url: profile.social_media_links?.facebook || '',

                    logo_url: profile.employer?.logo_url || profile.avatar_url || ''
                });
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            await supabase
                .from('profiles')
                .update({
                    full_name: data.company_name,
                    phone: data.contact_phone,
                    website_url: data.company_website,
                    location: data.headquarters_location,
                    avatar_url: data.logo_url,
                    updated_at: new Date()
                })
                .eq('id', user.id);

            const employerData = {
                id: user.id,
                company_name: data.company_name,
                contact_person_name: data.contact_person_name,
                contact_email: data.contact_email,
                contact_phone: data.contact_phone,
                company_website: data.company_website,
                industry_sector: data.industry_sector,
                company_size: data.company_size,
                company_type: data.company_type,
                founded_year: parseInt(data.founded_year) || null,
                headquarters_location: data.headquarters_location,
                branch_locations: data.branch_locations ? data.branch_locations.split(',').map(s => s.trim()).filter(Boolean) : [],
                company_description: data.company_description,
                mission_statement: data.mission_statement,
                benefits: data.benefits ? data.benefits.split(',').map(s => s.trim()).filter(Boolean) : [],
                social_media_links: {
                    linkedin: data.linkedin_url,
                    twitter: data.twitter_url,
                    facebook: data.facebook_url
                },
                logo_url: data.logo_url,
                updated_at: new Date()
            };

            const { error } = await supabase.from('employer_profiles').upsert(employerData, { onConflict: 'id' });
            if (error) throw error;

            toast.success('Company profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm p-3 bg-white text-gray-900 placeholder-gray-400 transition-all";
    const labelClass = "block text-sm font-semibold text-gray-800 mb-1";
    const helperClass = "text-xs text-gray-600 mt-1";

    if (loading && !user) return <div className="p-4 text-center text-gray-700">Loading...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-6">
            <Card title="Company Information">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input {...register('company_name')} className={inputClass} placeholder="Acme Corporation" />
                        <p className={helperClass}>Your company's legal name</p>
                    </div>
                    <div>
                        <label className={labelClass}>Industry Sector</label>
                        <input {...register('industry_sector')} className={inputClass} placeholder="Technology, Healthcare, Finance..." />
                        <p className={helperClass}>What industry do you operate in?</p>
                    </div>
                    <div>
                        <label className={labelClass}>Company Size</label>
                        <select {...register('company_size')} className={inputClass}>
                            <option value="1-10">1-10 Employees</option>
                            <option value="11-50">11-50 Employees</option>
                            <option value="51-200">51-200 Employees</option>
                            <option value="201-500">201-500 Employees</option>
                            <option value="500+">500+ Employees</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Company Type</label>
                        <select {...register('company_type')} className={inputClass}>
                            <option value="Startup">Startup</option>
                            <option value="SME">SME</option>
                            <option value="Corporation">Corporation</option>
                            <option value="Non-Profit">Non-Profit</option>
                            <option value="Government">Government</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Founded Year</label>
                        <input type="number" {...register('founded_year')} className={inputClass} placeholder="2010" />
                        <p className={helperClass}>When was your company established?</p>
                    </div>
                    <div>
                        <label className={labelClass}>Headquarters Location</label>
                        <input {...register('headquarters_location')} className={inputClass} placeholder="San Francisco, CA" />
                        <p className={helperClass}>Main office location</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Branch Locations (comma separated)</label>
                        <input {...register('branch_locations')} className={inputClass} placeholder="New York, London, Tokyo, Sydney" />
                        <p className={helperClass}>Other office locations</p>
                    </div>
                </div>
            </Card>

            <Card title="Contact Details">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Contact Person Name</label>
                        <input {...register('contact_person_name')} className={inputClass} placeholder="Jane Smith" />
                        <p className={helperClass}>Primary HR contact</p>
                    </div>
                    <div>
                        <label className={labelClass}>Contact Email</label>
                        <input {...register('contact_email')} className={inputClass} placeholder="hr@acme.com" />
                        <p className={helperClass}>Email for recruitment inquiries</p>
                    </div>
                    <div>
                        <label className={labelClass}>Contact Phone</label>
                        <input {...register('contact_phone')} className={inputClass} placeholder="+1 555 000 0000" />
                        <p className={helperClass}>Include country code</p>
                    </div>
                    <div>
                        <label className={labelClass}>Company Website</label>
                        <input {...register('company_website')} className={inputClass} placeholder="https://acme.com" />
                        <p className={helperClass}>Your company's main website</p>
                    </div>
                </div>
            </Card>

            <Card title="Company Overview">
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Company Description</label>
                        <textarea {...register('company_description')} className={inputClass} rows={4} placeholder="Tell us about your company, what you do, your products/services..." />
                        <p className={helperClass}>This appears on your company profile</p>
                    </div>
                    <div>
                        <label className={labelClass}>Mission Statement</label>
                        <textarea {...register('mission_statement')} className={inputClass} rows={2} placeholder="Our mission is to..." />
                        <p className={helperClass}>What drives your organization?</p>
                    </div>
                    <div>
                        <label className={labelClass}>Benefits / Perks (comma separated)</label>
                        <textarea {...register('benefits')} className={inputClass} rows={2} placeholder="Remote Work, Health Insurance, 401k, Flexible Hours, Professional Development..." />
                        <p className={helperClass}>Highlight what makes your company great</p>
                    </div>
                </div>
            </Card>

            <Card title="Social Media & Branding">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>LinkedIn URL</label>
                        <input {...register('linkedin_url')} className={inputClass} placeholder="https://linkedin.com/company/acme" />
                    </div>
                    <div>
                        <label className={labelClass}>Twitter URL</label>
                        <input {...register('twitter_url')} className={inputClass} placeholder="https://twitter.com/acme" />
                    </div>
                    <div>
                        <label className={labelClass}>Facebook URL</label>
                        <input {...register('facebook_url')} className={inputClass} placeholder="https://facebook.com/acme" />
                    </div>
                    <div>
                        <label className={labelClass}>Logo URL</label>
                        <input {...register('logo_url')} className={inputClass} placeholder="https://example.com/logo.png" />
                        <p className={helperClass}>Link to your company logo image</p>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="px-8">
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating Profile...
                        </span>
                    ) : 'Update Company Profile'}
                </Button>
            </div>
        </form>
    );
};

export default EmployerProfileForm;
