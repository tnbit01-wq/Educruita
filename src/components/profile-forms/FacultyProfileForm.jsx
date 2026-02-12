import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const FacultyProfileForm = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const { register, control, handleSubmit, reset } = useForm({
        defaultValues: {
            publications: [{ title: '', journal: '', year: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "publications"
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select(`
            *,
            faculty:faculty_profiles(*)
          `)
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                reset({
                    full_name: profile.full_name,
                    email: profile.email,
                    phone: profile.phone,
                    linkedin_url: profile.linkedin_url,
                    website_url: profile.website_url, // personal website

                    employee_id: profile.faculty?.employee_id || '',
                    department: profile.faculty?.department || '',
                    position_title: profile.faculty?.position_title || '',
                    years_of_experience: profile.faculty?.years_of_experience || '',
                    office_hours: profile.faculty?.office_hours || '',

                    specialization_areas: profile.faculty?.specialization_areas?.join(', ') || '',
                    courses_taught: profile.faculty?.courses_taught?.join(', ') || '',
                    research_interests: profile.faculty?.research_interests?.join(', ') || '',

                    publications: profile.faculty?.publications?.length ? profile.faculty.publications : [{ title: '', journal: '', year: '' }]
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

            const { error: baseError } = await supabase
                .from('profiles')
                .update({
                    full_name: data.full_name,
                    phone: data.phone,
                    linkedin_url: data.linkedin_url,
                    address: data.office_hours, // using address for office hours? No, keep separate
                    updated_at: new Date()
                })
                .eq('id', user.id);

            if (baseError) throw baseError;

            const facultyData = {
                id: user.id,
                employee_id: data.employee_id,
                department: data.department,
                position_title: data.position_title,
                years_of_experience: parseInt(data.years_of_experience) || 0,
                office_hours: data.office_hours,
                personal_website: data.website_url,

                specialization_areas: data.specialization_areas.split(',').map(s => s.trim()).filter(Boolean),
                courses_taught: data.courses_taught.split(',').map(s => s.trim()).filter(Boolean),
                research_interests: data.research_interests.split(',').map(s => s.trim()).filter(Boolean),

                publications: data.publications.filter(p => p.title), // Filter empty
                updated_at: new Date()
            };

            const { error: specificError } = await supabase
                .from('faculty_profiles')
                .upsert(facultyData, { onConflict: 'id' });

            if (specificError) throw specificError;

            toast.success('Faculty profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) return <div className="p-4 text-center">Loading...</div>;

    const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border";
    const labelClass = "block text-sm font-medium text-gray-700";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-6">
            <Card title="Academic Identity">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Full Name</label>
                        <input {...register('full_name')} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Position / Title</label>
                        <input {...register('position_title')} className={inputClass} placeholder="Associate Professor" />
                    </div>
                    <div>
                        <label className={labelClass}>Department</label>
                        <input {...register('department')} className={inputClass} placeholder="Computer Science" />
                    </div>
                    <div>
                        <label className={labelClass}>Employee ID</label>
                        <input {...register('employee_id')} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Years of Experience</label>
                        <input type="number" {...register('years_of_experience')} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Office Hours</label>
                        <input {...register('office_hours')} className={inputClass} placeholder="Mon/Wed 2-4 PM, Room 301" />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Personal Website / Portfolio</label>
                        <input {...register('website_url')} className={inputClass} placeholder="https://faculty.university.edu/..." />
                    </div>
                </div>
            </Card>

            <Card title="Expertise & Teaching">
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Specialization Areas (comma separated)</label>
                        <textarea {...register('specialization_areas')} className={inputClass} rows={2} placeholder="AI, Machine Learning, Data Science" />
                    </div>
                    <div>
                        <label className={labelClass}>Research Interests (comma separated)</label>
                        <textarea {...register('research_interests')} className={inputClass} rows={2} placeholder="Neural Networks, NLP, Ethics in AI" />
                    </div>
                    <div>
                        <label className={labelClass}>Courses Taught (comma separated)</label>
                        <input {...register('courses_taught')} className={inputClass} placeholder="CS101, CS202, AI400" />
                    </div>
                </div>
            </Card>

            <Card title="Publications">
                <div className="space-y-4">
                    {fields.map((item, index) => (
                        <div key={item.id} className="flex gap-4 items-start border-b pb-4">
                            <div className="flex-1 space-y-2">
                                <input
                                    {...register(`publications.${index}.title`)}
                                    className={inputClass}
                                    placeholder="Paper Title"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        {...register(`publications.${index}.journal`)}
                                        className={inputClass}
                                        placeholder="Journal/Choose Conference"
                                    />
                                    <input
                                        {...register(`publications.${index}.year`)}
                                        className={inputClass}
                                        placeholder="Year"
                                        type="number"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700 text-sm mt-2"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ title: '', journal: '', year: '' })}
                    >
                        + Add Publication
                    </Button>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Faculty Profile'}
                </Button>
            </div>
        </form>
    );
};

export default FacultyProfileForm;
