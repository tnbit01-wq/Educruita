import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';
import { useToast } from '../../contexts/ToastContext';
import {
    Cog6ToothIcon,
    ServerIcon,
    GlobeAltIcon,
    CurrencyDollarIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    TagIcon
} from '@heroicons/react/24/outline';

const Toggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4">
        <div>
            <h3 className="text-sm font-medium text-gray-900">{label}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={`${enabled ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
        >
            <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
);

const SuperAdminConfig = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('general');

    const [config, setConfig] = useState({
        // General
        maintenanceMode: false,
        registrationOpen: true,
        // Taxonomies
        jobCategories: 'IT, Finance, Marketing, Sales, HR',
        skills: 'React, Node.js, Python, Java, SQL',
        // Assessment
        cgpaScale: '10-point',
        resumeTemplates: 'Modern, Classic, Creative',
        // Gateways
        paymentGateway: 'Stripe',
        smsGateway: 'Twilio',
        emailGateway: 'SendGrid'
    });

    const handleSave = () => {
        toast.success("Configuration saved successfully!");
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Cog6ToothIcon },
        { id: 'taxonomies', label: 'Taxonomies', icon: TagIcon },
        { id: 'assessment', label: 'Assessment', icon: AcademicCapIcon },
        { id: 'gateways', label: 'Gateways', icon: ServerIcon },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Platform Configuration</h1>
                <p className="text-gray-600">Global settings, taxonomies, and integrations</p>
            </div>

            {/* Config Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon className="h-4 w-4 mr-2" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="System Controls" className="border-t-4 border-t-red-500">
                        <div className="divide-y divide-gray-200">
                            <Toggle
                                label="Maintenance Mode"
                                description="Take the platform offline for maintenance."
                                enabled={config.maintenanceMode}
                                onChange={(val) => setConfig({ ...config, maintenanceMode: val })}
                            />
                            <Toggle
                                label="User Registration"
                                description="Allow new users to create accounts."
                                enabled={config.registrationOpen}
                                onChange={(val) => setConfig({ ...config, registrationOpen: val })}
                            />
                        </div>
                    </Card>
                </div>
            )}

            {/* Taxonomies */}
            {activeTab === 'taxonomies' && (
                <Card title="Job Categories & Skills">
                    <div className="space-y-4">
                        <InputField
                            label="Job Categories (Comma Separated)"
                            value={config.jobCategories}
                            onChange={(e) => setConfig({ ...config, jobCategories: e.target.value })}
                        />
                        <InputField
                            label="Default Skills (Comma Separated)"
                            value={config.skills}
                            onChange={(e) => setConfig({ ...config, skills: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handleSave}>Save Taxonomies</Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Assessment */}
            {activeTab === 'assessment' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Grading Standards">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CGPA Scale</label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={config.cgpaScale}
                                    onChange={(e) => setConfig({ ...config, cgpaScale: e.target.value })}
                                >
                                    <option value="10-point">10 Point Scale</option>
                                    <option value="4-point">4 Point Scale</option>
                                    <option value="percentage">Percentage (%)</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                    <Card title="Resume Settings">
                        <div className="space-y-4">
                            <InputField
                                label="Active Templates"
                                value={config.resumeTemplates}
                                onChange={(e) => setConfig({ ...config, resumeTemplates: e.target.value })}
                            />
                            <p className="text-xs text-gray-500">Supports uploading custom Handlebars templates in the CMS module.</p>
                        </div>
                    </Card>
                    <div className="md:col-span-2 flex justify-end">
                        <Button onClick={handleSave}>Save Assessment Settings</Button>
                    </div>
                </div>
            )}

            {/* Gateways */}
            {activeTab === 'gateways' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Payment Gateway">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Provider</span>
                            </div>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={config.paymentGateway}
                                onChange={(e) => setConfig({ ...config, paymentGateway: e.target.value })}
                            >
                                <option value="Stripe">Stripe</option>
                                <option value="Razorpay">Razorpay</option>
                                <option value="PayPal">PayPal</option>
                            </select>
                            <InputField label="API Key (Public)" type="password" value="pk_test_12345" disabled />
                            <InputField label="Webhook Secret" type="password" value="whsec_123456" disabled />
                        </div>
                    </Card>

                    <Card title="Communication Gateways">
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" /> SMS Provider
                                </label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={config.smsGateway}
                                    onChange={(e) => setConfig({ ...config, smsGateway: e.target.value })}
                                >
                                    <option value="Twilio">Twilio</option>
                                    <option value="Msg91">Msg91</option>
                                    <option value="SNS">AWS SNS</option>
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <GlobeAltIcon className="h-4 w-4 mr-1" /> Email Provider
                                </label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={config.emailGateway}
                                    onChange={(e) => setConfig({ ...config, emailGateway: e.target.value })}
                                >
                                    <option value="SendGrid">SendGrid</option>
                                    <option value="SES">AWS SES</option>
                                    <option value="SMTP">Custom SMTP</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                    <div className="md:col-span-2 flex justify-end">
                        <Button onClick={handleSave}>Update Gateway Keys</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminConfig;
