import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from '../../../utils/axiosConfig';
import { motion } from 'framer-motion';
import { 
  FaBuilding, FaEnvelope, FaPhone, FaGlobe, FaPencilAlt, 
  FaSave, FaTimesCircle, FaUser, FaLink, FaPlus, FaTrash,
  FaLock, FaEye, FaEyeSlash, FaTwitter, FaLinkedinIn, FaFacebookF, 
  FaInstagram, FaGithub, FaYoutube, FaTiktok, FaDiscord, 
  FaTelegram, FaReddit
} from 'react-icons/fa';
import ResponsiveDrawer from '../../../components/ui/ResponsiveDrawer';

interface SocialLink {
  platform: string;
  url: string;
}

// Updated interface to include fields from registration
interface OrganizerProfileData {
  name: string;
  organizationName: string;
  organizationType: string;
  email: string;
  phone: string;
  userId: string;
  website?: string;
  address?: string;
  contactPerson?: string;
  socialLinks?: SocialLink[];
}

// Password change interface
interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Add this custom hook
const usePasswordForm = () => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    formState: { errors },
    setError
  } = useForm<PasswordChangeData>({
    mode: 'onChange'
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = useCallback((field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  // Check password requirements
  const newPassword = watch('newPassword') || '';
  const passwordRequirements = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword)
  };

  const allRequirementsMet = 
    passwordRequirements.length && 
    passwordRequirements.uppercase &&
    passwordRequirements.lowercase &&
    passwordRequirements.number &&
    passwordRequirements.special;

  return {
    register,
    handleSubmit,
    reset,
    watch,
    errors,
    setError,
    showPassword,
    togglePasswordVisibility,
    passwordRequirements,
    allRequirementsMet
  };
};

const PasswordField: React.FC<{
  label: string;
  name: string;
  placeholder: string;
  register: any;
  errors: any;
  showPassword: boolean;
  toggleVisibility: () => void;
  validation?: Record<string, any>;
}> = ({
  label,
  name,
  placeholder,
  register,
  errors,
  showPassword,
  toggleVisibility,
  validation = {}
}) => (
  <div className="space-y-1.5">
    <label className="block text-gray-300 text-sm font-medium">
      {label} <span className="text-[#d7ff42]">*</span>
    </label>
    <div className="relative group">
      <div className="flex items-center px-4 py-3 bg-[#1d2132] rounded-xl border border-gray-700 group-hover:border-gray-500 transition-all duration-300">
        <FaLock className="text-gray-500 mr-3 min-w-[16px] group-hover:text-[#d7ff42] transition-colors" />
        <input
          {...register(name, validation)}
          type={showPassword ? "text" : "password"}
          className="bg-transparent text-white w-full focus:outline-none rounded-lg"
          placeholder={placeholder}
          style={{ boxShadow: 'none' }}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="text-gray-400 hover:text-gray-300 focus:outline-none transition-colors ml-2"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {errors[name] && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mt-1.5 text-red-400"
        >
          <div className="w-4 h-4 flex items-center justify-center rounded-full bg-red-500/20 mr-1.5">
            <span className="text-xs">!</span>
          </div>
          <p className="text-xs">{errors[name]?.message}</p>
        </motion.div>
      )}
    </div>
  </div>
);

const ProfileCompletionMeter: React.FC<{ percentage: number }> = ({ percentage }) => {
  const glowColor = percentage < 100 ? '#ffcc00' : '#d7ff42';
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-sm font-medium text-white">Profile Completion</h3>
        <span className="text-sm font-medium" style={{ color: percentage < 100 ? '#ffcc00' : '#d7ff42' }}>
          {percentage}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-700 overflow-hidden relative">
        <div 
          className="h-full transition-all duration-700 ease-out"
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(to right, ${percentage < 100 ? '#ffcc00, #ffa500' : '#d7ff42, #b3e233'})`,
            boxShadow: `0 0 8px ${glowColor}, 0 0 16px ${glowColor}`,
          }}
        />
      </div>
      {percentage < 100 && (
        <p className="text-xs text-yellow-400 mt-1.5">
          Complete your profile to increase visibility and build trust with attendees
        </p>
      )}
      {percentage === 100 && (
        <p className="text-xs text-green-400 mt-1.5">
          Great! Your profile is complete and ready to be discovered
        </p>
      )}
    </div>
  );
};

const FormField: React.FC<{
  label: string;
  name: string;
  icon: React.ElementType;
  placeholder: string;
  isEditing: boolean;
  watch: any;
  register: any;
  errors: any;
  type?: string;
  required?: boolean;
  validation?: Record<string, any>;
  isTextArea?: boolean;
  disabled?: boolean;
}> = ({ 
  label, 
  name, 
  icon: Icon, 
  placeholder, 
  isEditing,
  watch,
  register,
  errors,
  type = 'text',
  required = false,
  validation = {},
  isTextArea = false,
  disabled = false
}) => (
  <div className="space-y-1.5">
    <label className="block text-gray-300 text-sm font-medium">
      {label} {required && <span className="text-[#d7ff42]">*</span>}
    </label>
    <div className="relative group">
      <div className={`flex items-center px-4 py-3 bg-[#1d2132] rounded-xl ${
        isEditing 
          ? 'border border-gray-700 group-hover:border-gray-500 transition-all duration-300' 
          : 'border border-transparent'
      }`}>
        <Icon className={`text-gray-500 mr-3 min-w-[16px] ${isEditing ? 'group-hover:text-[#d7ff42] transition-colors' : ''}`} />
        
        {isEditing ? (
          isTextArea ? (
            <textarea
              {...register(name, validation)}
              rows={3}
              className="bg-transparent text-white w-full focus:outline-none resize-none rounded-lg"
              placeholder={placeholder}
              disabled={disabled}
              style={{ boxShadow: 'none' }}
            />
          ) : (
            <input
              {...register(name, validation)}
              type={type}
              className="bg-transparent text-white w-full focus:outline-none rounded-lg"
              placeholder={placeholder}
              disabled={disabled}
              style={{ 
                boxShadow: 'none',
                cursor: disabled ? 'not-allowed' : 'text' 
              }}
            />
          )
        ) : (
          <p className="text-white">
            {name.includes('.') 
              ? watch(name as any) || <span className="text-gray-500 italic text-sm">{placeholder}</span>
              : watch(name as keyof OrganizerProfileData) || <span className="text-gray-500 italic text-sm">{placeholder}</span>
            }
          </p>
        )}
      </div>
      {errors[name] && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mt-1.5 text-red-400"
        >
          <div className="w-4 h-4 flex items-center justify-center rounded-full bg-red-500/20 mr-1.5">
            <span className="text-xs">!</span>
          </div>
          <p className="text-xs">{errors[name]?.message}</p>
        </motion.div>
      )}
    </div>
  </div>
);

const OrganizerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [passwordDrawerOpen, setPasswordDrawerOpen] = useState(false);
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);

  // For profile data
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    watch,
    formState: { errors, isDirty } 
  } = useForm<OrganizerProfileData>({
    defaultValues: {
      socialLinks: [],
      organizationType: 'educational'
    },
    mode: 'onBlur'
  });

  // Password form handling
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    errors: passwordErrors,
    setError: setPasswordError,
    showPassword,
    togglePasswordVisibility,
    passwordRequirements,
    allRequirementsMet
  } = usePasswordForm();

  const getSocialMediaInfo = useCallback((platform: string) => {
    const platforms = {
      twitter: { 
        icon: FaTwitter, 
        color: '#1DA1F2',
        name: 'Twitter'
      },
      linkedin: { 
        icon: FaLinkedinIn, 
        color: '#0A66C2',
        name: 'LinkedIn'
      },
      facebook: { 
        icon: FaFacebookF, 
        color: '#1877F2',
        name: 'Facebook'
      },
      instagram: { 
        icon: FaInstagram, 
        color: '#E4405F',
        name: 'Instagram'
      },
      github: { 
        icon: FaGithub, 
        color: '#333333',
        name: 'GitHub'
      },
      youtube: { 
        icon: FaYoutube, 
        color: '#FF0000',
        name: 'YouTube'
      },
      tiktok: { 
        icon: FaTiktok, 
        color: '#000000',
        name: 'TikTok'
      },
      discord: { 
        icon: FaDiscord, 
        color: '#5865F2',
        name: 'Discord'
      },
      telegram: { 
        icon: FaTelegram,
        color: '#0088cc',
        name: 'Telegram'
      },
      reddit: { 
        icon: FaReddit,
        color: '#FF4500',
        name: 'Reddit'
      }
    };
    
    return platforms[platform as keyof typeof platforms] || { 
      icon: FaLink, 
      color: '#6B7280', 
      name: platform 
    };
  }, []);

  const getPasswordStrength = useCallback(() => {
    const newPassword = watchPassword('newPassword') || '';
    const requirements = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[@$!%*?&]/.test(newPassword)
    };
    
    const metCount = Object.values(requirements).filter(Boolean).length;
    return (metCount / 5) * 100;
  }, [watchPassword]);

  const getPasswordStrengthColor = useCallback(() => {
    const strength = getPasswordStrength();
    if (strength <= 20) return '#ff4d4f, #ff4d4f';
    if (strength <= 40) return '#ff7a45, #ff7a45';
    if (strength <= 60) return '#ffa940, #ffa940';
    if (strength <= 80) return '#bae637, #bae637';
    return '#73d13d, #52c41a';
  }, [getPasswordStrength]);

  const getPasswordStrengthLabel = useCallback(() => {
    const strength = getPasswordStrength();
    if (strength <= 20) return 'Very Weak';
    if (strength <= 40) return 'Weak';
    if (strength <= 60) return 'Medium';
    if (strength <= 80) return 'Strong';
    return 'Very Strong';
  }, [getPasswordStrength]);

  const calculateProfileCompletion = useCallback((data: OrganizerProfileData) => {
    const fields = [
      { name: 'organizationName', weight: 20 },
      { name: 'contactPerson', weight: 15 },
      { name: 'email', weight: 15 },
      { name: 'phone', weight: 15 },
      { name: 'address', weight: 10 },
      { name: 'website', weight: 10 },
      { name: 'organizationType', weight: 5 }
    ];
    
    const socialLinksWeight = data.socialLinks && data.socialLinks.length > 0 ? 
      Math.min(10, data.socialLinks.length * 2) : 0;
    
    let completion = 0;
    fields.forEach(field => {
      if (data[field.name as keyof OrganizerProfileData]) {
        completion += field.weight;
      }
    });
    
    return Math.min(100, completion + socialLinksWeight);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchOrganizerData = async () => {
      try {
        if (!isMounted) return;
        setIsLoading(true);
        
        const token = localStorage.getItem('organizer_token');
        if (!token) {
          toast.error('Authentication required');
          window.location.href = '/organizer/login';
          return;
        }
        
        const response = await api.get('/organizer/profile');
        
        if (response.data.success) {
          const organizer = response.data.data;
          
          const profileData = {
            name: organizer.name || '',
            organizationName: organizer.organizationName || '',
            organizationType: organizer.organizationType || 'educational',
            email: organizer.email || '',
            phone: organizer.phone || '',
            website: organizer.website || '',
            address: organizer.address || '',
            contactPerson: organizer.contactPerson || organizer.name || '',
            userId: organizer.userId || '',
            socialLinks: Array.isArray(organizer.socialLinks) ? organizer.socialLinks : []
          };
          
          reset(profileData);
          
          const requiredFields = ['name', 'organizationName', 'email', 'phone'];
          const hasAllRequired = requiredFields.every(field => !!organizer[field]);
          setIsProfileIncomplete(!hasAllRequired);
          
          if (!hasAllRequired) {
            setIsEditing(true);
            toast.info('Please complete your profile information');
          } else {
            setIsEditing(false);
          }
          
          setProfileCompletionPercentage(calculateProfileCompletion(profileData));
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('organizer_token');
          window.location.href = '/organizer/login';
        } else {
          toast.error('Failed to load profile data');
          console.error('Profile fetch error:', error);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchOrganizerData();
    
    return () => {
      isMounted = false;
    };
  }, [reset, calculateProfileCompletion]);

  const onSubmit = useCallback(async (data: OrganizerProfileData) => {
    try {
      setIsLoading(true);
      
      const profileData = {
        ...data,
        socialLinks: data.socialLinks?.filter(link => link.platform && link.url) || []
      };
      
      const response = await api.put('/organizer/profile', profileData);
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        reset(response.data.data);
        setIsEditing(false);
        setIsProfileIncomplete(false);
        
        setProfileCompletionPercentage(calculateProfileCompletion(response.data.data));
      } else {
        toast.error(response.data.error || 'Update failed');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired');
        localStorage.removeItem('organizer_token');
        window.location.href = '/organizer/login';
      } else {
        toast.error(error.response?.data?.error || 'Update failed');
        console.error('Profile update error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [reset, calculateProfileCompletion]);

  const onPasswordChange = useCallback(async (data: PasswordChangeData) => {
    try {
      setIsLoading(true);
      
      if (data.newPassword !== data.confirmPassword) {
        toast.error('Passwords do not match');
        setPasswordError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match'
        });
        return;
      }
      
      if (!allRequirementsMet) {
        toast.error('Password does not meet all requirements');
        setPasswordError('newPassword', {
          type: 'manual',
          message: 'Password must meet all requirements'
        });
        return;
      }
      
      const response = await api.put('/organizer/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      if (response.data.success) {
        toast.success('Password changed successfully');
        resetPassword();
        setPasswordDrawerOpen(false);
      } else {
        toast.error(response.data.error || 'Password change failed');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Current password is incorrect');
        setPasswordError('currentPassword', { 
          type: 'manual',
          message: 'Current password is incorrect'
        });
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Password change failed');
      }
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [resetPassword, setPasswordError, allRequirementsMet]);

  const handleCancel = useCallback(() => {
    if (isProfileIncomplete) {
      toast.error('Please complete your profile information first');
      return;
    }
    
    setIsEditing(false);
    reset();
  }, [reset, isProfileIncomplete]);

  const addSocialLink = useCallback(() => {
    const currentLinks = watch('socialLinks') || [];
    setValue('socialLinks', [...currentLinks, { platform: '', url: '' }]);
  }, [setValue, watch]);

  const removeSocialLink = useCallback((index: number) => {
    const currentLinks = watch('socialLinks') || [];
    setValue('socialLinks', currentLinks.filter((_, i) => i !== index));
  }, [setValue, watch]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Organizer Profile</h1>
            <p className="text-gray-400">Manage your professional information</p>
            {isProfileIncomplete && !isEditing && (
              <p className="text-yellow-400 text-sm mt-1">
                Your profile is incomplete. Please add missing information.
              </p>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setPasswordDrawerOpen(true)}
                className="flex items-center px-4 py-2 bg-[#2a2f44] text-white rounded-lg hover:bg-opacity-90"
              >
                <FaLock className="mr-2" />
                Change Password
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-[#2a2f44] text-white rounded-lg hover:bg-opacity-90"
              >
                <FaPencilAlt className="mr-2" />
                Edit Profile
              </motion.button>
            </div>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#d7ff42]"></div>
        </div>
      ) : (
        <>
          <ResponsiveDrawer 
            isOpen={passwordDrawerOpen} 
            onClose={() => setPasswordDrawerOpen(false)}
            title="Change Password"
            className="max-w-lg"
          >
            <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="space-y-6">
              <div className="mb-4 text-gray-400 text-sm leading-relaxed">
                Update your password to maintain account security. Choose a strong password that you don't use elsewhere.
              </div>
              
              <PasswordField
                label="Current Password"
                name="currentPassword"
                placeholder="Enter current password"
                register={registerPassword}
                errors={passwordErrors}
                showPassword={showPassword.current}
                toggleVisibility={() => togglePasswordVisibility('current')}
                validation={{ required: "Current password is required" }}
              />
              
              <div className="space-y-1.5">
                <label className="block text-gray-300 text-sm font-medium">
                  New Password <span className="text-[#d7ff42]">*</span>
                </label>
                <div className="relative group">
                  <div className="flex items-center px-4 py-3 bg-[#1d2132] rounded-xl border border-gray-700 group-hover:border-gray-500 transition-all duration-300">
                    <FaLock className="text-gray-500 mr-3 min-w-[16px] group-hover:text-[#d7ff42] transition-colors" />
                    <input
                      {...registerPassword('newPassword', {
                        required: "New password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters"
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message: "Password must meet all requirements below"
                        }
                      })}
                      type={showPassword.new ? "text" : "password"}
                      className="bg-transparent text-white w-full focus:outline-none rounded-lg"
                      placeholder="Enter new password"
                      style={{ boxShadow: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="text-gray-400 hover:text-gray-300 focus:outline-none transition-colors ml-2"
                    >
                      {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center mt-1.5 text-red-400"
                    >
                      <div className="w-4 h-4 flex items-center justify-center rounded-full bg-red-500/20 mr-1.5">
                        <span className="text-xs">!</span>
                      </div>
                      <p className="text-xs">{passwordErrors.newPassword?.message}</p>
                    </motion.div>
                  )}
                  
                  <div className="mt-3">
                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${getPasswordStrength()}%`,
                          background: `linear-gradient(to right, ${getPasswordStrengthColor()})`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Password strength: {getPasswordStrengthLabel()}
                    </p>
                  </div>
                  
                  <ul className="mt-2 space-y-1 text-xs">
                    <li className={`flex items-center ${passwordRequirements.length ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordRequirements.length ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordRequirements.uppercase ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      Contains uppercase letter
                    </li>
                    <li className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordRequirements.lowercase ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      Contains lowercase letter
                    </li>
                    <li className={`flex items-center ${passwordRequirements.number ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordRequirements.number ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      Contains number
                    </li>
                    <li className={`flex items-center ${passwordRequirements.special ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordRequirements.special ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      Contains special character (@$!%*?&)
                    </li>
                  </ul>
                </div>
              </div>
              
              <PasswordField
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="Confirm new password"
                register={registerPassword}
                errors={passwordErrors}
                showPassword={showPassword.confirm}
                toggleVisibility={() => togglePasswordVisibility('confirm')}
                validation={{
                  required: "Please confirm your password",
                  validate: (value: string) => 
                    value === watchPassword('newPassword') || "Passwords do not match"
                }}
              />
              
              <div className="flex justify-end space-x-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setPasswordDrawerOpen(false)}
                  className="px-5 py-2.5 bg-gray-700/70 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#d7ff42] to-[#c0e638] text-[#1d2132] rounded-lg font-medium flex items-center shadow-lg shadow-[#d7ff42]/20 hover:shadow-[#d7ff42]/30 transition-all"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-[#1d2132] animate-spin rounded-full mr-2"></div>
                  ) : (
                    <FaLock className="mr-2" />
                  )}
                  Update Password
                </motion.button>
              </div>
            </form>
          </ResponsiveDrawer>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#222839] rounded-[10px] border border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <ProfileCompletionMeter percentage={profileCompletionPercentage} />
                
                <h3 className="text-white text-lg font-medium mb-4">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <FormField
                    label="Organization Name"
                    name="organizationName"
                    icon={FaBuilding}
                    placeholder="ABC Organization"
                    isEditing={isEditing}
                    watch={watch}
                    register={register}
                    errors={errors}
                    required
                    validation={{ required: "Organization name is required" }}
                  />
                  
                  <div className="space-y-1.5">
                    <label className="block text-gray-300 text-sm font-medium">
                      Organization Type
                    </label>
                    <div className={`relative flex items-center px-4 py-3 bg-[#1d2132] rounded-xl ${
                      isEditing 
                        ? 'border border-gray-700 group hover:border-gray-500 transition-all duration-300' 
                        : 'border border-transparent'
                    }`}>
                      <FaBuilding className={`text-gray-500 mr-3 min-w-[16px] ${isEditing ? 'group-hover:text-[#d7ff42] transition-colors' : ''}`} />
                      
                      {isEditing ? (
                        <select
                          {...register('organizationType')}
                          className="bg-transparent text-white w-full focus:outline-none appearance-none cursor-pointer rounded-lg"
                          style={{ boxShadow: 'none' }}
                        >
                          <option value="educational" className="bg-[#1d2132]">Educational Institution</option>
                          <option value="tech-company" className="bg-[#1d2132]">Tech Company</option>
                          <option value="non-profit" className="bg-[#1d2132]">Non-Profit Organization</option>
                          <option value="community" className="bg-[#1d2132]">Tech Community</option>
                          <option value="individual" className="bg-[#1d2132]">Individual</option>
                        </select>
                      ) : (
                        <p className="text-white capitalize">
                          {watch('organizationType')?.replace('-', ' ') || "Educational Institution"}
                        </p>
                      )}
                      {isEditing && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    label="Website"
                    name="website"
                    icon={FaGlobe}
                    placeholder="https://example.com"
                    type="url"
                    isEditing={isEditing}
                    watch={watch}
                    register={register}
                    errors={errors}
                  />
                  
                  <FormField
                    label="Address"
                    name="address"
                    icon={FaBuilding}
                    placeholder="123 Main St, City, Country"
                    isEditing={isEditing}
                    watch={watch}
                    register={register}
                    errors={errors}
                  />
                </div>
                
                <h3 className="text-white text-lg font-medium mb-4">Contact Person Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <FormField
                    label="Contact Person Name"
                    name="contactPerson"
                    icon={FaUser}
                    placeholder="John Doe"
                    isEditing={isEditing}
                    watch={watch}
                    register={register}
                    errors={errors}
                    required
                    validation={{ required: "Contact person name is required" }}
                  />
                  
                  <FormField
                    label="Email Address"
                    name="email"
                    icon={FaEnvelope}
                    type="email"
                    placeholder="example@mail.com"
                    isEditing={isEditing}
                    watch={watch}
                    register={register}
                    errors={errors}
                    required
                    validation={{ 
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                      }
                    }}
                  />
                  
                  <FormField
                    label="Phone Number"
                    name="phone"
                    icon={FaPhone}
                    placeholder="+1 (123) 456-7890"
                    isEditing={isEditing}
                    watch={watch}
                    register={register}
                    errors={errors}
                    required
                    validation={{ required: "Phone number is required" }}
                  />
                  
                  <FormField
                    label="User ID"
                    name="userId"
                    icon={FaUser}
                    placeholder="username"
                    isEditing={isEditing}
                    watch={watch}
                    register={register}
                    errors={errors}
                    disabled={true}
                  />
                </div>
                
                <h3 className="text-white text-lg font-medium mb-4">Social Media Links</h3>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-gray-300 text-sm font-medium">Your Social Media Profiles</h4>
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={addSocialLink}
                        className="text-[#d7ff42] text-sm hover:underline flex items-center group"
                      >
                        <div className="p-1 bg-[#1d2132] rounded-full mr-1.5 group-hover:bg-[#d7ff42] group-hover:text-[#1d2132] transition-colors">
                          <FaPlus size={10} />
                        </div>
                        Add New Link
                      </motion.button>
                    )}
                  </div>
                  
                  {(watch('socialLinks')?.length || 0) > 0 ? (
                    <div className="space-y-4 mt-3">
                      {watch('socialLinks')?.map((link, index) => {
                        const socialInfo = getSocialMediaInfo(link.platform);
                        const SocialIcon = socialInfo.icon;
                        
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`flex items-center flex-1 px-4 py-3 bg-[#1d2132] rounded-xl ${
                              isEditing ? 'border border-gray-700 group hover:border-gray-600 transition-colors' : ''
                            }`}>
                              {isEditing ? (
                                <div className="flex items-center w-full">
                                  <select
                                    {...register(`socialLinks.${index}.platform`)}
                                    className="bg-transparent text-white min-w-[130px] border-r border-gray-700 pr-3 mr-3 focus:outline-none appearance-none cursor-pointer"
                                    style={{ boxShadow: 'none' }}
                                  >
                                    <option value="" className="bg-[#1d2132]">Select Platform</option>
                                    <option value="twitter" className="bg-[#1d2132]">Twitter</option>
                                    <option value="linkedin" className="bg-[#1d2132]">LinkedIn</option>
                                    <option value="facebook" className="bg-[#1d2132]">Facebook</option>
                                    <option value="instagram" className="bg-[#1d2132]">Instagram</option>
                                    <option value="github" className="bg-[#1d2132]">GitHub</option>
                                    <option value="youtube" className="bg-[#1d2132]">YouTube</option>
                                    <option value="tiktok" className="bg-[#1d2132]">TikTok</option>
                                    <option value="discord" className="bg-[#1d2132]">Discord</option>
                                    <option value="telegram" className="bg-[#1d2132]">Telegram</option>
                                    <option value="reddit" className="bg-[#1d2132]">Reddit</option>
                                  </select>
                                  <div className="pointer-events-none absolute left-[88px] flex items-center">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                  <input
                                    {...register(`socialLinks.${index}.url`)}
                                    type="url"
                                    placeholder="https://"
                                    className="bg-transparent text-white w-full focus:outline-none rounded-lg"
                                    style={{ boxShadow: 'none' }}
                                  />
                                </div>
                              ) : (
                                <>
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                    style={{ 
                                      backgroundColor: link.platform ? `${socialInfo.color}20` : '#6B728020',
                                      color: socialInfo.color 
                                    }}
                                  >
                                    <SocialIcon size={16} />
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">
                                      {link.platform ? socialInfo.name : 'Not specified'}
                                    </p>
                                    {link.url && (
                                      <a 
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="text-sm text-gray-400 hover:text-[#d7ff42] transition-colors"
                                      >
                                        {link.url}
                                      </a>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                            {isEditing && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => removeSocialLink(index)}
                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors"
                                aria-label="Remove link"
                              >
                                <FaTrash size={14} />
                              </motion.button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-3 p-6 border border-dashed border-gray-700 rounded-lg text-center">
                      <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#1d2132] flex items-center justify-center">
                          <FaLink size={20} className="text-gray-500" />
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {isEditing ? 'Add your social media profiles to help people connect with you' : 'No social links added yet'}
                      </p>
                      {isEditing && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={addSocialLink}
                          className="mt-3 px-4 py-2 border border-[#d7ff42]/30 text-[#d7ff42] rounded-lg text-sm hover:bg-[#d7ff42]/10 transition-colors"
                        >
                          <FaPlus size={10} className="inline mr-1.5" /> Add Social Link
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end mt-8 space-x-4"
                  >
                    {!isProfileIncomplete && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleCancel}
                        className="px-5 py-2.5 bg-gray-700/70 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                      >
                        <FaTimesCircle className="mr-2" />
                        Cancel
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading || (!isDirty && !isProfileIncomplete)}
                      className={`px-5 py-2.5 rounded-lg font-medium flex items-center ${
                        isDirty || isProfileIncomplete
                          ? 'bg-gradient-to-r from-[#d7ff42] to-[#c0e638] text-[#1d2132] shadow-lg shadow-[#d7ff42]/20 hover:shadow-[#d7ff42]/30 transition-all'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-[#1d2132] animate-spin rounded-full mr-2"></div>
                      ) : (
                        <FaSave className="mr-2" />
                      )}
                      {isDirty ? 'Save Changes' : 'Save Profile'}
                    </motion.button>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default React.memo(OrganizerProfile);