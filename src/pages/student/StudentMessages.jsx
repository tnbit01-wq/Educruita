import React, { useState } from 'react';
import { chats } from '../../services/campusMockData';
import Card from '../../components/common/Card';
import { PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useToast } from '../../contexts/ToastContext';

const StudentMessages = () => {
    const [selectedChat, setSelectedChat] = useState(chats[0]);
    const [messageInput, setMessageInput] = useState('');
    const [conversations, setConversations] = useState(chats);
    const toast = useToast();

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMessage = {
            id: `msg_${Date.now()}`,
            senderId: 'student_1', // Using mock current user ID
            text: messageInput,
            timestamp: new Date().toISOString(),
        };

        const updatedConversations = conversations.map(chat => {
            if (chat.id === selectedChat.id) {
                return {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: messageInput,
                    lastMessageTime: newMessage.timestamp,
                };
            }
            return chat;
        });

        setConversations(updatedConversations);
        setSelectedChat(updatedConversations.find(c => c.id === selectedChat.id));
        setMessageInput('');

        // Simulate reply
        setTimeout(() => {
            toast.info("New message received");
        }, 3000);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-4">
            {/* Conversations List */}
            <Card className="w-1/3 flex flex-col p-0 overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat?.id === chat.id ? 'bg-emerald-50 border-emerald-200' : 'border-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                    <UserCircleIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {chat.type === 'group' ? chat.groupName : chat.participantNames[1]}
                                        </h3>
                                        <span className="text-xs text-gray-400">
                                            {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col p-0 overflow-hidden">
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b bg-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                                    {chatNameInitials(selectedChat)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {selectedChat.type === 'group' ? selectedChat.groupName : selectedChat.participantNames[1]}
                                    </h3>
                                    <span className="text-xs text-green-500 flex items-center gap-1">
                                        <span className="h-2 w-2 bg-green-500 rounded-full"></span> Online
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {selectedChat.messages.map((msg, idx) => {
                                const isMe = msg.senderId === 'student_1';
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${isMe
                                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                            }`}>
                                            {!isMe && msg.senderName && (
                                                <p className="text-xs font-bold text-gray-500 mb-1">{msg.senderName}</p>
                                            )}
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-emerald-100' : 'text-gray-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                                >
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Select a conversation to start chatting
                    </div>
                )}
            </Card>
        </div>
    );
};

const chatNameInitials = (chat) => {
    if (chat.type === 'group') {
        return chat.groupName.substring(0, 2).toUpperCase();
    }
    return chat.participantNames[1].substring(0, 2).toUpperCase();
};

export default StudentMessages;
