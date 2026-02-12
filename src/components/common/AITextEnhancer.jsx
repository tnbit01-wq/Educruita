import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { analyzeContent } from '../../services/aiMockService';
import Button from './Button';

const AITextEnhancer = ({ text, onImprove, type = 'general' }) => {
    const [isImproving, setIsImproving] = useState(false);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [suggestion, setSuggestion] = useState('');

    const handleImprove = () => {
        if (!text || text.trim().length < 5) return;

        setIsImproving(true);

        // Simulate AI thinking time
        setTimeout(() => {
            const result = analyzeContent(text);
            // In a real app, 'type' would be sent to the LLM to contextually improve
            // Here we just use our mock service's improvement logic
            const enhanced = result.improvedText?.replace('[Suggested Revision]: ', '') || text;
            setSuggestion(enhanced);
            setIsImproving(false);
            setShowSuggestion(true);
        }, 1000);
    };

    const handleApply = () => {
        onImprove(suggestion);
        setShowSuggestion(false);
    };

    return (
        <div className="mt-2">
            {!showSuggestion ? (
                <button
                    onClick={handleImprove}
                    disabled={isImproving || !text || text.trim().length < 5}
                    className="flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50 transition-colors"
                    type="button"
                >
                    {isImproving ? (
                        <>
                            <ArrowPathIcon className="w-3.5 h-3.5 mr-1 animate-spin" />
                            AI Analyzing...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-3.5 h-3.5 mr-1" />
                            Improve with AI
                        </>
                    )}
                </button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mt-2"
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center">
                            <SparklesIcon className="w-3 h-3 mr-1" />
                            AI Suggestion
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSuggestion(false)}
                                className="text-[10px] font-medium text-gray-500 hover:text-gray-700"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleApply}
                                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center"
                            >
                                <CheckIcon className="w-3 h-3 mr-0.5" />
                                Apply
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{suggestion}"</p>
                </motion.div>
            )}
        </div>
    );
};

export default AITextEnhancer;
