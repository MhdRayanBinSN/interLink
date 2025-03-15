import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Upload, X, Loader } from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../../../helpers/Constant';
import toast, { Toaster } from 'react-hot-toast';

interface ProfileFormData {
  fullName: string;
  phone: string;
  bio: string;
  interests: string[];
  organization: string;
  specialization: string;
  githubProfile: string;
  linkedinProfile: string;
  profilePicture?: File | null;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [interestInput, setInterestInput] = useState<string>('');
  
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    phone: '',
    bio: '',
    interests: [],
    organization: '',
    specialization: '',
    githubProfile: '',
    linkedinProfile: '',
    profilePicture: null
  });
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${serverUrl}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setFormData({
            fullName: userData.fullName || '',
            phone: userData.phone || '',
            bio: userData.bio || '',
            interests: userData.interests || [],
            organization: userData.organization || '',
            specialization: userData.specialization || '',
            githubProfile: userData.githubProfile || '',
            linkedinProfile: userData.linkedinProfile || '',
          });
          
          if (userData.profilePicture) {
            setProfileImage(userData.profilePicture);
          }
        } else {
          toast.error('Failed to load profile data');
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
    }
  };
  
  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(item => item !== interest)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Prepare form data for API
      const updateData = new FormData();
      updateData.append('fullName', formData.fullName);
      updateData.append('phone', formData.phone);
      updateData.append('bio', formData.bio);
      updateData.append('organization', formData.organization);
      updateData.append('specialization', formData.specialization);
      updateData.append('githubProfile', formData.githubProfile);
      updateData.append('linkedinProfile', formData.linkedinProfile);
      
      // Add interests as JSON string
      updateData.append('interests', JSON.stringify(formData.interests));
      
      // Add profile picture if changed
      if (newProfileImage) {
        updateData.append('profilePicture', newProfileImage);
      }
      
      const response = await axios.put(`${serverUrl}/user/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setTimeout(() => {
          navigate('/dashboard/profile');
        }, 1500);
      } else {
        toast.error(response.data.error || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.error || 'An error occurred while updating your profile');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1d2132] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-[#7557e1] animate-spin" />
          <p className="mt-4 text-xl text-gray-300">Loading profile data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#1d2132] py-8">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => navigate('/dashboard/profile')}
          className="mb-6 flex items-center text-[#7557e1] hover:text-[#d7ff42] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </button>
        
        <div className="bg-[#222839] rounded-xl p-8 border border-gray-700/50 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-[#1d2132] flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#7557e1]">
                      {formData.fullName ? formData.fullName[0].toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
                
                <label className="absolute -bottom-2 -right-2 p-2 rounded-full bg-[#7557e1] text-white hover:bg-[#6345d0] transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              <div>
                <h3 className="font-medium text-white">Profile Picture</h3>
                <p className="text-sm text-gray-400 mt-1">Upload a new profile picture (JPG or PNG)</p>
              </div>
            </div>
            
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-[#d7ff42] mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 ml-1 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#1d2132] text-white border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 ml-1 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#1d2132] text-white border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 ml-1 mb-1">
                  Bio (optional)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-[#1d2132] text-white border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
            
            {/* Professional Information */}
            <div>
              <h2 className="text-lg font-semibold text-[#d7ff42] mb-4">Professional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 ml-1 mb-1">
                    Organization (optional)
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#1d2132] text-white border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 ml-1 mb-1">
                    Specialization (optional)
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#1d2132] text-white border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Interests */}
            <div>
              <h2 className="text-lg font-semibold text-[#d7ff42] mb-4">Interests</h2>
              
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="Add an interest"
                  className="flex-grow px-4 py-2.5 bg-[#1d2132] text-white border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="px-6 py-2.5 bg-[#7557e1] text-white rounded-lg font-medium hover:opacity-90 transition-all"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.interests.map((interest, index) => (
                  <div 
                    key={index} 
                    className="px-3 py-1.5 bg-[#1d2132] text-gray-300 rounded-full flex items-center"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h2 className="text-lg font-semibold text-[#d7ff42] mb-4">Social Links</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 ml-1 mb-1">
                    GitHub Profile (optional)
                  </label>
                  <input
                    type="text"
                    name="githubProfile"
                    value={formData.githubProfile}
                    onChange={handleChange}
                    placeholder="Your GitHub username or full URL"
                    className="w-full px-4 py-2.5 bg-[#1d2132] text-white border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 ml-1 mb-1">
                    LinkedIn Profile (optional)
                  </label>
                  <input
                    type="text"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    placeholder="Your LinkedIn username or full URL"
                    className="w-full px-4 py-2.5 bg-[#1d2132] text-white border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#7557e1] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;