import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../../services/aiMockService';
import {
    PaperAirplaneIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    MinusIcon
} from '@heroicons/react/24/outline';

const GlobalAIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { id: 200, sender: 'ai', text: "Hello! I'm Jarvis, your AI Career Assistant. How can I help you today?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
            // Focus input when opened
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [messages, isTyping, isOpen, isMinimized]);

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
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    const minimizeChat = (e) => {
        e.stopPropagation();
        setIsMinimized(!isMinimized);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            height: isMinimized ? '60px' : '500px',
                            width: '350px'
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col mb-4 origin-bottom-right transition-all duration-300"
                    >
                        {/* Header */}
                        <div
                            className="bg-gradient-to-r from-emerald-600 to-teal-500 p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => setIsMinimized(!isMinimized)}
                        >
                            <div className="flex items-center text-white">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 backdrop-blur-sm">
                                    <SparklesIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">AI Assistant</h3>
                                    {!isMinimized && (
                                        <p className="text-xs text-emerald-100 flex items-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse"></span>
                                            Online
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={minimizeChat}
                                    className="p-1 hover:bg-white/20 rounded-full text-white transition-colors"
                                >
                                    <MinusIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsOpen(false);
                                    }}
                                    className="p-1 hover:bg-white/20 rounded-full text-white transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Body - Only show if not minimized */}
                        {!isMinimized && (
                            <>
                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.sender === 'user'
                                                        ? 'bg-emerald-600 text-white rounded-br-none'
                                                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-white border border-gray-100 px-3 py-2 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-3 border-t border-gray-100 bg-white">
                                    <div className="relative flex items-center">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            className="w-full pl-4 pr-10 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                                            placeholder="Type a message..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!inputValue.trim()}
                                            className="absolute right-1.5 p-1.5 bg-white text-emerald-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
                                        >
                                            <PaperAirplaneIcon className="w-5 h-5 -rotate-45 translate-x-[-1px] translate-y-[1px]" />
                                        </button>
                                    </div>
                                    <div className="text-center mt-2">
                                        <span className="text-[10px] text-gray-400">AI responses may be inaccurate.</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChat}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${isOpen
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
            >
                {isOpen ? (
                    <XMarkIcon className="w-6 h-6" />
                ) : (
                    <ChatBubbleLeftRightIcon className="w-7 h-7" />
                )}
            </motion.button>
        </div>
    );
};

export default GlobalAIChatBot;
