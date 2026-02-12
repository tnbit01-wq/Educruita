import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const StudentProfileForm = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                console.log('🔄 Fetching profile for user:', user.id);

                // Safety timeout - IF Supabase hangs, we stop loading after 3s
                const timeoutId = setTimeout(() => {
                    if (loading) {
                        console.warn('⚠️ Profile fetch timed out - forcing UI ready');
                        setLoading(false);
                        // toast is an object with methods, not a function itself
                        toast.error('Profile taking long to load - you can start editing.');
                    }
                }, 3000);

                // First, try to fetch the base profile
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                clearTimeout(timeoutId); // Clear timeout if successful

                if (error) {
                    // Normalize error handling
                    console.error('❌ Error fetching base profile:', error);
                    // If error is "row not found", it's fine, we just default to empty
                    if (error.code !== 'PGRST116') throw error;
                }

                const loadedProfile = profile || {};
                console.log('✅ Base profile loaded:', loadedProfile);

                // Try to fetch student profile separately (might fail if table doesn't exist)
                const { data: studentProfile, error: studentError } = await supabase
                    .from('student_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (studentError && studentError.code !== 'PGRST116') {
                    // PGRST116 = no rows returned, which is fine
                    console.warn('⚠️ Error fetching student profile:', studentError);
                    if (studentError.code === '42P01') {
                        console.error('❌ student_profiles table does not exist! Please run the SQL setup script.');
                        toast.error('Student profile table missing. Please contact administrator.');
                    }
                }

                console.log('Student profile data:', studentProfile);

                if (!loading) return; // If timeout already fired, don't reset form

                reset({
                    full_name: loadedProfile.full_name || '',
                    email: loadedProfile.email || '',
                    phone: loadedProfile.phone || '',
                    linkedin_url: loadedProfile.linkedin_url || '',
                    institution_name: studentProfile?.institution_name || '',
                    educational_level: studentProfile?.educational_level || '',
                    major: studentProfile?.major || '',
                    graduation_year: studentProfile?.graduation_year || '',
                    gpa: studentProfile?.gpa || '',
                    skills: studentProfile?.skills?.join(', ') || '',
                    preferred_job_roles: studentProfile?.preferred_job_roles?.join(', ') || '',
                    location_preferences: studentProfile?.location_preferences?.join(', ') || '',
                    resume_url: studentProfile?.resume_url || '',
                    portfolio_url: studentProfile?.portfolio_url || ''
                });

                console.log('✅ Form reset with profile data');
            } catch (error) {
                console.error('💥 Error loading profile:', error);
                // Don't toast error here to avoid annoying user if just empty
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            // Cleanup timeout if component unmounts
        };
    }, [user, reset]); // loading MUST NOT be in deps to avoid loop

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            console.log('🔄 Starting profile save...', { userId: user.id, data });

            // Update Base Profile
            const { error: baseError } = await supabase
                .from('profiles')
                .update({
                    full_name: data.full_name,
                    phone: data.phone,
                    linkedin_url: data.linkedin_url,
                    updated_at: new Date()
                })
                .eq('id', user.id);

            if (baseError) {
                console.error('❌ Base profile update error:', baseError);
                toast.error(`Base profile error: ${baseError.message}`);
                throw baseError;
            }
            console.log('✅ Base profile updated');

            // Update Student Details
            const studentData = {
                id: user.id,
                institution_name: data.institution_name,
                educational_level: data.educational_level,
                major: data.major,
                graduation_year: data.graduation_year ? parseInt(data.graduation_year) : null,
                gpa: data.gpa ? parseFloat(data.gpa) : null,
                skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
                preferred_job_roles: data.preferred_job_roles ? data.preferred_job_roles.split(',').map(s => s.trim()) : [],
                location_preferences: data.location_preferences ? data.location_preferences.split(',').map(s => s.trim()) : [],
                resume_url: data.resume_url,
                portfolio_url: data.portfolio_url,
                updated_at: new Date()
            };

            console.log('🔄 Upserting student profile...', studentData);

            const { error: specificError, data: upsertResult } = await supabase
                .from('student_profiles')
                .upsert(studentData, { onConflict: 'id' });

            if (specificError) {
                console.error('❌ Student profile update error:', specificError);
                console.error('Error details:', {
                    message: specificError.message,
                    details: specificError.details,
                    hint: specificError.hint,
                    code: specificError.code
                });

                // Show user-friendly error based on error code
                if (specificError.code === '42P01') {
                    toast.error('Database table missing! Please run the SQL setup script.');
                } else if (specificError.code === '42501') {
                    toast.error('Permission denied. Check RLS policies.');
                } else {
                    toast.error(`Database error: ${specificError.message}`);
                }
                throw specificError;
            }

            console.log('✅ Student profile updated successfully!', upsertResult);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('💥 Complete error object:', error);
            if (!error.message.includes('Database') && !error.message.includes('Permission')) {
                toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
            }
        } finally {
            console.log('🏁 Setting loading to false');
            setLoading(false);
        }
    };

    if (loading && !user) return <div className="p-4 text-center">Loading profile...</div>;

    const inputClass = "mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 sm:text-sm p-3 bg-white text-gray-900 placeholder-gray-400 transition-all";
    const labelClass = "block text-sm font-semibold text-gray-800 mb-1";
    const helperClass = "text-xs text-gray-600 mt-1";
    const disabledClass = "mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm sm:text-sm p-3 bg-gray-100 text-gray-600 cursor-not-allowed";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-6">
            <Card title="Personal Information">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input {...register('full_name')} className={inputClass} placeholder="John Doe" />
                        <p className={helperClass}>Your complete legal name</p>
                    </div>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input {...register('email')} disabled className={disabledClass} />
                        <p className={helperClass}>Cannot be changed (from your account)</p>
                    </div>
                    <div>
                        <label className={labelClass}>Phone Number</label>
                        <input {...register('phone')} className={inputClass} placeholder="+1 234 567 8900" />
                        <p className={helperClass}>Include country code</p>
                    </div>
                    <div>
                        <label className={labelClass}>LinkedIn URL</label>
                        <input {...register('linkedin_url')} className={inputClass} placeholder="https://linkedin.com/in/johndoe" />
                        <p className={helperClass}>Your professional profile</p>
                    </div>
                </div>
            </Card>

            <Card title="Academic Details">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>
                            Educational Level <span className="text-red-500">*</span>
                        </label>
                        <select {...register('educational_level')} className={inputClass}>
                            <option value="">Select Level</option>
                            <option value="High School">High School</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Graduate">Graduate</option>
                            <option value="PhD">PhD</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>
                            Institution Name <span className="text-red-500">*</span>
                        </label>
                        <input {...register('institution_name')} className={inputClass} placeholder="Stanford University" />
                    </div>
                    <div>
                        <label className={labelClass}>Major / Field of Study</label>
                        <input {...register('major')} className={inputClass} placeholder="Computer Science" />
                    </div>
                    <div>
                        <label className={labelClass}>Graduation Year</label>
                        <input type="number" {...register('graduation_year')} className={inputClass} placeholder="2024" />
                    </div>
                    <div>
                        <label className={labelClass}>GPA / Grade</label>
                        <input type="number" step="0.01" {...register('gpa')} className={inputClass} placeholder="3.8" />
                        <p className={helperClass}>On a 4.0 scale</p>
                    </div>
                </div>
            </Card>

            <Card title="Professional Preferences">
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Skills (comma separated)</label>
                        <textarea {...register('skills')} className={inputClass} rows={3} placeholder="React, Python, SQL, Machine Learning, Data Analysis..." />
                        <p className={helperClass}>List your technical and soft skills</p>
                    </div>
                    <div>
                        <label className={labelClass}>Preferred Job Roles (comma separated)</label>
                        <input {...register('preferred_job_roles')} className={inputClass} placeholder="Software Engineer, Data Analyst, Product Manager" />
                        <p className={helperClass}>What positions are you targeting?</p>
                    </div>
                    <div>
                        <label className={labelClass}>Location Preferences</label>
                        <input {...register('location_preferences')} className={inputClass} placeholder="Remote, New York, San Francisco, London" />
                        <p className={helperClass}>Where would you like to work?</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Resume URL</label>
                            <input {...register('resume_url')} className={inputClass} placeholder="https://drive.google.com/..." />
                            <p className={helperClass}>Link to your resume/CV</p>
                        </div>
                        <div>
                            <label className={labelClass}>Portfolio URL</label>
                            <input {...register('portfolio_url')} className={inputClass} placeholder="https://myportfolio.com" />
                            <p className={helperClass}>Showcase your work</p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="w-full md:w-auto px-8">
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving Changes...
                        </span>
                    ) : 'Save Profile'}
                </Button>
            </div>
        </form>
    );
};

export default StudentProfileForm;
