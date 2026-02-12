import React from 'react';
import SettingsPage from '../../components/common/SettingsPage';
import FacultyProfileForm from '../../components/profile-forms/FacultyProfileForm';

const FacultySettings = () => {
    return (
        <SettingsPage
            role="faculty"
            userDefaults={{
                name: 'Faculty Member',
                email: '',
                bio: '',
                phone: ''
            }}
            ProfileComponent={FacultyProfileForm}
        />
    );
};

export default FacultySettings;
