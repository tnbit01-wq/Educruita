import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import AIModerationPanel from '../../components/common/AIModerationPanel';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { STAT_GRADIENTS } from '../../constants/designSystem';
import { mockJobs } from '../../services/mockData';

const AdminDashboard = () => {
  const toast = useToast();

  // Pending Approvals State
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, type: 'Company Verification', entity: 'Innovation Labs', date: '2 hours ago', priority: 'high' },
    { id: 2, type: 'Faculty Registration', entity: 'Prof. Rajesh Kumar', date: '5 hours ago', priority: 'medium' },
    { id: 3, type: 'Student ID Check', entity: 'Rahul Sharma', date: '1 day ago', priority: 'low' },
  ]);

  const overviewStats = [
    { label: 'Total Users', value: 2450, icon: UsersIcon, gradient: STAT_GRADIENTS.blue },
    { label: 'Pending Reviews', value: pendingApprovals.length, icon: ClockIcon, gradient: STAT_GRADIENTS.amber },
    { label: 'Active Jobs', value: mockJobs.length, icon: BriefcaseIcon, gradient: STAT_GRADIENTS.purple },
    { label: 'Reported Content', value: 5, icon: ExclamationTriangleIcon, gradient: STAT_GRADIENTS.red },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIModerationPanel />
        <Card title="Platform Health">
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Server Uptime</span>
              <span className="font-semibold text-emerald-600">99.98%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '99.98%' }}></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600">Daily Active Users</span>
              <span className="font-semibold text-blue-600">1,245</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </Card>

        <Card title="Pending Approvals">
          <div className="space-y-4 mt-4">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.entity}</h4>
                  <p className="text-sm text-gray-500">{item.type} • {item.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => {
                    setPendingApprovals(prev => prev.filter(p => p.id !== item.id));
                    toast.success("Approved");
                  }}>Approve</Button>
                </div>
              </div>
            ))}
            {pendingApprovals.length === 0 && <p className="text-gray-500 text-center py-4">All caught up!</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
