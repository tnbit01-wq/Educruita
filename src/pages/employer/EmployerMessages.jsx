import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import InputField from '../../components/forms/InputField';
import Modal from '../../components/modals/Modal';
import {
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    MagnifyingGlassIcon,
    PaperClipIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const EmployerMessages = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerDetails, setOfferDetails] = useState({ salary: '', joiningDate: '' });
    const toast = useToast();

    // Mock Templates
    const templates = [
        { id: 1, name: 'Interview Invite', text: "Hi [Name], we'd like to schedule an interview with you. Please let us know your availability for next week." },
        { id: 2, name: 'Shortlist Notification', text: "Hi [Name], congratulations! You have been shortlisted for the next round." },
        { id: 3, name: 'Rejection', text: "Dear [Name], thank you for your interest. Unfortunately, we have decided to move forward with other candidates." },
    ];

    const [conversations, setConversations] = useState([
        {
            id: 1,
            candidateName: 'Alex Johnson',
            jobTitle: 'Senior Full Stack Developer',
            lastMessage: 'Thank you for considering my application!',
            lastMessageTime: '10:30 AM',
            unread: 2,
            messages: [
                { id: 1, sender: 'candidate', text: 'Hello! I wanted to follow up on my application.', timestamp: '9:15 AM' },
                { id: 2, sender: 'employer', text: 'Hi Alex! We are reviewing it.', timestamp: '10:00 AM' }
            ],
        },
        {
            id: 2,
            candidateName: 'Sarah Mitchell',
            jobTitle: 'Senior Full Stack Developer',
            lastMessage: 'Looking forward to the interview!',
            lastMessageTime: 'Yesterday',
            unread: 0,
            messages: [
                { id: 1, sender: 'employer', text: 'Hi Sarah, interview scheduled for Tuesday.', timestamp: '2:00 PM' },
                { id: 2, sender: 'candidate', text: 'Great, thanks!', timestamp: '2:30 PM' }
            ]
        }
    ]);

    const filteredConversations = conversations.filter(conv =>
        conv.candidateName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = (text = messageText) => {
        if (!text.trim() || !selectedConversation) return;

        const newMessage = {
            id: Date.now(),
            sender: 'employer',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversation.id) {
                const updatedConv = {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    lastMessage: text,
                    lastMessageTime: 'Just now',
                };
                setSelectedConversation(updatedConv); // Update current view
                return updatedConv;
            }
            return conv;
        }));

        setMessageText('');
        // toast.success('Message sent!');
    };

    const handleTemplateClick = (templateText) => {
        const processedText = templateText.replace('[Name]', selectedConversation.candidateName.split(' ')[0]);
        setMessageText(processedText);
    };

    const handleSendOffer = () => {
        const offerMessage = `OFFER LETTER: We are pleased to offer you the position! Salary: ${offerDetails.salary}, Joining Date: ${offerDetails.joiningDate}. Check your email for the official document.`;
        handleSendMessage(offerMessage);
        setShowOfferModal(false);
        toast.success("Offer Letter Sent!");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600 mt-1">Communicate with candidates and manage offers</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
                {/* Conversations List */}
                <Card className="lg:col-span-1 overflow-hidden flex flex-col" padding="p-0">
                    <div className="p-4 border-b">
                        <InputField
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedConversation?.id === conv.id ? 'bg-emerald-50 border-l-4 border-l-emerald-600' : ''}`}
                            >
                                <div className="flex justify-between">
                                    <h4 className="font-semibold">{conv.candidateName}</h4>
                                    <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-1">{conv.jobTitle}</p>
                                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Chat Area */}
                <Card className="lg:col-span-2 overflow-hidden flex flex-col" padding="p-0">
                    {!selectedConversation ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                            <ChatBubbleLeftRightIcon className="h-16 w-16 mb-2" />
                            <p>Select a conversation</p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {selectedConversation.candidateName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{selectedConversation.candidateName}</h3>
                                        <p className="text-sm text-gray-500">{selectedConversation.jobTitle}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => setShowOfferModal(true)}>
                                        <DocumentTextIcon className="h-4 w-4 mr-1" /> Send Offer
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                                {selectedConversation.messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'employer' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] p-3 rounded-lg ${msg.sender === 'employer' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-xs mt-1 text-right ${msg.sender === 'employer' ? 'text-emerald-100' : 'text-gray-500'}`}>{msg.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t bg-gray-50">
                                {/* Template Chips */}
                                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                                    <span className="text-xs font-semibold text-gray-500 flex items-center uppercase mr-1"><ClipboardDocumentListIcon className="h-4 w-4 mr-1" /> Templates:</span>
                                    {templates.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => handleTemplateClick(t.text)}
                                            className="whitespace-nowrap px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                                        >
                                            {t.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <button className="text-gray-400 hover:text-emerald-600"><PaperClipIcon className="h-6 w-6" /></button>
                                    <input
                                        className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                        placeholder="Type a message..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <Button onClick={() => handleSendMessage()} className="bg-emerald-600">
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Card>
            </div>

            {/* Offer Modal */}
            <Modal isOpen={showOfferModal} onClose={() => setShowOfferModal(false)} title="Send Offer Letter">
                <div className="space-y-4">
                    <p className="text-gray-600 text-sm">Create and send an offer letter to <b>{selectedConversation?.candidateName}</b>.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Annual Salary (CTC)" placeholder="e.g. ₹12,00,000" value={offerDetails.salary} onChange={e => setOfferDetails({ ...offerDetails, salary: e.target.value })} />
                        <InputField label="Joining Date" type="date" value={offerDetails.joiningDate} onChange={e => setOfferDetails({ ...offerDetails, joiningDate: e.target.value })} />
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                        <DocumentTextIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Click to upload formal offer letter (PDF)</p>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button className="bg-emerald-600" onClick={handleSendOffer}>Send Offer</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EmployerMessages;
