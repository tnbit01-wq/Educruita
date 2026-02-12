import React from 'react';
import SettingsPage from '../../components/common/SettingsPage';
import EmployerProfileForm from '../../components/profile-forms/EmployerProfileForm';

const EmployerSettings = () => {
    return (
        <SettingsPage
            role="employer"
            userDefaults={{
                name: 'Company Name',
                email: 'hr@example.com',
                bio: '',
                phone: ''
            }}
            ProfileComponent={EmployerProfileForm}
        />
    );
};

export default EmployerSettings;
