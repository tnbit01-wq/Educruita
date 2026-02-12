import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
    TrophyIcon,
    SparklesIcon,
    HandThumbUpIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { achievements, improveAchievementText, calculateToxicityScore } from '../../services/campusMockData';

const StudentAchievements = () => {
    const [items, setItems] = useState(achievements);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', category: 'Competition' });
    const [improvedText, setImprovedText] = useState('');
    const [isImproving, setIsImproving] = useState(false);
    const [toxicityError, setToxicityError] = useState(null);
    const toast = useToast();

    const handleImproveConfig = async () => {
        if (!formData.description) return;

        setIsImproving(true);
        setToxicityError(null);

        // Simulate AI delay
        setTimeout(() => {
            // Check toxicity first
            const toxicity = calculateToxicityScore(formData.description);
            if (toxicity > 0.3) {
                setToxicityError("We found some negative language. Please revise to be more professional.");
                setIsImproving(false);
                return;
            }

            // Improve text
            const improved = improveAchievementText(formData.description);
            setImprovedText(improved);
            setIsImproving(false);
            toast.success("AI has enhanced your description!");
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            id: `new_${Date.now()}`,
            studentName: 'Rahul Sharma',
            title: formData.title,
            description: improvedText || formData.description,
            category: formData.category,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            likes: 0,
            toxicityScore: 0 // Assumed safe if passed check
        };

        setItems([newItem, ...items]);
        setShowForm(false);
        setFormData({ title: '', description: '', category: 'Competition' });
        setImprovedText('');
        toast.success("Achievement posted successfully!");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
                    <p className="text-gray-600 mt-1">Showcase your awards and milestones</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Post Achievement'}
                </Button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="border-emerald-100 bg-emerald-50/30">
                            <h2 className="text-lg font-semibold mb-4">Add New Achievement</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Won 1st Prize in Hackathon"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe what you achieved..."
                                        />
                                        <div className="mt-2 text-right">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={handleImproveConfig}
                                                disabled={!formData.description || isImproving}
                                                className="text-emerald-600 border-emerald-200"
                                            >
                                                {isImproving ? (
                                                    <span className="flex items-center"><SparklesIcon className="w-4 h-4 mr-1 animate-spin" /> Enhancing...</span>
                                                ) : (
                                                    <span className="flex items-center"><SparklesIcon className="w-4 h-4 mr-1" /> Enhance with AI</span>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* AI Preview Area */}
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <SparklesIcon className="w-4 h-4 inline mr-1 text-emerald-500" />
                                            AI Suggestion
                                        </label>

                                        {toxicityError ? (
                                            <div className="text-red-500 text-sm flex items-start bg-red-50 p-3 rounded">
                                                <ExclamationTriangleIcon className="w-5 h-5 mr-2 shrink-0" />
                                                {toxicityError}
                                            </div>
                                        ) : improvedText ? (
                                            <div className="text-gray-800 text-sm italic bg-emerald-50 p-3 rounded border border-emerald-100 animate-in fade-in">
                                                "{improvedText}"
                                                <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center">
                                                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                                                    Enhanced for professional impact
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 text-sm text-center py-6">
                                                Click "Enhance with AI" to improved your description
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" disabled={isImproving || toxicityError}>
                                        Post to Profile
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
                {items.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card hover>
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${item.category === 'Competition' ? 'bg-yellow-100 text-yellow-600' :
                                        item.category === 'Research' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    <TrophyIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                            <span className="text-xs text-gray-500">{item.date} • {item.category}</span>
                                        </div>
                                        <Badge variant={item.status === 'approved' ? 'success' : 'warning'}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 mt-2 text-sm">{item.description}</p>

                                    <div className="mt-4 flex items-center gap-4 border-t pt-3">
                                        <button className="flex items-center text-sm text-gray-500 hover:text-emerald-600">
                                            <HandThumbUpIcon className="h-4 w-4 mr-1" />
                                            {item.likes} Likes
                                        </button>
                                        <button className="text-sm text-gray-500 hover:text-emerald-600">
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StudentAchievements;
