import React from 'react';
import SettingsPage from '../../components/common/SettingsPage';
import StudentProfileForm from '../../components/profile-forms/StudentProfileForm';

const StudentSettings = () => {
    return (
        <SettingsPage
            role="student"
            userDefaults={{
                name: 'Student Name',
                email: 'student@example.com',
                bio: '',
                phone: ''
            }}
            ProfileComponent={StudentProfileForm}
        />
    );
};

export default StudentSettings;
