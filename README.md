# Recruitment & Job Portal Management System - Frontend Prototype

## 📋 Project Overview

This is a production-grade UI prototype for a comprehensive Recruitment & Job Portal Management System. Built with React, Vite, and Tailwind CSS, it provides complete role-based dashboards and workflows for Candidates, Employers, Admins, and Super Admins.

## 🚀 Tech Stack

- **Framework**: React 18 (Vite)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Heroicons
- **Architecture**: Component-driven, MERN-aligned

## 👥 User Roles & Features

### 1. Candidate
- **Dashboard**: Profile completion progress, job recommendations, application status
- **Profile Management**: Personal info, education (with CGPA validation), experience, skills, projects
- **Resume Builder**: Multiple templates, live preview, version management, download
- **Job Search**: Advanced filters (location, salary, CGPA, skills), one-click apply
- **Application Tracking**: Timeline view with status updates
- **BGV Documents**: Upload management with verification status

### 2. Employer / Recruiter
- **Dashboard**: Active jobs overview, applicant pipeline, shortlisted candidates
- **Company Profile**: Company details, verification status, recruiter management
- **Job Management**: Create/edit jobs, visibility toggle, applicant tracking
- **ATS (Applicant Tracking System)**: Candidate pipeline, resume preview, interview scheduling
- **Communication**: In-app messaging, email templates

### 3. Admin (Operations)
- **Dashboard**: Pending approvals, system alerts
- **Candidate Moderation**: Profile review, resume tagging, BGV verification
- **Employer Moderation**: Company verification, job approval queue
- **Support System**: Ticket management, broadcast notifications

### 4. Super Admin (System Owner)
- **Dashboard**: Platform-wide metrics, charts, growth analytics
- **User & Role Management**: Permission matrix, role assignments
- **Platform Configuration**: Skills, job categories, locations, CGPA scales
- **CMS**: Static pages, blog manager, banner management
- **Analytics**: Reports, data export

## 🔧 Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🔐 Authentication Flow (UI Only)

The login page includes a role selector for prototype demonstration:
- Select a role (Candidate/Employer/Admin/Super Admin)
- Click "Sign In" to navigate to the respective dashboard
- No actual authentication - frontend prototype only

## 🌐 Key Routes

- `/auth/login` - Login with role selector
- `/candidate/dashboard` - Candidate dashboard
- `/employer/dashboard` - Employer dashboard
- `/admin/dashboard` - Admin dashboard
- `/superadmin/dashboard` - Super Admin dashboard

## 🎯 Implemented Features

✅ Role-based layouts with sidebar navigation
✅ Responsive design (mobile, tablet, desktop)
✅ Complete authentication UI flow
✅ Candidate profile with CGPA validation
✅ Resume builder with templates
✅ Job search with advanced filters
✅ Application tracking timeline
✅ BGV document management
✅ Employer job posting
✅ Admin moderation dashboard
✅ Super Admin analytics

## 📝 Notes

- This is a **frontend-only prototype**
- Uses mock data for demonstration
- All forms are UI-only (no submission logic)
- Ready for backend API integration

---

**Status**: ✅ Ready for design review and backend integration
