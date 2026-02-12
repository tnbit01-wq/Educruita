# Backend Integration Guide

## 🎯 Overview

This document provides guidance for backend developers on integrating APIs with this frontend prototype.

## 📡 Expected API Structure

### Base URL
```
Production: https://api.jobportal.com
Development: http://localhost:3000/api
```

### Authentication
All authenticated endpoints should use JWT tokens:
```
Authorization: Bearer <token>
```

## 🔐 Authentication Endpoints

### POST /auth/login
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "candidate|employer|admin|superadmin",
    "name": "John Doe"
  }
}
```

### POST /auth/register
```json
Request:
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "phone": "+1234567890"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### POST /auth/verify-otp
```json
Request:
{
  "email": "user@example.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "token": "jwt_token",
  "user": { /* user object */ }
}
```

### POST /auth/forgot-password
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Reset link sent to email"
}
```

### POST /auth/reset-password
```json
Request:
{
  "token": "reset_token",
  "password": "newpassword123"
}

Response:
{
  "success": true,
  "message": "Password updated successfully"
}
```

## 👤 Candidate Endpoints

### GET /candidate/profile
```json
Response:
{
  "id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "education": [
    {
      "degree": "Bachelor of Technology",
      "field": "Computer Science",
      "institution": "MIT",
      "year": "2017",
      "cgpa": "8.5"
    }
  ],
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco",
      "from": "2020-01",
      "to": "Present",
      "current": true,
      "description": "..."
    }
  ],
  "skills": [
    { "name": "React", "proficiency": 90 }
  ],
  "projects": [
    {
      "name": "E-commerce Platform",
      "description": "...",
      "technologies": ["React", "Node.js"],
      "link": "https://github.com/..."
    }
  ]
}
```

### PUT /candidate/profile
```json
Request: (Same structure as GET response)

Response:
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### GET /candidate/resumes
```json
Response:
{
  "resumes": [
    {
      "id": "resume_id",
      "name": "Software Engineer Resume",
      "template": "modern",
      "lastUpdated": "2024-01-20",
      "downloads": 15,
      "url": "https://storage.../resume.pdf"
    }
  ]
}
```

### POST /candidate/resumes
```json
Request:
{
  "name": "Resume Name",
  "template": "modern",
  "data": { /* profile data */ }
}

Response:
{
  "success": true,
  "resume": { /* resume object */ }
}
```

### GET /jobs
Query Parameters: `?search=developer&location=SF&minSalary=100000&cgpa=7.0&skills=React,Node.js&type=fulltime`

```json
Response:
{
  "jobs": [
    {
      "id": "job_id",
      "title": "Senior Frontend Developer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "type": "Full-time",
      "salary": "$120k - $150k",
      "experience": "5-7 years",
      "skills": ["React", "TypeScript"],
      "cgpaRequired": 7.5,
      "description": "...",
      "postedDate": "2024-01-15",
      "applicants": 45,
      "views": 320
    }
  ],
  "total": 100,
  "page": 1,
  "perPage": 20
}
```

### POST /jobs/:id/apply
```json
Request:
{
  "resumeId": "resume_id",
  "coverLetter": "..."
}

Response:
{
  "success": true,
  "applicationId": "application_id"
}
```

### GET /candidate/applications
```json
Response:
{
  "applications": [
    {
      "id": "app_id",
      "jobTitle": "Senior Frontend Developer",
      "company": "Tech Corp",
      "appliedDate": "2024-01-15",
      "status": "Under Review|Interview Scheduled|Rejected|Accepted",
      "timeline": [
        {
          "stage": "Applied",
          "date": "2024-01-15",
          "status": "completed"
        },
        {
          "stage": "Resume Reviewed",
          "date": "2024-01-17",
          "status": "current"
        },
        {
          "stage": "Technical Interview",
          "date": null,
          "status": "pending"
        }
      ]
    }
  ]
}
```

### GET /candidate/bgv-documents
```json
Response:
{
  "documents": [
    {
      "id": "doc_id",
      "name": "Identity Proof",
      "type": "identity",
      "uploaded": true,
      "uploadDate": "2024-01-10",
      "status": "Approved|Pending|Rejected",
      "fileName": "aadhaar_card.pdf",
      "url": "https://storage.../...",
      "remarks": "..." // if rejected
    }
  ]
}
```

### POST /candidate/bgv-documents
```json
Request: (multipart/form-data)
{
  "type": "identity",
  "file": <File>
}

Response:
{
  "success": true,
  "document": { /* document object */ }
}
```

## 🏢 Employer Endpoints

### GET /employer/dashboard
```json
Response:
{
  "stats": {
    "activeJobs": 8,
    "totalApplicants": 234,
    "underReview": 45,
    "shortlisted": 18
  },
  "recentApplicants": [
    {
      "id": "applicant_id",
      "name": "John Doe",
      "position": "Senior Frontend Developer",
      "appliedDate": "2024-01-20",
      "status": "New"
    }
  ]
}
```

### POST /employer/jobs
```json
Request:
{
  "title": "Senior Frontend Developer",
  "type": "fulltime",
  "location": "San Francisco, CA",
  "workMode": "remote",
  "minSalary": 120000,
  "maxSalary": 150000,
  "experience": "5-7 years",
  "cgpaRequired": 7.5,
  "description": "...",
  "skills": ["React", "TypeScript"],
  "visibility": "public"
}

Response:
{
  "success": true,
  "job": { /* job object with id */ }
}
```

### GET /employer/jobs
```json
Response:
{
  "active": [
    {
      "id": "job_id",
      "title": "...",
      "applicants": 45,
      "views": 320,
      "status": "Active",
      "postedDate": "2024-01-15"
    }
  ],
  "closed": [...]
}
```

### GET /employer/jobs/:id/applicants
```json
Response:
{
  "applicants": [
    {
      "id": "applicant_id",
      "name": "John Doe",
      "email": "john@example.com",
      "appliedDate": "2024-01-15",
      "status": "New|Reviewed|Shortlisted|Rejected",
      "resume": "https://...",
      "profile": { /* candidate profile */ }
    }
  ]
}
```

### PUT /employer/jobs/:jobId/applicants/:applicantId
```json
Request:
{
  "status": "Shortlisted",
  "notes": "..."
}

Response:
{
  "success": true
}
```

## 👨‍💼 Admin Endpoints

### GET /admin/dashboard
```json
Response:
{
  "stats": {
    "pendingApprovals": 15,
    "totalCandidates": 1234,
    "totalEmployers": 89,
    "supportTickets": 23
  },
  "pendingApprovals": [
    {
      "type": "Company|Job|BGV",
      "name": "...",
      "item": "...",
      "date": "2024-01-20"
    }
  ]
}
```

### POST /admin/approve/:type/:id
```json
Request:
{
  "approved": true,
  "remarks": "..." // if rejected
}

Response:
{
  "success": true
}
```

### GET /admin/candidates
Query: `?status=pending&page=1&perPage=20`

```json
Response:
{
  "candidates": [
    {
      "id": "...",
      "name": "...",
      "email": "...",
      "profileStatus": "...",
      "bgvStatus": "..."
    }
  ]
}
```

## 👑 Super Admin Endpoints

### GET /superadmin/dashboard
```json
Response:
{
  "metrics": {
    "totalUsers": 12456,
    "activeJobs": 845,
    "companies": 234,
    "applications": 45678
  },
  "trends": {
    "users": "+12%",
    "jobs": "+8%",
    "companies": "+15%",
    "applications": "-3%"
  },
  "recentActivity": [
    {
      "action": "...",
      "entity": "...",
      "time": "..."
    }
  ]
}
```

### GET /superadmin/users
Query: `?role=candidate|employer|admin&page=1&perPage=20`

```json
Response:
{
  "users": [
    {
      "id": "...",
      "name": "...",
      "email": "...",
      "role": "...",
      "status": "active|suspended",
      "createdAt": "..."
    }
  ]
}
```

## 📦 File Upload

### POST /upload
```
Content-Type: multipart/form-data

Request:
- file: <File>
- type: "resume"|"bgv"|"logo"

Response:
{
  "success": true,
  "url": "https://storage.../filename.pdf",
  "fileName": "filename.pdf",
  "fileSize": 123456
}
```

## 🔔 Notifications

### GET /notifications
```json
Response:
{
  "notifications": [
    {
      "id": "notif_id",
      "title": "New Job Match",
      "message": "...",
      "type": "info|success|warning",
      "read": false,
      "createdAt": "2024-01-20"
    }
  ],
  "unreadCount": 5
}
```

### PUT /notifications/:id/read
```json
Response:
{
  "success": true
}
```

## ⚠️ Error Responses

All error responses should follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // optional
  }
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

## 🔄 Integration Points in Code

### Example: Login Integration

**Current (Mock):**
```javascript
// src/pages/auth/Login.jsx
const handleSubmit = (e) => {
  e.preventDefault();
  navigate(roleRoutes[formData.role]);
};
```

**With Backend:**
```javascript
import axios from 'axios';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('/api/auth/login', {
      email: formData.email,
      password: formData.password
    });
    
    const { token, user } = response.data;
    
    // Store token
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Navigate based on role
    const roleRoutes = {
      candidate: '/candidate/dashboard',
      employer: '/employer/dashboard',
      admin: '/admin/dashboard',
      superadmin: '/superadmin/dashboard'
    };
    
    navigate(roleRoutes[user.role]);
  } catch (error) {
    // Show error message
    setError(error.response?.data?.error?.message || 'Login failed');
  }
};
```

### Example: Job Search Integration

**Current (Mock):**
```javascript
const jobs = [/* mock data */];
```

**With Backend:**
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs', {
        params: {
          search: searchQuery,
          location: filters.location,
          minSalary: filters.minSalary,
          cgpa: filters.cgpa,
          skills: filters.skills.join(',')
        }
      });
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchJobs();
}, [searchQuery, filters]);
```

## 🛠️ Recommended Packages

```json
{
  "axios": "^1.6.0", // HTTP client
  "react-query": "^3.39.0", // Data fetching & caching
  "formik": "^2.4.0", // Form handling
  "yup": "^1.3.0", // Validation
  "dayjs": "^1.11.0" // Date formatting
}
```

## 🔐 Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:3000/api
VITE_UPLOAD_URL=http://localhost:3000/upload
VITE_WS_URL=ws://localhost:3000
```

## 📝 Notes

1. **Authentication**: Implement JWT token refresh mechanism
2. **File Uploads**: Use multipart/form-data for file uploads
3. **Pagination**: Implement cursor-based or offset-based pagination
4. **Caching**: Use React Query for efficient data caching
5. **Error Handling**: Implement global error handler
6. **Loading States**: Show spinners during API calls
7. **Optimistic Updates**: Update UI before API confirmation where appropriate

## 🧪 Testing APIs

Use tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)

Example Postman collection available in `/docs/postman/`.

---

**For Questions**: Contact frontend team lead
**Last Updated**: February 2, 2026
