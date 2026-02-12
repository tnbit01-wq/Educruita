import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkJobAuthenticity } from '../../services/aiMockService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';
import TextAreaField from '../../components/forms/TextAreaField';
import { ShieldCheckIcon, ExclamationTriangleIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const JobAuthenticityChecker = () => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        salary: '',
        description: ''
    });
    const [result, setResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear result on edit to encourage re-check
        if (result) setResult(null);
    };

    const handleCheck = () => {
        setIsAnalyzing(true);

        // Simulate processing delay
        setTimeout(() => {
            const analysis = checkJobAuthenticity(formData);
            setResult(analysis);
            setIsAnalyzing(false);
        }, 1200);
    };

    const getRiskColor = (risk) => {
        if (risk === 'High') return 'text-red-600 bg-red-50 border-red-200';
        if (risk === 'Medium') return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-green-600 bg-green-50 border-green-200';
    };

    const fillMockScam = () => {
        setFormData({
            title: "Data Entry Urgent Hiring",
            company: "Generic Tech Services",
            salary: "",
            description: "Work from home. Urgent hiring today. No interview needed. Just pay registration fee of 500 and start working. Contact via WhatsApp only."
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">AI Job Scanner</h1>
                <p className="text-gray-600">Detect potential job scams and verify authenticity using our AI engine.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                    <Card title="Job Details">
                        <div className="space-y-4">
                            <InputField
                                label="Job Title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="e.g. Junior Web Developer"
                            />
                            <InputField
                                label="Company Name"
                                value={formData.company}
                                onChange={(e) => handleInputChange('company', e.target.value)}
                                placeholder="e.g. ABC Tech Solutions"
                            />
                            <InputField
                                label="Salary/Package"
                                value={formData.salary}
                                onChange={(e) => handleInputChange('salary', e.target.value)}
                                placeholder="e.g. ₹5L - ₹8L"
                            />
                            <TextAreaField
                                label="Job Description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Paste the full job description here..."
                                rows={6}
                            />

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={handleCheck}
                                    disabled={isAnalyzing || !formData.description}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    {isAnalyzing ? 'Scanning...' : 'Scan Job Post'}
                                </Button>
                                <Button onClick={fillMockScam} variant="outline" className="text-xs">
                                    Load Mock Scam
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Results Panel */}
                <div>
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Card className={`border-2 ${result.riskLevel === 'High' ? 'border-red-200' : result.riskLevel === 'Medium' ? 'border-amber-200' : 'border-green-200'}`}>
                                    <div className="text-center p-6 border-b border-gray-100">
                                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-gray-50 mb-4 relative">
                                            <svg className="w-24 h-24 transform -rotate-90">
                                                <circle
                                                    cx="48"
                                                    cy="48"
                                                    r="40"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="transparent"
                                                    className="text-gray-200"
                                                />
                                                <circle
                                                    cx="48"
                                                    cy="48"
                                                    r="40"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="transparent"
                                                    strokeDasharray={251.2}
                                                    strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                                                    className={`${result.score > 80 ? 'text-green-500' : result.score > 50 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <span className="text-3xl font-bold text-gray-900">{result.score}</span>
                                                <span className="text-xs text-gray-500">Trust Score</span>
                                            </div>
                                        </div>

                                        <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${getRiskColor(result.riskLevel)}`}>
                                            {result.riskLevel} Risk
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">Analysis Report</h4>
                                        {result.flags.length > 0 ? (
                                            <ul className="space-y-3">
                                                {result.flags.map((flag, idx) => (
                                                    <li key={idx} className="flex items-start text-sm text-gray-700 bg-red-50/50 p-2 rounded">
                                                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                                                        {flag}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-center text-green-600 py-4">
                                                <CheckBadgeIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>No issues found. This job post looks authentic.</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50"
                            >
                                <div className="text-center text-gray-400">
                                    <ShieldCheckIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">Enter job details to scan for authenticity.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default JobAuthenticityChecker;
