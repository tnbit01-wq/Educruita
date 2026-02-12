import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Public
import LandingPage from './pages/LandingPage';

// Layouts
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Student
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAchievements from './pages/student/StudentAchievements';
import StudentGroups from './pages/student/StudentGroups';
import StudentMessages from './pages/student/StudentMessages';
import StudentSettings from './pages/student/StudentSettings';
import MentorshipFeed from './pages/mentorship/MentorshipFeed';

import JobAuthenticityChecker from './pages/jobs/JobAuthenticityChecker';

// Faculty
import FacultyLayout from './layouts/FacultyLayout';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyClasses from './pages/faculty/FacultyClasses';
import FacultyLeaves from './pages/faculty/FacultyLeaves';
import FacultyFeedback from './pages/faculty/FacultyFeedback';
import FacultySettings from './pages/faculty/FacultySettings';

// Candidate
import CandidateLayout from './layouts/CandidateLayout';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';
import CandidateResume from './pages/candidate/CandidateResume';
import CandidateJobs from './pages/candidate/CandidateJobs';
import CandidateApplications from './pages/candidate/CandidateApplications';
import CandidateBGV from './pages/candidate/CandidateBGV';
import CandidateSettings from './pages/candidate/CandidateSettings';
import CandidateNotifications from './pages/candidate/CandidateNotifications';

// Employer
import EmployerLayout from './layouts/EmployerLayout';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerJobs from './pages/employer/EmployerJobs';
import EmployerProfile from './pages/employer/EmployerProfile';
import EmployerApplicants from './pages/employer/EmployerApplicants';
import EmployerMessages from './pages/employer/EmployerMessages';
import EmployerSettings from './pages/employer/EmployerSettings';

// Admin
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCandidateModeration from './pages/admin/AdminCandidateModeration';
import AdminEmployerModeration from './pages/admin/AdminEmployerModeration';
import AdminStudentModeration from './pages/admin/AdminStudentModeration';
import AdminFacultyModeration from './pages/admin/AdminFacultyModeration';
import AdminSupport from './pages/admin/AdminSupport';

import AdminSettings from './pages/admin/AdminSettings';
import AdminJobManagement from './pages/admin/AdminJobManagement';

// ... (Rest of imports)



// Super Admin
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import SuperAdminUsers from './pages/superadmin/SuperAdminUsers';
import SuperAdminConfig from './pages/superadmin/SuperAdminConfig';
import SuperAdminCMS from './pages/superadmin/SuperAdminCMS';
import SuperAdminAnalytics from './pages/superadmin/SuperAdminAnalytics';
import SuperAdminCompliance from './pages/superadmin/SuperAdminCompliance';


import DemoOne from './components/demo-one';
import GlobalAIChatBot from './components/common/GlobalAIChatBot';


// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', { path: location.pathname, loading, isAuthenticated, userRole: user?.role });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
          <p className="text-emerald-100/40 animate-pulse text-sm font-medium">Securing session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Simple role check
  if (allowedRoles.length > 0 && user) {
    const role = (user.role || user.user_metadata?.role || '').toLowerCase();
    if (!allowedRoles.includes(role)) {
      console.warn(`[ProtectedRoute] Access Denied. Role '${role}' not in [${allowedRoles}]. Metadata Role: ${user?.user_metadata?.role}`);
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/demo" element={<DemoOne />} />

            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
            </Route>


            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="achievements" element={<StudentAchievements />} />
              <Route path="groups" element={<StudentGroups />} />
              <Route path="messages" element={<StudentMessages />} />
              <Route path="feed" element={<MentorshipFeed />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>

            {/* Faculty Routes */}
            <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/faculty/dashboard" replace />} />
              <Route path="dashboard" element={<FacultyDashboard />} />
              <Route path="classes" element={<FacultyClasses />} />
              <Route path="leaves" element={<FacultyLeaves />} />
              <Route path="feedback" element={<FacultyFeedback />} />
              <Route path="settings" element={<FacultySettings />} />
            </Route>

            {/* Candidate Routes */}
            <Route path="/candidate" element={<ProtectedRoute allowedRoles={['candidate']}><CandidateLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/candidate/dashboard" replace />} />
              <Route path="dashboard" element={<CandidateDashboard />} />
              <Route path="profile" element={<CandidateProfile />} />
              <Route path="resume" element={<CandidateResume />} />
              <Route path="jobs" element={<CandidateJobs />} />
              <Route path="applications" element={<CandidateApplications />} />
              <Route path="bgv" element={<CandidateBGV />} />
              <Route path="notifications" element={<CandidateNotifications />} />
              <Route path="settings" element={<CandidateSettings />} />
              <Route path="job-check" element={<JobAuthenticityChecker />} />
            </Route>

            {/* Employer Routes */}
            <Route path="/employer" element={<ProtectedRoute allowedRoles={['employer']}><EmployerLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/employer/dashboard" replace />} />
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route path="jobs" element={<EmployerJobs />} />
              <Route path="profile" element={<EmployerProfile />} />
              <Route path="applicants" element={<EmployerApplicants />} />
              <Route path="messages" element={<EmployerMessages />} />
              <Route path="settings" element={<EmployerSettings />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="candidates" element={<AdminCandidateModeration />} />
              <Route path="employers" element={<AdminEmployerModeration />} />
              <Route path="jobs" element={<AdminJobManagement />} />
              <Route path="students" element={<AdminStudentModeration />} />
              <Route path="faculty" element={<AdminFacultyModeration />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Super Admin Routes */}
            <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['superadmin', 'super_admin']}><SuperAdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="users" element={<SuperAdminUsers />} />
              <Route path="config" element={<SuperAdminConfig />} />
              <Route path="cms" element={<SuperAdminCMS />} />
              <Route path="analytics" element={<SuperAdminAnalytics />} />
              <Route path="compliance" element={<SuperAdminCompliance />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900">404</h1>
                  <p className="text-xl text-gray-600 mt-4">Page not found</p>
                  <a href="/auth/login" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Go to Login
                  </a>
                </div>
              </div>
            } />
          </Routes>
          {/* <GlobalAIChatBot /> */}
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
