import { supabase } from './supabaseClient';

/**
 * Uploads a file to a Supabase bucket.
 * @param bucket - The name of the bucket (e.g., 'resumes', 'avatars').
 * @param path - The internal path/filename in the bucket (e.g., 'user_id/resume.pdf').
 * @param file - The File object to upload.
 * @returns The public URL of the uploaded file.
 */
export const uploadFile = async (bucket: string, path: string, file: File) => {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                upsert: true,
                cacheControl: '3600',
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return publicUrl;
    } catch (error) {
        console.error(`Error uploading to ${bucket}:`, error);
        throw error;
    }
};

/**
 * Deletes a file from a Supabase bucket.
 * @param bucket - The name of the bucket.
 * @param path - The internal path/filename to delete.
 */
export const deleteFile = async (bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
};
