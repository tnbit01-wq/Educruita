// Local Storage Service - Manages persistent state in browser

const STORAGE_KEYS = {
    USER: 'jobportal_user',
    TOKEN: 'jobportal_token',
    APPLICATIONS: 'jobportal_applications',
    SAVED_JOBS: 'jobportal_saved_jobs',
    PROFILE_DATA: 'jobportal_profile',
    BGV_DOCUMENTS: 'jobportal_bgv',
    EMPLOYER_JOBS: 'jobportal_employer_jobs',
};

class StorageService {
    // Generic get/set methods
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return null;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
            return false;
        }
    }

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // User session methods
    getUser() {
        return this.get(STORAGE_KEYS.USER);
    }

    setUser(user) {
        return this.set(STORAGE_KEYS.USER, user);
    }

    removeUser() {
        this.remove(STORAGE_KEYS.USER);
        this.remove(STORAGE_KEYS.TOKEN);
    }

    getToken() {
        return this.get(STORAGE_KEYS.TOKEN);
    }

    setToken(token) {
        return this.set(STORAGE_KEYS.TOKEN, token);
    }

    // Applications methods
    getApplications() {
        return this.get(STORAGE_KEYS.APPLICATIONS) || [];
    }

    setApplications(applications) {
        return this.set(STORAGE_KEYS.APPLICATIONS, applications);
    }

    addApplication(application) {
        const applications = this.getApplications();
        applications.push(application);
        return this.setApplications(applications);
    }

    updateApplication(id, updates) {
        const applications = this.getApplications();
        const index = applications.findIndex(app => app.id === id);
        if (index !== -1) {
            applications[index] = { ...applications[index], ...updates };
            return this.setApplications(applications);
        }
        return false;
    }

    removeApplication(id) {
        const applications = this.getApplications();
        const filtered = applications.filter(app => app.id !== id);
        return this.setApplications(filtered);
    }

    // Saved jobs methods
    getSavedJobs() {
        return this.get(STORAGE_KEYS.SAVED_JOBS) || [];
    }

    setSavedJobs(jobs) {
        return this.set(STORAGE_KEYS.SAVED_JOBS, jobs);
    }

    toggleSavedJob(jobId) {
        const savedJobs = this.getSavedJobs();
        const index = savedJobs.indexOf(jobId);

        if (index > -1) {
            savedJobs.splice(index, 1);
        } else {
            savedJobs.push(jobId);
        }

        return this.setSavedJobs(savedJobs);
    }

    isJobSaved(jobId) {
        const savedJobs = this.getSavedJobs();
        return savedJobs.includes(jobId);
    }

    // Profile data methods
    getProfileData() {
        return this.get(STORAGE_KEYS.PROFILE_DATA);
    }

    setProfileData(profile) {
        return this.set(STORAGE_KEYS.PROFILE_DATA, profile);
    }

    updateProfileData(updates) {
        const profile = this.getProfileData() || {};
        const updated = { ...profile, ...updates };
        return this.setProfileData(updated);
    }

    // BGV documents methods
    getBGVDocuments() {
        return this.get(STORAGE_KEYS.BGV_DOCUMENTS) || [];
    }

    setBGVDocuments(documents) {
        return this.set(STORAGE_KEYS.BGV_DOCUMENTS, documents);
    }

    updateBGVDocument(id, updates) {
        const documents = this.getBGVDocuments();
        const index = documents.findIndex(doc => doc.id === id);
        if (index !== -1) {
            documents[index] = { ...documents[index], ...updates };
            return this.setBGVDocuments(documents);
        }
        return false;
    }

    // Employer jobs methods
    getEmployerJobs() {
        return this.get(STORAGE_KEYS.EMPLOYER_JOBS) || [];
    }

    setEmployerJobs(jobs) {
        return this.set(STORAGE_KEYS.EMPLOYER_JOBS, jobs);
    }

    addEmployerJob(job) {
        const jobs = this.getEmployerJobs();
        jobs.push(job);
        return this.setEmployerJobs(jobs);
    }

    updateEmployerJob(id, updates) {
        const jobs = this.getEmployerJobs();
        const index = jobs.findIndex(job => job.id === id);
        if (index !== -1) {
            jobs[index] = { ...jobs[index], ...updates };
            return this.setEmployerJobs(jobs);
        }
        return false;
    }

    removeEmployerJob(id) {
        const jobs = this.getEmployerJobs();
        const filtered = jobs.filter(job => job.id !== id);
        return this.setEmployerJobs(filtered);
    }
}

// Export singleton instance
const storageService = new StorageService();
export default storageService;
