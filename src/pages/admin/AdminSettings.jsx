import React from 'react';
import SettingsPage from '../../components/common/SettingsPage';

const AdminSettings = () => {
    return <SettingsPage role="admin" userDefaults={{
        name: 'Admin User',
        email: 'admin@jobportal.com',
        bio: 'System Administrator',
        phone: '+1 555 000 0000'
    }} />;
};

export default AdminSettings;
