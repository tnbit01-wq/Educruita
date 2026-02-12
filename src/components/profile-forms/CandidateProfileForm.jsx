import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const CandidateProfileForm = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);

    const { register, control, handleSubmit, reset } = useForm({
        defaultValues: {
            certifications: [{ name: '', issuer: '', date: '' }],
            education_background: [{ institution: '', degree: '', field: '', year: '' }]
        }
    });

    const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
        control,
        name: "certifications"
    });

    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
        control,
        name: "education_background"
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select(`
                    *,
                    candidate:candidate_profiles(*)
                `)
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                reset({
                    // Base
                    full_name: profile.full_name,
                    email: profile.email,
                    phone: profile.phone,
                    linkedin_url: profile.linkedin_url,

                    // Candidate
                    current_employment_status: profile.candidate?.current_employment_status || 'Employed',
                    current_position: profile.candidate?.current_position || '',
                    years_of_experience: profile.candidate?.years_of_experience || '',
                    salary_expectations: profile.candidate?.salary_expectations || '',
                    availability_start_date: profile.candidate?.availability_start_date || '',
                    work_authorization_status: profile.candidate?.work_authorization_status || '',
                    willing_to_relocate: profile.candidate?.willing_to_relocate || false,
                    remote_work_preference: profile.candidate?.remote_work_preference || false,
                    portfolio_link: profile.candidate?.portfolio_link || '',
                    github_profile: profile.candidate?.github_profile || '',

                    target_job_titles: profile.candidate?.target_job_titles?.join(', ') || '',
                    industry_preferences: profile.candidate?.industry_preferences?.join(', ') || '',
                    skills: profile.candidate?.skills?.join(', ') || '',

                    certifications: profile.candidate?.certifications?.length ? profile.candidate.certifications : [{ name: '', issuer: '', date: '' }],
                    education_background: profile.candidate?.education_background?.length ? profile.candidate.education_background : [{ institution: '', degree: '', field: '', year: '' }]
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

            // Update Base
            await supabase
                .from('profiles')
                .update({
                    full_name: data.full_name,
                    phone: data.phone,
                    linkedin_url: data.linkedin_url,
                    updated_at: new Date()
                })
                .eq('id', user.id);

            // Update Candidate
            const candidateData = {
                id: user.id,
                current_employment_status: data.current_employment_status,
                current_position: data.current_position,
                years_of_experience: parseInt(data.years_of_experience) || 0,
                salary_expectations: data.salary_expectations,
                availability_start_date: data.availability_start_date || null,
                work_authorization_status: data.work_authorization_status,
                willing_to_relocate: data.willing_to_relocate,
                remote_work_preference: data.remote_work_preference,
                portfolio_link: data.portfolio_link,
                github_profile: data.github_profile,

                target_job_titles: data.target_job_titles.split(',').map(s => s.trim()).filter(Boolean),
                industry_preferences: data.industry_preferences.split(',').map(s => s.trim()).filter(Boolean),
                skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),

                certifications: data.certifications.filter(c => c.name),
                education_background: data.education_background.filter(e => e.institution),

                updated_at: new Date()
            };

            const { error } = await supabase.from('candidate_profiles').upsert(candidateData, { onConflict: 'id' });
            if (error) throw error;

            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border";
    const labelClass = "block text-sm font-medium text-gray-700";

    if (loading && !user) return <div className="p-4 text-center">Loading...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-6">
            <Card title="Professional Summary">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Full Name</label>
                        <input {...register('full_name')} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Current Position</label>
                        <input {...register('current_position')} className={inputClass} placeholder="Senior Developer" />
                    </div>
                    <div>
                        <label className={labelClass}>Employment Status</label>
                        <select {...register('current_employment_status')} className={inputClass}>
                            <option value="Employed">Employed</option>
                            <option value="Unemployed">Unemployed</option>
                            <option value="Freelancer">Freelancer</option>
                            <option value="Student">Student</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Years of Experience</label>
                        <input type="number" {...register('years_of_experience')} className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Skills (comma separated)</label>
                        <textarea {...register('skills')} className={inputClass} rows={3} placeholder="React, Node.js, Project Management..." />
                    </div>
                </div>
            </Card>

            <Card title="Job Preferences">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Target Job Titles</label>
                        <input {...register('target_job_titles')} className={inputClass} placeholder="Full Stack Developer, Tech Lead" />
                    </div>
                    <div>
                        <label className={labelClass}>Industry Preferences</label>
                        <input {...register('industry_preferences')} className={inputClass} placeholder="Fintech, Healthcare, EdTech" />
                    </div>
                    <div>
                        <label className={labelClass}>Salary Expectations</label>
                        <input {...register('salary_expectations')} className={inputClass} placeholder="$100k - $120k / year" />
                    </div>
                    <div>
                        <label className={labelClass}>Availability Start Date</label>
                        <input type="date" {...register('availability_start_date')} className={inputClass} />
                    </div>
                    <div className="flex items-center gap-4 py-2">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" {...register('willing_to_relocate')} className="rounded text-emerald-600 focus:ring-emerald-500" />
                            <span className="text-sm">Willing to Relocate</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" {...register('remote_work_preference')} className="rounded text-emerald-600 focus:ring-emerald-500" />
                            <span className="text-sm">Prefer Remote Work</span>
                        </label>
                    </div>
                </div>
            </Card>

            <Card title="Education">
                <div className="space-y-4">
                    {eduFields.map((item, index) => (
                        <div key={item.id} className="grid md:grid-cols-4 gap-4 border-b pb-4 items-end">
                            <div className="md:col-span-1">
                                <label className="text-xs">Institution</label>
                                <input {...register(`education_background.${index}.institution`)} className={inputClass} placeholder="University" />
                            </div>
                            <div>
                                <label className="text-xs">Degree</label>
                                <input {...register(`education_background.${index}.degree`)} className={inputClass} placeholder="BSc" />
                            </div>
                            <div>
                                <label className="text-xs">Field</label>
                                <input {...register(`education_background.${index}.field`)} className={inputClass} placeholder="CS" />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-xs">Year</label>
                                    <input {...register(`education_background.${index}.year`)} className={inputClass} placeholder="2020" />
                                </div>
                                <button type="button" onClick={() => removeEdu(index)} className="text-red-500 self-end mb-2">X</button>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendEdu({ institution: '', degree: '', field: '', year: '' })}>+ Add Education</Button>
                </div>
            </Card>

            <Card title="Certifications">
                <div className="space-y-4">
                    {certFields.map((item, index) => (
                        <div key={item.id} className="grid md:grid-cols-3 gap-4 border-b pb-4 items-end">
                            <div>
                                <label className="text-xs">Certification Name</label>
                                <input {...register(`certifications.${index}.name`)} className={inputClass} placeholder="AWS Solutions Architect" />
                            </div>
                            <div>
                                <label className="text-xs">Issuer</label>
                                <input {...register(`certifications.${index}.issuer`)} className={inputClass} placeholder="Amazon" />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-xs">Date</label>
                                    <input type="date" {...register(`certifications.${index}.date`)} className={inputClass} />
                                </div>
                                <button type="button" onClick={() => removeCert(index)} className="text-red-500 self-end mb-2">X</button>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendCert({ name: '', issuer: '', date: '' })}>+ Add Certification</Button>
                </div>
            </Card>

            <Card title="Online Presence">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>LinkedIn URL</label>
                        <input {...register('linkedin_url')} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>GitHub Profile</label>
                        <input {...register('github_profile')} className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Portfolio / Personal Website</label>
                        <input {...register('portfolio_link')} className={inputClass} />
                    </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                </Button>
            </div>
        </form>
    );
};

export default CandidateProfileForm;
