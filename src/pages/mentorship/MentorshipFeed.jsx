import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateFeedItem, analyzeContent } from '../../services/aiMockService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import AITextEnhancer from '../../components/common/AITextEnhancer';

import {
    HandThumbUpIcon,
    ChatBubbleLeftIcon,
    BookmarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const MentorshipFeed = () => {
    const [feed, setFeed] = useState([
        {
            id: 101,
            type: "tech_news",
            title: "Open source LLM adoption grows in startups",
            industry: "AI",
            author: "Industry Analyst",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            likes: 45,
            comments: 12
        },
        {
            id: 102,
            type: "mentorship",
            mentorName: "Anita Sharma",
            role: "Senior Backend Engineer",
            company: "FinTech SaaS",
            topic: "Scaling Node.js services for millions of users",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            likes: 128,
            comments: 34
        }
    ]);

    // Simulated Realtime Updates
    useEffect(() => {
        const interval = setInterval(() => {
            const newItem = generateFeedItem(Date.now());
            setFeed(prev => [newItem, ...prev].slice(0, 50)); // Keep max 50 items
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, []);

    // Post Creation & Moderation State
    const [newPost, setNewPost] = useState("");
    const [moderationResult, setModerationResult] = useState(null);

    const handlePostChange = (e) => {
        const text = e.target.value;
        setNewPost(text);

        // Realtime Moderation Check
        if (text.length > 5) {
            const result = analyzeContent(text);
            if (result.toxicityScore > 0.2) {
                setModerationResult(result);
            } else {
                setModerationResult(null);
            }
        }
    };

    const handlePublish = () => {
        if (!newPost.trim()) return;
        if (moderationResult && !moderationResult.isSafe) {
            alert("Please revise your post before publishing.");
            return;
        }

        const post = {
            id: Date.now(),
            type: "mentorship",
            mentorName: "You (Student)",
            role: "Aspiring Dev",
            topic: newPost,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: 0
        };

        setFeed(prev => [post, ...prev]);
        setNewPost("");
        setModerationResult(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-100px)]">
            {/* Left Sidebar: Filters */}
            <div className="hidden lg:block space-y-6">
                <Card>
                    <h3 className="font-bold text-gray-900 mb-4">Filters</h3>
                    <div className="space-y-2">
                        {['All Updates', 'Mentorship', 'Tech News', 'Jobs'].map(f => (
                            <div key={f} className="flex items-center text-gray-600 hover:text-emerald-600 cursor-pointer p-2 rounded hover:bg-emerald-50">
                                <span className={`w-3 h-3 rounded-full mr-3 ${f === 'All Updates' ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                {f}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Center: Feed */}
            <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2">
                {/* Post Creator */}
                <Card className="border-emerald-100 shadow-sm">
                    <textarea
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        rows="3"
                        placeholder="Share your learning milestone or ask a question..."
                        value={newPost}
                        onChange={handlePostChange}
                    />
                    <AITextEnhancer
                        text={newPost}
                        onImprove={(val) => setNewPost(val)}
                        type="feed_post"
                    />

                    {/* Moderation Panel */}
                    <AnimatePresence>
                        {moderationResult && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 text-sm"
                            >
                                <div className={`p-3 rounded-lg flex items-start ${moderationResult.isSafe ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {moderationResult.isSafe ? (
                                        <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                    ) : (
                                        <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                    )}
                                    <div>
                                        <p className="font-semibold">{moderationResult.isSafe ? "Looks good!" : "Content Flagged"}</p>
                                        {!moderationResult.isSafe && (
                                            <div className="mt-1">
                                                <p>Flags: {moderationResult.flaggedWords.join(", ")}</p>
                                                {moderationResult.improvedText && (
                                                    <p className="mt-2 italic bg-white/50 p-2 rounded">
                                                        {moderationResult.improvedText}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-3 flex justify-end">
                        <Button onClick={handlePublish} disabled={moderationResult && !moderationResult.isSafe} className="bg-emerald-600">
                            Post Update
                        </Button>
                    </div>
                </Card>

                {/* Feed Items */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {feed.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card hover className="cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                {(item.mentorName || item.author || "U").charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{item.mentorName || item.author}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {item.role || item.industry} • {new Date(item.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={item.type === 'tech_news' ? 'primary' : 'success'} size="sm">
                                            {item.type === 'tech_news' ? 'News' : 'Mentorship'}
                                        </Badge>
                                    </div>

                                    <div className="mt-3">
                                        <h3 className="text-lg font-medium text-gray-800">{item.title || item.topic}</h3>
                                        <p className="text-gray-600 mt-1 line-clamp-2">
                                            {item.type === 'tech_news'
                                                ? 'Latest industry updates showing significant growth in this sector...'
                                                : 'Join this discussion to learn more about industry best practices and practical tips.'}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center gap-6 text-gray-500 text-sm border-t pt-3">
                                        <button className="flex items-center hover:text-emerald-600 transition-colors">
                                            <HandThumbUpIcon className="h-5 w-5 mr-1" />
                                            {item.likes} Likes
                                        </button>
                                        <button className="flex items-center hover:text-blue-600 transition-colors">
                                            <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                                            {item.comments} Comments
                                        </button>
                                        <div className="flex-1"></div>
                                        <button className="hover:text-gray-900">
                                            <BookmarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Panel: Trending */}
            <div className="hidden lg:block space-y-6">
                <Card>
                    <h3 className="font-bold text-gray-900 mb-4">Trending Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {['#React', '#AI', '#SystemDesign', '#RemoteWork', '#NodeJS'].map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                    <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
                    <p className="text-indigo-100 text-sm mb-4">Get unlimited AI mock interviews and priority mentorship.</p>
                    <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
                        Try Pro Free
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default MentorshipFeed;
