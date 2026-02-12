// Mock API Service - Simulates backend API calls with realistic delays

import {
    mockUsers,
    mockJobs,
    mockApplications,
    mockBGVDocuments,
    mockCandidateStats,
    mockEmployerStats,
    mockRecommendedJobs,
    mockRecentApplicants,
    mockEmployerJobs,
} from './mockData';
import { studentUsers, facultyUsers } from './campusMockData';
import storageService from './storage';

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique IDs
const generateId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

class MockApiService {
    // Authentication
    async login(email, password, role) {
        await delay(400);

        // Simple mock authentication - accept any email/password
        let user;

        if (role === 'student') {
            user = studentUsers[0];
        } else if (role === 'faculty') {
            user = facultyUsers[0];
        } else {
            user = mockUsers[role];
        }

        if (!user) {
            throw new Error('Invalid role');
        }

        const token = `mock_token_${generateId()}`;
        const userData = { ...user, email };

        // Store in localStorage
        storageService.setUser(userData);
        storageService.setToken(token);

        return {
            token,
            user: userData,
        };
    }

    async register(userData) {
        await delay(500);

        const newUser = {
            id: generateId('user'),
            ...userData,
            role: userData.role || 'candidate',
            profileCompletion: 20,
        };

        const token = `mock_token_${generateId()}`;

        storageService.setUser(newUser);
        storageService.setToken(token);

        return {
            token,
            user: newUser,
        };
    }

    async logout() {
        await delay(200);
        storageService.removeUser();
        return { success: true };
    }

    async forgotPassword(email) {
        await delay(400);
        return { success: true, message: 'Password reset email sent' };
    }

    async resetPassword(token, newPassword) {
        await delay(400);
        return { success: true, message: 'Password reset successful' };
    }

    // Candidate Dashboard
    async getCandidateDashboard() {
        await delay(350);

        // Get applications from storage or use mock
        const storedApplications = storageService.getApplications();
        const applications = storedApplications.length > 0 ? storedApplications : mockApplications;

        // Get saved jobs
        const savedJobIds = storageService.getSavedJobs();

        return {
            stats: mockCandidateStats,
            recommendedJobs: mockRecommendedJobs,
            recentApplications: applications.slice(0, 3),
            savedJobs: savedJobIds,
        };
    }

    // Jobs
    async getJobs(filters = {}) {
        await delay(300);

        let jobs = [...mockJobs];

        // Apply filters
        if (filters.search) {
            const search = filters.search.toLowerCase();
            jobs = jobs.filter(job =>
                job.title.toLowerCase().includes(search) ||
                job.company.toLowerCase().includes(search) ||
                job.skills.some(skill => skill.toLowerCase().includes(search))
            );
        }

        if (filters.location) {
            jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
        }

        if (filters.type) {
            jobs = jobs.filter(job => job.type === filters.type);
        }

        if (filters.skills && filters.skills.length > 0) {
            jobs = jobs.filter(job =>
                filters.skills.some(skill => job.skills.includes(skill))
            );
        }

        if (filters.minSalary) {
            // Simple salary filter (would need more sophisticated parsing in real app)
            jobs = jobs.filter(job => {
                const salaryMatch = job.salary.match(/\$(\d+)k/);
                return salaryMatch && parseInt(salaryMatch[1]) >= filters.minSalary;
            });
        }

        return jobs;
    }

    async getJobById(id) {
        await delay(250);
        const job = mockJobs.find(j => j.id === id);
        if (!job) throw new Error('Job not found');
        return job;
    }

    // Applications
    async applyToJob(jobId) {
        await delay(400);

        const job = mockJobs.find(j => j.id === jobId);
        if (!job) throw new Error('Job not found');

        const application = {
            id: generateId('app'),
            jobId: job.id,
            candidateId: storageService.getUser()?.id,
            title: job.title,
            company: job.company,
            logo: job.company.substring(0, 2).toUpperCase(),
            status: 'Under Review',
            appliedDate: new Date().toISOString().split('T')[0],
            stage: 1,
            totalStages: 4,
            timeline: [
                { stage: 'Applied', date: new Date().toISOString().split('T')[0], completed: true },
                { stage: 'Resume Review', date: null, completed: false },
                { stage: 'Interview', date: null, completed: false },
                { stage: 'Final Decision', date: null, completed: false },
            ],
        };

        storageService.addApplication(application);

        return application;
    }

    async getApplications() {
        await delay(300);
        const applications = storageService.getApplications();
        return applications.length > 0 ? applications : mockApplications;
    }

    async withdrawApplication(id) {
        await delay(300);
        storageService.removeApplication(id);
        return { success: true };
    }

    // Profile
    async getProfile() {
        await delay(250);
        const stored = storageService.getProfileData();
        return stored || mockUsers.candidate.profile;
    }

    async updateProfile(updates) {
        await delay(400);
        storageService.updateProfileData(updates);
        return { success: true, profile: updates };
    }

    // BGV Documents
    async getBGVDocuments() {
        await delay(250);
        const stored = storageService.getBGVDocuments();
        return stored.length > 0 ? stored : mockBGVDocuments;
    }

    async uploadBGVDocument(documentId, file) {
        await delay(800); // Longer delay to simulate file upload

        const documents = await this.getBGVDocuments();
        const index = documents.findIndex(doc => doc.id === documentId);

        if (index !== -1) {
            documents[index] = {
                ...documents[index],
                status: 'pending',
                uploadedDate: new Date().toISOString().split('T')[0],
            };
            storageService.setBGVDocuments(documents);
            return documents[index];
        }

        throw new Error('Document not found');
    }

    // Employer Dashboard
    async getEmployerDashboard() {
        await delay(350);

        const storedJobs = storageService.getEmployerJobs();
        const jobs = storedJobs.length > 0 ? storedJobs : mockEmployerJobs;

        return {
            stats: mockEmployerStats,
            activeJobsList: jobs,
            recentApplicants: mockRecentApplicants,
        };
    }

    // Employer Jobs
    async getEmployerJobs() {
        await delay(300);
        const stored = storageService.getEmployerJobs();
        return stored.length > 0 ? stored : mockEmployerJobs;
    }

    async createJob(jobData) {
        await delay(500);

        const newJob = {
            id: generateId('job'),
            ...jobData,
            posted: new Date().toISOString().split('T')[0],
            applicants: 0,
            newApplicants: 0,
            views: 0,
            shortlisted: 0,
            interviewed: 0,
            status: 'Active',
        };

        storageService.addEmployerJob(newJob);

        return newJob;
    }

    async updateJob(id, updates) {
        await delay(400);
        storageService.updateEmployerJob(id, updates);
        return { success: true };
    }

    async deleteJob(id) {
        await delay(300);
        storageService.removeEmployerJob(id);
        return { success: true };
    }

    // Saved Jobs
    async toggleSaveJob(jobId) {
        await delay(200);
        storageService.toggleSavedJob(jobId);
        const isSaved = storageService.isJobSaved(jobId);
        return { success: true, saved: isSaved };
    }

    async getSavedJobs() {
        await delay(250);
        const savedIds = storageService.getSavedJobs();
        const jobs = mockJobs.filter(job => savedIds.includes(job.id));
        return jobs;
    }
}

// Export singleton instance
const mockApi = new MockApiService();
export default mockApi;
