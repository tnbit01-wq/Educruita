import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { groups } from '../../services/campusMockData';
import { UserGroupIcon, UserPlusIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const StudentGroups = () => {
    const [allGroups, setAllGroups] = useState(groups);
    const toast = useToast();

    const handleJoinRequest = (groupId) => {
        setAllGroups(prev => prev.map(g => {
            if (g.id === groupId) {
                // Simulate sending a request
                return { ...g, requestSent: true };
            }
            return g;
        }));
        toast.success("Join request sent to group admins!");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Student Groups</h1>
                    <p className="text-gray-600 mt-1">Join communities and collaborate with peers</p>
                </div>
                <Button>Create New Group</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allGroups.map(group => (
                    <Card key={group.id} hover className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <UserGroupIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                                    <span className="text-xs text-gray-500">{group.category}</span>
                                </div>
                            </div>
                            <Badge variant="primary">{group.status}</Badge>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 flex-grow">{group.description}</p>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="text-xs text-gray-500">
                                <strong>{group.members.length}</strong> members
                            </div>

                            {group.requestSent ? (
                                <Badge variant="warning">Request Pending</Badge>
                            ) : group.members.includes('student_1') ? (
                                <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200">
                                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                                    Open Chat
                                </Button>
                            ) : (
                                <Button size="sm" onClick={() => handleJoinRequest(group.id)}>
                                    <UserPlusIcon className="h-4 w-4 mr-2" />
                                    Join Group
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}

                {/* Mock suggestions for new groups */}
                <Card className="border-dashed border-2 border-gray-300 bg-gray-50 flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px]">
                    <UserGroupIcon className="h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Start a new community</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">Gather people with similar interests</p>
                    <Button variant="outline">Create Group</Button>
                </Card>
            </div>
        </div>
    );
};

export default StudentGroups;
