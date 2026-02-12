# Quick Start Guide - Job Portal Prototype

## 🚀 Getting Started

### Running the Application

```bash
npm run dev
```

The application will open at `http://localhost:5176` (or another port if 5176 is busy)

## 🔐 Login Instructions

1. Open the application at `http://localhost:5176`
2. You'll see the login page with 4 role options:
   - **Candidate** - Job seekers
   - **Employer** - Companies posting jobs
   - **Admin** - Operations team
   - **Super Admin** - System owner

3. Select any role and click "Sign In" (email/password not required for prototype)

## 📍 Navigation Guide

### For Candidates
After logging in as Candidate, you can navigate to:
- **Dashboard** - Overview of applications and recommendations
- **Profile** - Manage personal info, education, experience, skills
- **Resume** - Build and download resumes
- **Job Search** - Find and apply to jobs
- **Applications** - Track application status
- **BGV Documents** - Upload verification documents

### For Employers
After logging in as Employer:
- **Dashboard** - View active jobs and applicants
- **Job Management** - Create and manage job postings
- More features coming soon

### For Admin
After logging in as Admin:
- **Dashboard** - Review pending approvals
- **Moderation** tools (coming soon)

### For Super Admin
After logging in as Super Admin:
- **Dashboard** - Platform analytics and metrics
- **Management** tools (coming soon)

## 🎨 Features to Explore

### Candidate Features
1. **Profile Completion**
   - Go to Profile → Fill in details
   - Notice the progress bar showing completion percentage

2. **Skills with Proficiency**
   - Go to Profile → Skills tab
   - Use sliders to set proficiency levels

3. **Resume Builder**
   - Go to Resume
   - Select a template
   - Click "Preview Resume"
   - Manage multiple resume versions

4. **Job Search**
   - Go to Job Search
   - Use filters (click "Filters" button)
   - Click on any job card to see details
   - Click "Apply Now" to simulate application

5. **Application Tracking**
   - Go to Applications
   - Click "View Timeline" on any application
   - See the status progression

6. **BGV Documents**
   - Go to BGV Documents
   - See upload status with badges
   - Click "Upload" to simulate document upload

### Employer Features
1. **Create Job Posting**
   - Go to Job Management
   - Click "Post New Job"
   - Fill in the form (modal will open)

2. **View Applicants**
   - Dashboard shows recent applicants
   - Job cards show applicant counts

### All Roles
- **Responsive Design**: Resize browser to see mobile/tablet layouts
- **Sidebar Navigation**: Click hamburger menu on mobile
- **Notifications**: Bell icon in header (red dot indicator)

## 🎯 Key UI Patterns

### Color Coding by Role
- **Blue** = Candidate
- **Purple** = Employer
- **Green** = Admin
- **Indigo** = Super Admin

### Status Badges
- **Green** = Approved/Active/Success
- **Yellow** = Pending/Under Review
- **Red** = Rejected/Closed
- **Blue** = Info/In Progress

### Interactive Elements
- **Cards with hover** - Clickable items
- **Buttons** - Multiple variants (primary, outline, danger)
- **Modals** - For forms and details
- **Timeline** - For application tracking

## 📱 Testing Responsive Design

1. **Desktop View** (>1024px)
   - Full sidebar visible
   - Multi-column layouts

2. **Tablet View** (768px - 1024px)
   - Sidebar toggles
   - 2-column grids

3. **Mobile View** (<768px)
   - Hamburger menu
   - Single column
   - Stacked elements

## 🔄 Simulated Interactions

All buttons and forms are interactive but use mock data:
- **Apply to Job** → Shows alert
- **Upload Document** → Simulates upload with delay
- **Create Job** → Shows confirmation
- **Save Profile** → (Ready for API integration)

## 📝 Notes for Development Team

### Mock Data Locations
- Job listings: `CandidateJobs.jsx`
- Applications: `CandidateApplications.jsx`
- Company data: `EmployerDashboard.jsx`
- Stats: Each dashboard component

### API Integration Points
All data fetching points are clearly marked:
```javascript
// TODO: Replace with actual API call
const jobs = mockJobs;
```

### Form Validation
Forms have basic HTML5 validation. Add custom validation when integrating with backend.

## 🐛 Troubleshooting

### Port Already in Use
If you see "Port 5173 is in use", Vite will automatically try other ports (5174, 5175, etc.)

### Tailwind Styles Not Loading
1. Ensure `tailwind.config.js` exists
2. Check `index.css` has Tailwind directives
3. Restart dev server

### Components Not Found
1. Check file paths in imports
2. Ensure all files are saved
3. Check for typos in component names

## 🎓 Learning Resources

- **React Router**: [reactrouter.com](https://reactrouter.com)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Heroicons**: [heroicons.com](https://heroicons.com)

## ✅ Checklist for Demo

- [ ] All 4 roles accessible from login
- [ ] Navigation works across all pages
- [ ] Responsive on mobile/tablet/desktop
- [ ] Modals open and close properly
- [ ] Forms display validation
- [ ] Timelines animate correctly
- [ ] Cards are interactive
- [ ] Loading states visible
- [ ] Empty states display when needed

---

**Need Help?** Check the main README.md for detailed documentation.
