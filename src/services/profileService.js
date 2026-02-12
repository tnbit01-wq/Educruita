import { supabase } from '../lib/supabaseClient';

// Map roles to their specific profile tables
const ROLE_TABLE_MAP = {
    student: 'student_profiles',
    faculty: 'faculty_profiles',
    candidate: 'candidate_profiles',
    employer: 'employer_profiles',
    admin: 'profiles', // Admin uses base only usually
    superadmin: 'profiles'
};

/**
 * Fetches the complete profile for a user, including role-specific data.
 * @param {string} userId - The user's UUID
 * @param {string} role - The user's role (e.g., 'student')
 * @returns {Promise<Object>} Merged profile data
 */
export const getFullProfile = async (userId, role) => {
    try {
        // 1. Fetch base profile
        const { data: baseProfile, error: baseError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (baseError) throw baseError;

        const specificTable = ROLE_TABLE_MAP[role?.toLowerCase()];
        if (!specificTable || specificTable === 'profiles') {
            return baseProfile;
        }

        // 2. Fetch specific profile extension
        const { data: specificProfile, error: specificError } = await supabase
            .from(specificTable)
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (specificError && specificError.code !== 'PGRST116') {
            console.error(`Error fetching ${role} profile:`, specificError);
            // Don't throw, just return base
        }

        // 3. Merge data (specific overrides base if conflict, though usually fields differ)
        return { ...baseProfile, ...(specificProfile || {}) };
    } catch (error) {
        console.error('Error in getFullProfile:', error);
        throw error;
    }
};

/**
 * Updates the user's profile, splitting data between base and specific tables.
 * @param {string} userId
 * @param {string} role
 * @param {Object} profileData - The complete profile object
 */
export const updateFullProfile = async (userId, role, profileData) => {
    try {
        // defined fields for base profile (from schema)
        const baseFields = [
            'full_name', 'email', 'phone', 'avatar_url', 'bio', 'location',
            'linkedin_url', 'website_url', 'social_links', 'updated_at'
        ];

        // Filter data for base table
        const baseData = {};
        const specificData = {};

        Object.keys(profileData).forEach(key => {
            if (baseFields.includes(key)) {
                baseData[key] = profileData[key];
            } else {
                specificData[key] = profileData[key];
            }
        });

        baseData.updated_at = new Date();

        // 1. Update Base Profile
        const { error: baseError } = await supabase
            .from('profiles')
            .update(baseData)
            .eq('id', userId);

        if (baseError) throw baseError;

        const specificTable = ROLE_TABLE_MAP[role?.toLowerCase()];
        if (specificTable && specificTable !== 'profiles') {
            // 2. Upsert Specific Profile
            // Ensure specificData has ID
            const { error: specificError } = await supabase
                .from(specificTable)
                .upsert({ id: userId, ...specificData, updated_at: new Date() })
                .select();

            if (specificError) throw specificError;
        }

        return { ...baseData, ...specificData };
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};
