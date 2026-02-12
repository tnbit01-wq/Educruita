import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useToast } from '../../contexts/ToastContext';
import { feedbacks } from '../../services/campusMockData';
import { StarIcon, FunnelIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const FacultyFeedback = () => {
    const [filter, setFilter] = useState('all');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const toast = useToast();

    const handleReply = (id) => {
        if (!replyText.trim()) return;
        toast.success("Reply sent successfully");
        setReplyingTo(null);
        setReplyText('');
    };

    const filteredFeedbacks = feedbacks.filter(fb => {
        if (filter === 'all') return true;
        if (filter === 'high') return fb.rating >= 4;
        if (filter === 'low') return fb.rating <= 3;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Student Feedback</h1>
                <div className="flex items-center space-x-2">
                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-1 border"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Ratings</option>
                        <option value="high">High Rated (4-5)</option>
                        <option value="low">Low Rated (1-3)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFeedbacks.map((fb) => (
                    <Card key={fb.id} hover className="border-l-4 border-l-emerald-500 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-900">{fb.courseName}</h3>
                                <p className="text-xs text-gray-500">{fb.date}</p>
                            </div>
                            <div className="flex bg-yellow-50 px-2 py-1 rounded-md">
                                {[...Array(5)].map((_, i) => (
                                    <StarIconSolid key={i} className={`h-4 w-4 ${i < fb.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-700 italic my-3 flex-grow">"{fb.feedback}"</p>

                        <div className="pt-4 border-t border-gray-100 mt-auto">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-gray-400">
                                    — {fb.isAnonymous ? 'Anonymous Student' : fb.studentName}
                                </span>
                                <button
                                    onClick={() => setReplyingTo(replyingTo === fb.id ? null : fb.id)}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <ChatBubbleBottomCenterTextIcon className="h-4 w-4 mr-1" />
                                    {replyingTo === fb.id ? 'Cancel Reply' : 'Reply'}
                                </button>
                            </div>

                            {replyingTo === fb.id && (
                                <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                                    <textarea
                                        className="w-full text-sm p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        rows="2"
                                        placeholder="Write a response..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end mt-2">
                                        <Button size="sm" onClick={() => handleReply(fb.id)}>Send</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FacultyFeedback;
