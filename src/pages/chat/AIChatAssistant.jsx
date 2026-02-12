import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../../services/aiMockService';
import Card from '../../components/common/Card';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline'; // Check availability, or use solid

const AIChatAssistant = () => {
    const [messages, setMessages] = useState([
        { id: 200, sender: 'ai', text: "Hello! I'm Jarvis, your AI Career Assistant. How can I help you today?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: inputValue
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate network delay and processing time
        setTimeout(() => {
            const aiResponseText = generateChatResponse(userMsg.text);
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: aiResponseText
            };

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500); // 1.5s delay
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto">
            <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-emerald-100/50">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-emerald-50/50 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-sm">
                        <SparklesIcon className="w-6 h-6" />
                    </div>
                    <div className="ml-3">
                        <h2 className="font-bold text-gray-800">JobPortal AI Assistant</h2>
                        <p className="text-xs text-emerald-600 font-medium flex items-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-emerald-600 text-white rounded-br-none'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full pl-5 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
                            placeholder="Ask about your career..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="absolute right-2 top-2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shadow-sm"
                        >
                            <PaperAirplaneIcon className="w-5 h-5 -rotate-45 translate-x-[-1px] translate-y-[1px]" />
                        </button>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-2">
                        AI generated responses may be inaccurate. Verify important information.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default AIChatAssistant;
