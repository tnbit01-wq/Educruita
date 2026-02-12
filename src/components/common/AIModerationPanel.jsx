import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, EyeIcon, CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import Badge from './Badge';

const AIModerationPanel = () => {
    const [scannedItems, setScannedItems] = useState([
        { id: 1, type: 'Job Post', content: 'Urgent hiring today. Contact via WhatsApp.', risk: 'High', flags: ['Urgent hiring', 'WhatsApp'] },
        { id: 2, type: 'Comment', content: 'This is a useless post.', risk: 'Medium', flags: ['Toxicity'] },
        { id: 3, type: 'Profile', content: 'Software Engineer from ABC Corp.', risk: 'Low', flags: [] },
    ]);

    return (
        <Card title="AI Content Guard" className="border-red-100 bg-red-50/10">
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-500">Live AI moderation and scam detection across the platform.</p>
                <div className="flex items-center text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5 "></span>
                    REALTIME SCANNING
                </div>
            </div>

            <div className="space-y-3">
                {scannedItems.map((item) => (
                    <div key={item.id} className="p-3 bg-white border border-gray-100 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${item.risk === 'High' ? 'bg-red-50 text-red-600' :
                                    item.risk === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                                }`}>
                                {item.risk === 'High' ? <ExclamationTriangleIcon className="w-4 h-4" /> : <ShieldCheckIcon className="w-4 h-4" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-900">{item.type}</span>
                                    <Badge variant={item.risk === 'High' ? 'danger' : item.risk === 'Medium' ? 'warning' : 'success'} size="xs">
                                        {item.risk} Risk
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{item.content}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-800">Review</button>
                            <button className="text-xs font-bold text-red-600 hover:text-red-800" onClick={() => setScannedItems(prev => prev.filter(i => i.id !== item.id))}>Dismiss</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-red-50 flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Blocked Today</p>
                        <p className="text-xl font-bold text-red-600">12</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Accuracy Rate</p>
                        <p className="text-xl font-bold text-emerald-600">98.4%</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-gray-500 hover:text-gray-700 underline flex items-center">
                    View AI Logs
                </button>
            </div>
        </Card>
    );
};

export default AIModerationPanel;
