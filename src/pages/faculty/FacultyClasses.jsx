import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useToast } from '../../contexts/ToastContext';
import { studentDirectory } from '../../services/campusMockData';
import { UserIcon, EnvelopeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const FacultyClasses = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useToast();

    const handleSendMessage = (studentName) => {
        toast.success(`Message sent to ${studentName}`);
    };

    const handleEmailClass = () => {
        toast.info("Opening email composer for all students...");
    };

    const filteredStudents = studentDirectory.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
                    <p className="text-gray-600">CS 3rd Year • Semester 6</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleEmailClass}>
                        <EnvelopeIcon className="h-5 w-5 mr-2" />
                        Email Class
                    </Button>
                </div>
            </div>

            <Card>
                <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search students by name or roll number..."
                        className="pl-10 w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 font-semibold">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                <div className="text-xs text-gray-500">{student.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.department}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleSendMessage(student.name)}
                                                className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                                            >
                                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                                Message
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default FacultyClasses;
