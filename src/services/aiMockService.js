// AI Simulation Service - Handles simulated AI behaviors client-side

// 1. Chat Response Logic
export const generateChatResponse = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes('rest') && text.includes('graphql')) {
        return "REST uses multiple endpoints (one per resource), whereas GraphQL uses a single endpoint. GraphQL allows clients to request exactly the data they need, preventing over-fetching.";
    }
    if (text.includes('salary') || text.includes('pay')) {
        return "Salaries vary by role and location. In our specific mock data, Senior Devs range from ₹10L - ₹15L, while entry-level roles start around ₹5L - ₹8L.";
    }
    if (text.includes('hello') || text.includes('hi')) {
        return "Hello! I am your AI Career Assistant. Ask me about job trends, tech stacks, or interview prep!";
    }
    if (text.includes('interview')) {
        return "For interviews, focus on DSA (Data Structures & Algorithms) for big tech, and practical framework knowledge (React/Node) for startups.";
    }

    return "That's an interesting topic! Could you elaborate more so I can provide a specific answer related to your career?";
};

// 2. Content Moderation Logic
export const analyzeContent = (text) => {
    const toxicKeywords = ["stupid", "idiot", "useless", "dumb", "hate", "trash"];
    const lowerText = text.toLowerCase();

    const flaggedWords = toxicKeywords.filter(word => lowerText.includes(word));
    const isToxic = flaggedWords.length > 0;

    // Simple mock improvement engine
    let improvedText = text;
    if (isToxic) {
        improvedText = improvedText
            .replace(/stupid/gi, "unclear")
            .replace(/idiot/gi, "uninformed")
            .replace(/useless/gi, "ineffective")
            .replace(/trash/gi, "subpar")
            .replace(/dumb/gi, "overlooked")
            .replace(/hate/gi, "disagree with");

        improvedText = `[Suggested Revision]: ${improvedText}`;
    }

    return {
        toxicityScore: isToxic ? (0.5 + (flaggedWords.length * 0.15)) : 0.1, // Mock score logic
        flaggedWords,
        improvedText: isToxic ? improvedText : null,
        isSafe: !isToxic
    };
};

// 3. Job Authenticity Scoring
export const checkJobAuthenticity = (jobData) => {
    let score = 100;
    let flags = [];
    const scamKeywords = ["pay registration fee", "whatsapp only", "urgent hiring today", "no interview", "easy money"];

    // Check 1: Missing Salary
    if (!jobData.salary || jobData.salary.length < 2) {
        score -= 20;
        flags.push("Missing salary range");
    }

    // Check 2: High Risk Keywords
    const foundScams = scamKeywords.filter(k =>
        (jobData.description?.toLowerCase() || "").includes(k) ||
        (jobData.title?.toLowerCase() || "").includes(k)
    );

    if (foundScams.length > 0) {
        score -= 30 * foundScams.length;
        flags.push(`Uses high risk keywords: "${foundScams.join(', ')}"`);
    }

    // Check 3: Short/Vague Description
    if ((jobData.description?.length || 0) < 50) {
        score -= 15;
        flags.push("Description is suspiciously short");
    }

    // Check 4: Unprofessional Company Name
    if (!jobData.company || jobData.company.toLowerCase().includes("generic")) {
        score -= 10;
        flags.push("Company name appears generic");
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    let riskLevel = 'Low';
    if (score < 50) riskLevel = 'High';
    else if (score < 80) riskLevel = 'Medium';

    return {
        score,
        riskLevel,
        flags
    };
};

// 4. Feed Data Generator
export const generateFeedItem = (id) => {
    const types = ['tech_news', 'mentorship'];
    const type = types[Math.floor(Math.random() * types.length)];
    const industries = ['AI', 'Web3', 'Cloud', 'SaaS', 'Mobile'];

    if (type === 'tech_news') {
        return {
            id,
            type,
            title: `Breaking: ${industries[Math.floor(Math.random() * industries.length)]} adoption rises by 20% in Q1`,
            industry: 'Tech',
            author: 'TechCrunch Bot',
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: 0
        };
    } else {
        return {
            id,
            type,
            mentorName: ['Anita Sharma', 'John Doe', 'Priya Singh'][Math.floor(Math.random() * 3)],
            role: 'Senior Tech Lead',
            company: 'MNC Corp',
            topic: `Tips for Mastering ${['React', 'System Design', 'Leadership', 'Negotiation'][Math.floor(Math.random() * 4)]}`,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: 0
        };
    }
};
