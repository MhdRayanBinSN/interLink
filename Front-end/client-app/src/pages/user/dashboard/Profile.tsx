import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, MapPin, Mail, Phone, Calendar, Briefcase, Edit, Key } from 'lucide-react';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  specialization: string;
  organization: string;
  githubProfile?: string;
  linkedinProfile?: string;
  profileImage: string;
  memberSince: string;
  Domain: string;
}

const Profile: React.FC = () => {
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

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-center gap-3 text-gray-300">
      <Icon className="w-5 h-5 text-[#7557e1]" />
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="mt-0.5">{value}</p>
      </div>
    </div>
  );

  const SocialLink = ({ icon: Icon, url }: { icon: any, url: string }) => (
    <motion.a
      whileHover={{ scale: 1.1 }}
      href={`https://${url}`}
      target="_blank"
      className="p-2 rounded-lg bg-[#1d2132] text-gray-400 hover:text-white transition-colors"
    >
      <Icon className="w-5 h-5" />
    </motion.a>
  );

  return (
    <div className="min-h-screen bg-[#1d2132] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-[#222839] rounded-xl overflow-hidden border border-gray-700/50 shadow-xl">
          {/* Header Section */}
          <div className="relative h-32 bg-[#1d2132]">
            <div className="absolute -bottom-16 left-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-xl border-4 border-[#222839] bg-[#1d2132] flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#7557e1]">{profileData.firstName[0]}</span>
                </div>
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
                <h1 className="text-2xl font-bold text-white">{`${profileData.firstName} ${profileData.lastName}`}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 text-sm bg-[#7557e1]/10 text-[#7557e1] rounded-full border border-[#7557e1]/20">
                    {profileData.role}
                  </span>
                  <span className="px-3 py-1 text-sm bg-[#d7ff42]/10 text-[#d7ff42] rounded-full border border-[#d7ff42]/20">
                    {profileData.Domain}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                {profileData.githubProfile && <SocialLink icon={Github} url={profileData.githubProfile} />}
                {profileData.linkedinProfile && <SocialLink icon={Linkedin} url={profileData.linkedinProfile} />}
              </div>
            </div>

            {/* Info Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#d7ff42]">Professional Information</h2>
                <div className="space-y-4">
                  <InfoItem icon={Briefcase} label="Organization" value={profileData.organization} />
                  <InfoItem icon={MapPin} label="Specialization" value={profileData.specialization} />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#d7ff42]">Contact Information</h2>
                <div className="space-y-4">
                  <InfoItem icon={Mail} label="Email" value={profileData.email} />
                  <InfoItem icon={Phone} label="Phone" value={profileData.phoneNumber} />
                  <InfoItem icon={Calendar} label="Member Since" value={profileData.memberSince} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="px-6 py-2.5 bg-[#7557e1] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2">
                <Edit className="w-4 h-4" />Edit Profile
              </button>
              <button className="px-6 py-2.5 bg-[#1d2132] text-gray-300 rounded-lg font-medium hover:bg-[#1d2132]/80 transition-all flex items-center gap-2">
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