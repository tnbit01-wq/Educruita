import React from 'react';
import SettingsPage from '../../components/common/SettingsPage';
import CandidateProfileForm from '../../components/profile-forms/CandidateProfileForm';

const CandidateSettings = () => {
    return (
        <SettingsPage
            role="candidate"
            userDefaults={{
                name: 'Job Seeker',
                email: '',
                bio: '',
                phone: ''
            }}
            ProfileComponent={CandidateProfileForm}
        />
    );
};

export default CandidateSettings;
