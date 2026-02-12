// Student Mock Data
export const studentUsers = [
    {
        id: 'student_1',
        email: 'student@college.edu',
        role: 'student',
        name: 'Rahul Sharma',
        rollNumber: 'CS2021001',
        department: 'Computer Science',
        year: '3rd Year',
        semester: '6th',
        cgpa: 8.5,
        phone: '+91 98765 43210',
        avatar: null,
        achievements: [],
        groups: ['group_1', 'group_2'],
        courses: ['CS301', 'CS302', 'CS303'],
    },
];

export const facultyUsers = [
    {
        id: 'faculty_1',
        email: 'faculty@college.edu',
        role: 'faculty',
        name: 'Dr. Priya Mehta',
        employeeId: 'FAC2020001',
        department: 'Computer Science',
        designation: 'Associate Professor',
        specialization: 'Artificial Intelligence',
        phone: '+91 98765 12345',
        email: 'priya.mehta@college.edu',
        courses: ['CS301', 'CS401'],
        mentees: ['student_1', 'student_2'],
    },
];

export const announcements = [
    {
        id: 'ann_1',
        title: 'Mid-Semester Exams Schedule Released',
        content: 'The mid-semester examination schedule for all departments has been released. Please check the academic portal for your timetable.',
        author: 'Dr. Priya Mehta',
        authorRole: 'faculty',
        department: 'Computer Science',
        date: '2024-02-05',
        priority: 'high',
        reactions: { like: 45, love: 12, celebrate: 8 },
        readBy: [],
    },
    {
        id: 'ann_2',
        title: 'Tech Fest 2024 Registration Open',
        content: 'Registration for Tech Fest 2024 is now open! Participate in coding competitions, hackathons, and technical workshops. Last date: Feb 20th.',
        author: 'Student Council',
        authorRole: 'admin',
        department: 'All',
        date: '2024-02-04',
        priority: 'medium',
        reactions: { like: 89, love: 34, celebrate: 56 },
        readBy: [],
    },
    {
        id: 'ann_3',
        title: 'Library Hours Extended',
        content: 'The central library will remain open until 11 PM during exam season. Additional study spaces have been arranged.',
        author: 'Library Administration',
        authorRole: 'admin',
        department: 'All',
        date: '2024-02-03',
        priority: 'low',
        reactions: { like: 123, love: 45 },
        readBy: [],
    },
];

export const polls = [
    {
        id: 'poll_1',
        question: 'Which topic should we cover in the next workshop?',
        options: [
            { id: 'opt_1', text: 'Machine Learning', votes: 45 },
            { id: 'opt_2', text: 'Web Development', votes: 67 },
            { id: 'opt_3', text: 'Mobile App Development', votes: 34 },
            { id: 'opt_4', text: 'Cloud Computing', votes: 28 },
        ],
        createdBy: 'Dr. Priya Mehta',
        department: 'Computer Science',
        status: 'active',
        endDate: '2024-02-10',
        votedBy: [],
    },
    {
        id: 'poll_2',
        question: 'Preferred time for extra classes?',
        options: [
            { id: 'opt_1', text: 'Early Morning (7-8 AM)', votes: 12 },
            { id: 'opt_2', text: 'Evening (5-6 PM)', votes: 89 },
            { id: 'opt_3', text: 'Weekend', votes: 45 },
        ],
        createdBy: 'Faculty Association',
        department: 'All',
        status: 'active',
        endDate: '2024-02-08',
        votedBy: [],
    },
];

export const achievements = [
    {
        id: 'ach_1',
        studentId: 'student_1',
        studentName: 'Rahul Sharma',
        title: 'Won First Prize in National Hackathon',
        description: 'Developed an AI-powered healthcare solution that won first prize at the National Innovation Hackathon 2024.',
        improvedDescription: 'Achieved first place at the prestigious National Innovation Hackathon 2024 by developing a cutting-edge AI-powered healthcare solution that addresses critical challenges in patient care and medical diagnostics.',
        category: 'Competition',
        date: '2024-01-28',
        toxicityScore: 0.05,
        status: 'approved',
        likes: 234,
        comments: [],
    },
    {
        id: 'ach_2',
        studentId: 'student_2',
        studentName: 'Priya Singh',
        title: 'Published Research Paper',
        description: 'Co-authored a research paper on quantum computing published in IEEE journal.',
        improvedDescription: 'Co-authored a groundbreaking research paper on quantum computing algorithms, successfully published in the prestigious IEEE journal, contributing to advancements in computational theory.',
        category: 'Research',
        date: '2024-01-25',
        toxicityScore: 0.02,
        status: 'approved',
        likes: 189,
        comments: [],
    },
];

export const groups = [
    {
        id: 'group_1',
        name: 'AI & ML Enthusiasts',
        description: 'A community for students interested in Artificial Intelligence and Machine Learning',
        category: 'Technical',
        members: ['student_1', 'student_2', 'student_3'],
        mentors: ['faculty_1'],
        posts: [
            {
                id: 'post_1',
                author: 'Rahul Sharma',
                content: 'Check out this amazing tutorial on neural networks!',
                link: 'https://example.com/tutorial',
                date: '2024-02-05',
                likes: 23,
            },
        ],
        files: [
            { id: 'file_1', name: 'ML_Notes.pdf', uploadedBy: 'Dr. Priya Mehta', date: '2024-02-01' },
        ],
        status: 'active',
        pendingRequests: ['student_4', 'student_5'],
    },
    {
        id: 'group_2',
        name: 'Web Development Club',
        description: 'Learn and build amazing web applications together',
        category: 'Technical',
        members: ['student_1', 'student_6', 'student_7'],
        mentors: ['faculty_2'],
        posts: [],
        files: [],
        status: 'active',
        pendingRequests: [],
    },
];

export const leaveApplications = [
    {
        id: 'leave_1',
        studentId: 'student_1',
        studentName: 'Rahul Sharma',
        rollNumber: 'CS2021001',
        leaveType: 'Medical',
        startDate: '2024-02-10',
        endDate: '2024-02-12',
        days: 3,
        reason: 'Medical treatment required',
        attachments: ['medical_certificate.pdf'],
        status: 'pending',
        appliedDate: '2024-02-05',
        reviewedBy: null,
        reviewDate: null,
        comments: null,
    },
    {
        id: 'leave_2',
        studentId: 'student_2',
        studentName: 'Priya Singh',
        rollNumber: 'CS2021002',
        leaveType: 'Personal',
        startDate: '2024-02-08',
        endDate: '2024-02-09',
        days: 2,
        reason: 'Family function',
        attachments: [],
        status: 'approved',
        appliedDate: '2024-02-03',
        reviewedBy: 'Dr. Priya Mehta',
        reviewDate: '2024-02-04',
        comments: 'Approved. Please submit assignments before leaving.',
    },
];

export const feedbacks = [
    {
        id: 'fb_1',
        studentId: 'student_1',
        studentName: 'Anonymous',
        courseCode: 'CS301',
        courseName: 'Artificial Intelligence',
        facultyName: 'Dr. Priya Mehta',
        rating: 5,
        feedback: 'Excellent teaching methodology and very helpful during doubt sessions.',
        isAnonymous: true,
        date: '2024-02-01',
        category: 'Course Feedback',
    },
    {
        id: 'fb_2',
        studentId: 'student_2',
        studentName: 'Priya Singh',
        courseCode: 'CS302',
        courseName: 'Database Management',
        facultyName: 'Dr. Amit Kumar',
        rating: 4,
        feedback: 'Good content coverage but need more practical sessions.',
        isAnonymous: false,
        date: '2024-01-30',
        category: 'Course Feedback',
    },
];

export const chats = [
    {
        id: 'chat_1',
        type: 'one-to-one',
        participants: ['student_1', 'student_2'],
        participantNames: ['Rahul Sharma', 'Priya Singh'],
        messages: [
            {
                id: 'msg_1',
                senderId: 'student_2',
                text: 'Hey! Did you complete the AI assignment?',
                timestamp: '2024-02-05T10:30:00',
            },
            {
                id: 'msg_2',
                senderId: 'student_1',
                text: 'Yes, just submitted it. How about you?',
                timestamp: '2024-02-05T10:32:00',
            },
            {
                id: 'msg_3',
                senderId: 'student_2',
                text: 'Working on it. Can you help with the neural network part?',
                timestamp: '2024-02-05T10:35:00',
            },
        ],
        lastMessage: 'Working on it. Can you help with the neural network part?',
        lastMessageTime: '2024-02-05T10:35:00',
        unreadCount: 1,
    },
    {
        id: 'chat_2',
        type: 'group',
        groupId: 'group_1',
        groupName: 'AI & ML Enthusiasts',
        participants: ['student_1', 'student_2', 'student_3', 'faculty_1'],
        messages: [
            {
                id: 'msg_1',
                senderId: 'faculty_1',
                senderName: 'Dr. Priya Mehta',
                text: 'I have uploaded the lecture notes for today\'s class.',
                timestamp: '2024-02-05T14:00:00',
            },
            {
                id: 'msg_2',
                senderId: 'student_1',
                senderName: 'Rahul Sharma',
                text: 'Thank you, ma\'am!',
                timestamp: '2024-02-05T14:05:00',
            },
        ],
        lastMessage: 'Thank you, ma\'am!',
        lastMessageTime: '2024-02-05T14:05:00',
        unreadCount: 0,
    },
];

export const studentDirectory = [
    {
        id: 'student_1',
        name: 'Rahul Sharma',
        rollNumber: 'CS2021001',
        department: 'Computer Science',
        year: '3rd Year',
        email: 'rahul.sharma@college.edu',
        phone: '+91 98765 43210',
        interests: ['AI', 'ML', 'Web Development'],
    },
    {
        id: 'student_2',
        name: 'Priya Singh',
        rollNumber: 'CS2021002',
        department: 'Computer Science',
        year: '3rd Year',
        email: 'priya.singh@college.edu',
        phone: '+91 98765 43211',
        interests: ['Quantum Computing', 'Research'],
    },
    {
        id: 'student_3',
        name: 'Amit Patel',
        rollNumber: 'CS2021003',
        department: 'Computer Science',
        year: '3rd Year',
        email: 'amit.patel@college.edu',
        phone: '+91 98765 43212',
        interests: ['Mobile Development', 'UI/UX'],
    },
];

export const toxicKeywords = [
    'hate', 'stupid', 'idiot', 'dumb', 'worst', 'terrible',
    'awful', 'horrible', 'disgusting', 'pathetic', 'useless',
    'trash', 'garbage', 'crap', 'sucks', 'loser'
];

export const calculateToxicityScore = (text) => {
    const lowerText = text.toLowerCase();
    let score = 0;

    toxicKeywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            score += 0.15;
        }
    });

    return Math.min(score, 1.0);
};

export const improveAchievementText = (text) => {
    // Simple AI improvement simulation
    const improvements = {
        'won': 'achieved',
        'got': 'secured',
        'made': 'developed',
        'did': 'accomplished',
        'good': 'excellent',
        'nice': 'outstanding',
    };

    let improved = text;
    Object.keys(improvements).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        improved = improved.replace(regex, improvements[word]);
    });

    return improved;
};

export const studentDashboardStats = {
    cgpa: 8.5,
    attendance: 87,
    achievements: 5,
    groups: 3,
    pendingAssignments: 2,
    upcomingExams: 1,
};

export const facultyDashboardStats = {
    totalStudents: 120,
    courses: 3,
    pendingLeaves: 5,
    groupRequests: 3,
    feedbackReceived: 45,
    averageRating: 4.5,
};
