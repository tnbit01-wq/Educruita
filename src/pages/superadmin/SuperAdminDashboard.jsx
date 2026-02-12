import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/modals/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import {
  UsersIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const SuperAdminDashboard = () => {
  const [userManagementModal, setUserManagementModal] = useState(false);
  const [configModal, setConfigModal] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Admin', email: 'admin@platform.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Sarah Manager', email: 'sarah@platform.com', role: 'admin', status: 'active' },
    { id: 3, name: 'Mike Support', email: 'mike@platform.com', role: 'support', status: 'active' },
  ]);
  const toast = useToast();

  const metrics = [
    { label: 'Total Users', value: '12,456', change: '+12%', trend: 'up', icon: UsersIcon, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Jobs', value: '845', change: '+8%', trend: 'up', icon: BriefcaseIcon, color: 'from-green-500 to-green-600' },
    { label: 'Registered Companies', value: '234', change: '+15%', trend: 'up', icon: BuildingOfficeIcon, color: 'from-purple-500 to-purple-600' },
    { label: 'Applications', value: '45,678', change: '-3%', trend: 'down', icon: ChartBarIcon, color: 'from-amber-500 to-amber-600' },
  ];

  const recentActivity = [
    { action: 'New company registered', entity: 'TechCorp Inc', time: '5 minutes ago', type: 'company' },
    { action: 'Job posted', entity: 'Senior Developer at StartupXYZ', time: '15 minutes ago', type: 'job' },
    { action: 'Admin approved BGV', entity: 'John Doe verification', time: '1 hour ago', type: 'approval' },
    { action: 'New candidate registered', entity: 'jane.smith@email.com', time: '2 hours ago', type: 'user' },
    { action: 'Support ticket resolved', entity: 'Ticket #1234', time: '3 hours ago', type: 'support' },
  ];

  const platformConfig = [
    { key: 'Job Posting Fee', value: '₹999/month', category: 'Pricing' },
    { key: 'Featured Job Fee', value: '₹499/job', category: 'Pricing' },
    { key: 'Max Applications/Job', value: '100', category: 'Limits' },
    { key: 'Email Notifications', value: 'Enabled', category: 'Features' },
    { key: 'Auto-Moderation', value: 'Enabled', category: 'Features' },
  ];

  const handleDeleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    }
  };

  const handleToggleUserStatus = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
    toast.success('User status updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-600 mt-1">System-wide metrics and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                    <div className={`flex items-center mt-2 text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendIcon className="h-4 w-4 mr-1" />
                      {metric.change} from last month
                    </div>
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${metric.color} rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Platform Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start pb-4 border-b border-gray-200 last:border-0"
              >
                <div className="h-2 w-2 bg-emerald-600 rounded-full mt-2 mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.entity}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <Badge variant="default" size="sm">{activity.type}</Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Button
              fullWidth
              variant="outline"
              className="justify-start hover:bg-emerald-50 hover:border-emerald-300"
              onClick={() => setUserManagementModal(true)}
            >
              <UsersIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              Manage Users & Roles
            </Button>
            <Button
              fullWidth
              variant="outline"
              className="justify-start hover:bg-emerald-50 hover:border-emerald-300"
              onClick={() => setConfigModal(true)}
            >
              <Cog6ToothIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              Platform Configuration
            </Button>
            <Button
              fullWidth
              variant="outline"
              className="justify-start hover:bg-emerald-50 hover:border-emerald-300"
            >
              <ChartBarIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              View Analytics
            </Button>
            <Button
              fullWidth
              variant="outline"
              className="justify-start hover:bg-emerald-50 hover:border-emerald-300"
            >
              <DocumentTextIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              Manage Content
            </Button>
          </div>
        </Card>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-bold text-blue-600">₹45,89,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Month</span>
              <span className="font-bold text-blue-600">₹38,45,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Growth</span>
              <span className="font-bold text-green-600">+19.3%</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Active Users</span>
              <span className="font-bold text-purple-600">3,456</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Session Time</span>
              <span className="font-bold text-purple-600">12m 34s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bounce Rate</span>
              <span className="font-bold text-purple-600">24.5%</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Successful Hires</span>
              <span className="font-bold text-green-600">234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Time to Hire</span>
              <span className="font-bold text-green-600">18 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Satisfaction Score</span>
              <span className="font-bold text-green-600">4.7/5</span>
            </div>
          </div>
        </Card>
      </div>

      {/* User Management Modal */}
      <Modal
        isOpen={userManagementModal}
        onClose={() => setUserManagementModal(false)}
        title="User Management"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Platform Users</h3>
            <Button size="sm" className="bg-emerald-600">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add User
            </Button>
          </div>

          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="primary" size="sm">{user.role}</Badge>
                    <Badge variant={user.status === 'active' ? 'success' : 'default'} size="sm">
                      {user.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleUserStatus(user.id)}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="outline">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Configuration Modal */}
      <Modal
        isOpen={configModal}
        onClose={() => setConfigModal(false)}
        title="Platform Configuration"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Current Settings</h3>
            <div className="space-y-3">
              {platformConfig.map((config, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{config.key}</p>
                    <p className="text-sm text-gray-500">{config.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{config.value}</span>
                    <Button size="sm" variant="outline">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={() => { setConfigModal(false); toast.success('Configuration saved'); }}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SuperAdminDashboard;
