import React from 'react';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'Student' | 'Educator' | 'Professional';
  specialization: string;
  organization: string;
  githubProfile?: string;
  linkedinProfile?: string;
  profileImage: string;
  memberSince: string;
  Domain: string;
}

const Profile: React.FC = () => {
  // Tech-focused dummy data
  const profileData: UserProfileData = {
    firstName: "Muhammed",
    lastName: "Rayan Bin SayedMohammed Noushad",
    email: "rayan6203@gmail.com",
    phoneNumber: "+91 8590109268",
    role: "Student",
    specialization: "Machine Learning & AI",
    organization: "IIT Madras",
    githubProfile: "github.com/MhdRayanBinSN",
    linkedinProfile: "linkedin.com/in/muhammed-rayan",
    profileImage: "",
    memberSince: "September 2023",
    Domain: "System Architect"
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <img 
              src={profileData.profileImage} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-2 border-blue-500"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {`${profileData.firstName} ${profileData.lastName}`}
                  </h1>
                  <p className="text-blue-600 font-medium">{profileData.role}</p>
                  <p className="text-gray-500">{profileData.specialization}</p>
                </div>
                <div className="flex gap-2">
                  {profileData.githubProfile && (
                    <a href={`https://${profileData.githubProfile}`} 
                       target="_blank" 
                       className="text-gray-600 hover:text-gray-900">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  {profileData.linkedinProfile && (
                    <a href={`https://${profileData.linkedinProfile}`} 
                       target="_blank" 
                       className="text-gray-600 hover:text-gray-900">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Professional Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">Organization</label>
                <p className="mt-1 text-gray-900">{profileData.organization}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-gray-900">{profileData.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Domain</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {profileData.Domain}
                </div>
              </div>
            </div>

           
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;