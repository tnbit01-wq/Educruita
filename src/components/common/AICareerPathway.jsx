import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, AcademicCapIcon, RocketLaunchIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Card from './Card';

const AICareerPathway = () => {
    const [isExpanding, setIsExpanding] = useState(false);

    const recommendations = [
        { title: 'Complete Docker Certification', reason: 'High demand for Cloud-native skills in your area.', difficulty: 'Medium' },
        { title: 'Apply for Fintech Internship', reason: 'Matches your interest in Java and Spring Boot.', difficulty: 'High' },
    ];

    return (
        <Card className="border-emerald-100 bg-emerald-50/20 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-3 text-emerald-600">
                        <SparklesIcon className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">AI Career Pathway</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Personalized for Rahul</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {recommendations.map((rec, i) => (
                    <div key={i} className="p-3 bg-white border border-gray-100 rounded-xl hover:border-emerald-300 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-emerald-700 mb-1 flex items-center">
                                    <RocketLaunchIcon className="w-3 h-3 mr-1" />
                                    {rec.title}
                                </h4>
                                <p className="text-[11px] text-gray-600 leading-relaxed italic">"{rec.reason}"</p>
                            </div>
                            <div className="text-right ml-3">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${rec.difficulty === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {rec.difficulty}
                                </span>
                                <div className="mt-2 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRightIcon className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                            <AcademicCapIcon className="w-3 h-3 text-gray-400" />
                        </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-600">
                        +8
                    </div>
                </div>
                <p className="text-[10px] font-medium text-emerald-600 hover:underline cursor-pointer">
                    Explore full roadmap
                </p>
            </div>
        </Card>
    );
};

export default AICareerPathway;
