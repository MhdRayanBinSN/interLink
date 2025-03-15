import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, MapPin, Mail, Phone, Calendar, Briefcase, Edit, Key, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { requireAuth, getUserData } from '../../../utils/authHelper';

interface UserProfileData {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  attendeeType: string;
  dob: string;
  bio?: string;
  profilePicture?: string;
  interests?: string[];
  organization?: string;
  specialization?: string;
  githubProfile?: string;
  linkedinProfile?: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Extract first and last name from full name
  const getFirstAndLastName = (fullName: string): { firstName: string; lastName: string } => {
    const nameParts = fullName.split(' ');
    if (nameParts.length === 1) return { firstName: nameParts[0], lastName: '' };
    
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    return { firstName, lastName };
  };

  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      // Check if user is authenticated
      requireAuth(navigate, '/dashboard/profile');
      
      // Load user data
      const userData = await getUserData();
      if (userData) {
        setUserData(userData);
        setProfileData(userData);
      } else {
        navigate('/login', { state: { from: '/dashboard/profile' } });
      }
      
      setLoading(false);
    };
    
    checkAuthAndLoadProfile();
  }, [navigate]);

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-center gap-3 text-gray-300">
      <Icon className="w-5 h-5 text-[#7557e1]" />
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="mt-0.5">{value || 'Not specified'}</p>
      </div>
    </div>
  );

  const SocialLink = ({ icon: Icon, url }: { icon: any, url?: string }) => {
    if (!url) return null;
    
    // Add https:// if not present
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    
    return (
      <motion.a
        whileHover={{ scale: 1.1 }}
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-[#1d2132] text-gray-400 hover:text-white transition-colors"
      >
        <Icon className="w-5 h-5" />
      </motion.a>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1d2132] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-[#7557e1] animate-spin" />
          <p className="mt-4 text-xl text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[#1d2132] flex justify-center items-center">
        <div className="bg-[#222839] rounded-xl p-8 border border-red-500/20 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Profile</h2>
          <p className="text-gray-300 mb-6">{error || 'Failed to load profile data'}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-[#7557e1] text-white rounded-lg font-medium hover:opacity-90 transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const { firstName, lastName } = getFirstAndLastName(profileData.fullName);

  return (
    <div className="min-h-screen bg-[#1d2132] py-8">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-[#222839] rounded-xl overflow-hidden border border-gray-700/50 shadow-xl">
          {/* Header Section */}
          <div className="relative h-32 bg-[#1d2132]">
            <div className="absolute -bottom-16 left-6">
              <div className="relative">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture}
                    alt={profileData.fullName}
                    className="w-32 h-32 rounded-xl border-4 border-[#222839] object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-xl border-4 border-[#222839] bg-[#1d2132] flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#7557e1]">{firstName[0]}</span>
                  </div>
                )}
                <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-[#7557e1] text-white hover:bg-[#6345d0] transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 p-6">
            {/* Profile Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white">{profileData.fullName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 text-sm bg-[#7557e1]/10 text-[#7557e1] rounded-full border border-[#7557e1]/20">
                    {profileData.attendeeType}
                  </span>
                  {profileData.specialization && (
                    <span className="px-3 py-1 text-sm bg-[#d7ff42]/10 text-[#d7ff42] rounded-full border border-[#d7ff42]/20">
                      {profileData.specialization}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <SocialLink icon={Github} url={profileData.githubProfile} />
                <SocialLink icon={Linkedin} url={profileData.linkedinProfile} />
              </div>
            </div>

            {/* Bio Section */}
            {profileData.bio && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-[#d7ff42] mb-2">Bio</h2>
                <p className="text-gray-300 bg-[#1d2132]/50 p-4 rounded-lg">{profileData.bio}</p>
              </div>
            )}

            {/* Info Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#d7ff42]">Professional Information</h2>
                <div className="space-y-4">
                  <InfoItem 
                    icon={Briefcase} 
                    label="Organization" 
                    value={profileData.organization || 'Not specified'} 
                  />
                  <InfoItem 
                    icon={MapPin} 
                    label="Specialization" 
                    value={profileData.specialization || 'Not specified'} 
                  />
                  
                  {/* Interests */}
                  {profileData.interests && profileData.interests.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {profileData.interests.map((interest, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 text-sm bg-[#1d2132] text-gray-300 rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#d7ff42]">Contact Information</h2>
                <div className="space-y-4">
                  <InfoItem icon={Mail} label="Email" value={profileData.email} />
                  <InfoItem icon={Phone} label="Phone" value={profileData.phone} />
                  <InfoItem 
                    icon={Calendar} 
                    label="Member Since" 
                    value={formatDate(profileData.createdAt)} 
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => navigate('/dashboard/edit-profile')}
                className="px-6 py-2.5 bg-[#7557e1] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />Edit Profile
              </button>
              <button 
                onClick={() => navigate('/dashboard/change-password')}
                className="px-6 py-2.5 bg-[#1d2132] text-gray-300 rounded-lg font-medium hover:bg-[#1d2132]/80 transition-all flex items-center gap-2"
              >
                <Key className="w-4 h-4" />Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;