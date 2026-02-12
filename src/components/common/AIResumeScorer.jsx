import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, CheckCircleIcon, ExclamationCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import Button from './Button';

const AIResumeScorer = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setResult({
                score: 84,
                feedback: [
                    { type: 'success', text: 'Strong action verbs used in experience section.' },
                    { type: 'warning', text: 'Consider adding more quantifiable metrics to your projects.' },
                    { type: 'success', text: 'Clean and readable layout.' },
                    { type: 'warning', text: 'Skills section could be more specific regarding cloud technologies.' }
                ],
                keywordMatch: '72%',
                missingKeywords: ['Docker', 'Kubernetes', 'CI/CD']
            });
            setIsAnalyzing(false);
        }, 2000);
    };

    return (
        <Card className="border-indigo-100 bg-indigo-50/30">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <SparklesIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">AI Resume Insights</h3>
                        <p className="text-xs text-gray-500">Get instant feedback on your resume's impact</p>
                    </div>
                </div>
                {!result && (
                    <Button
                        size="sm"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="bg-indigo-600"
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isAnalyzing ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-8 flex flex-col items-center"
                    >
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium text-gray-600">Our AI is reviewing your experience...</p>
                    </motion.div>
                ) : result ? (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-6 p-4 bg-white rounded-xl shadow-sm border border-indigo-100">
                            <div className="relative h-16 w-16 flex items-center justify-center">
                                <svg className="h-full w-full transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" fill="none" stroke="#f3f4f6" strokeWidth="4"></circle>
                                    <circle cx="32" cy="32" r="28" fill="none" stroke="#4f46e5" strokeWidth="4"
                                        strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * result.score) / 100}
                                        className="transition-all duration-1000 ease-out"
                                    ></circle>
                                </svg>
                                <span className="absolute text-lg font-bold text-indigo-700">{result.score}%</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">Resume Impact Score</p>
                                <p className="text-xs text-gray-500">Your resume is in the top 15% for your role.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Keyword Match</p>
                                <p className="text-xl font-bold text-emerald-600">{result.keywordMatch}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-lg border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Strengths & Tips</p>
                                <ul className="space-y-2">
                                    {result.feedback.map((f, i) => (
                                        <li key={i} className="flex items-start text-xs">
                                            {f.type === 'success' ? (
                                                <CheckCircleIcon className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                                            ) : (
                                                <ExclamationCircleIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                                            )}
                                            <span className={f.type === 'success' ? 'text-gray-700' : 'text-amber-700'}>{f.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Missing Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords.map((k, i) => (
                                        <span key={i} className="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold">
                                            {k}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
                                    Adding these keywords might improve your visibility to recruiters in your target domain.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => setResult(null)}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                            >
                                Reset Analysis
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="p-12 text-center border-2 border-dashed border-indigo-100 rounded-xl">
                        <ChartBarIcon className="w-10 h-10 text-indigo-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Run our AI analysis to see how your resume stacks up against industry standards.</p>
                    </div>
                )}
            </AnimatePresence>
        </Card>
    );
};

export default AIResumeScorer;
