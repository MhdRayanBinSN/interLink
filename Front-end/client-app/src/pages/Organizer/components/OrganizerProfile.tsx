import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';
import { serverUrl } from '../../../helpers/Constant';
import { 
  FaBuilding, FaEnvelope, FaPhone, FaGlobe, FaPencilAlt, 
  FaSave, FaTimesCircle, FaUser, FaLink, FaPlus, FaTrash
} from 'react-icons/fa';

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

// Create FormField as a separate component
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
  <div>
    <label className="block text-gray-400 text-sm mb-1.5">
      {label} {required && <span className="text-[#d7ff42]">*</span>}
    </label>
    <div className={`flex items-center px-4 py-2.5 bg-[#1d2132] rounded-lg ${isEditing ? 'border border-gray-700' : ''}`}>
      <Icon className="text-gray-500 mr-3" />
      
      {isEditing ? (
        isTextArea ? (
          <textarea
            {...register(name, validation)}
            rows={2}
            className="bg-transparent text-white w-full focus:outline-none resize-none"
            placeholder={placeholder}
            disabled={disabled}
          />
        ) : (
          <input
            {...register(name, validation)}
            type={type}
            className="bg-transparent text-white w-full focus:outline-none"
            placeholder={placeholder}
            disabled={disabled}
          />
        )
      ) : (
        <p className="text-white">
          {name.includes('.') 
            ? watch(name as any) || placeholder 
            : watch(name as keyof OrganizerProfileData) || placeholder}
        </p>
      )}
    </div>
    {errors[name] && (
      <p className="text-red-400 text-xs mt-1">{errors[name]?.message}</p>
    )}
  </div>
);

const OrganizerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  
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
    mode: 'onBlur' // Better performance
  });
  
  // Check if profile is complete
  const checkProfileCompleteness = useCallback((data: any) => {
    const requiredFields = ['name', 'organizationName', 'email', 'phone'];
    const hasAllRequired = requiredFields.every(field => !!data[field]);
    setIsProfileIncomplete(!hasAllRequired);
  }, []);
  
  // Fetch organizer data
  useEffect(() => {
    let isMounted = true; // For cleanup
    
    const fetchOrganizerData = async () => {
      try {
        if (!isMounted) return;
        setIsLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication required');
          window.location.href = '/organizer/login';
          return;
        }
        
        const response = await axios.get(`${serverUrl}/api/organizers/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!isMounted) return;
        
        if (response.data.success) {
          const organizer = response.data.data;
          
          // Prepare the data to populate the form
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
          checkProfileCompleteness(profileData);
          
          // If profile is incomplete and not currently editing, enable edit mode
          if (isMounted && (!organizer.name || !organizer.organizationName || !organizer.email || !organizer.phone)) {
            setIsEditing(true);
            toast.info('Please complete your profile information');
          }
        }
      } catch (error) {
        if (!isMounted) return;
        
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error('Session expired. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/organizer/login';
          } else {
            toast.error(error.response?.data?.error || 'Failed to load profile data');
          }
        } else {
          toast.error('Connection error');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchOrganizerData();
    
    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmount
    };
  }, [reset, checkProfileCompleteness]);
  
  const onSubmit = useCallback(async (data: OrganizerProfileData) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        window.location.href = '/organizer/login';
        return;
      }
      
      // Clean up data before sending
      const profileData = {
        ...data,
        socialLinks: data.socialLinks?.filter(link => link.platform && link.url) || []
      };
      
      const response = await axios.put(
        `${serverUrl}/api/organizers/profile`,
        profileData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        reset(response.data.data);
        setIsEditing(false);
        checkProfileCompleteness(response.data.data);
      } else {
        toast.error(response.data.error || 'Update failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error('Session expired');
          localStorage.removeItem('token');
          window.location.href = '/organizer/login';
        } else {
          toast.error(error.response?.data?.error || 'Update failed');
        }
      } else {
        toast.error('Connection error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [reset, checkProfileCompleteness]);
  
  // Optimized with useCallback to prevent recreating on each render
  const handleCancel = useCallback(() => {
    // Don't allow cancelling if profile is incomplete
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
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#d7ff42]"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#222839] rounded-[10px] border border-gray-700 overflow-hidden"
        >
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Organization Information */}
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
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">
                    Organization Type
                  </label>
                  <div className={`flex items-center px-4 py-2.5 bg-[#1d2132] rounded-lg ${isEditing ? 'border border-gray-700' : ''}`}>
                    <FaBuilding className="text-gray-500 mr-3" />
                    
                    {isEditing ? (
                      <select
                        {...register('organizationType')}
                        className="bg-transparent text-white w-full focus:outline-none"
                      >
                        <option value="educational">Educational Institution</option>
                        <option value="tech-company">Tech Company</option>
                        <option value="non-profit">Non-Profit Organization</option>
                        <option value="community">Tech Community</option>
                        <option value="individual">Individual</option>
                      </select>
                    ) : (
                      <p className="text-white capitalize">
                        {watch('organizationType')?.replace('-', ' ') || "Educational Institution"}
                      </p>
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
              
              {/* Contact Person Information */}
              <h3 className="text-white text-lg font-medium mb-4">Contact Person Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <FormField
                  label="Contact Person"
                  name="name"
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
                  disabled={true} // User ID shouldn't be editable once set
                />
              </div>
              
              {/* Social Links */}
              <h3 className="text-white text-lg font-medium mb-4">Social Media Links</h3>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-gray-400 text-sm">Connect your social media accounts</p>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="text-[#d7ff42] text-sm hover:underline flex items-center"
                    >
                      <FaPlus size={12} className="mr-1" /> Add Link
                    </button>
                  )}
                </div>
                
                {(watch('socialLinks')?.length || 0) > 0 ? (
                  <div className="space-y-3 mt-3">
                    {watch('socialLinks')?.map((link, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`flex items-center flex-1 px-4 py-2.5 bg-[#1d2132] rounded-lg ${isEditing ? 'border border-gray-700' : ''}`}>
                          <FaLink className="text-gray-500 mr-3" />
                          {isEditing ? (
                            <>
                              <select
                                {...register(`socialLinks.${index}.platform`)}
                                className="bg-transparent text-white border-r border-gray-700 pr-3 mr-3 focus:outline-none"
                              >
                                <option value="">Platform</option>
                                <option value="twitter">Twitter</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="facebook">Facebook</option>
                                <option value="instagram">Instagram</option>
                                <option value="github">GitHub</option>
                              </select>
                              <input
                                {...register(`socialLinks.${index}.url`)}
                                type="url"
                                placeholder="https://"
                                className="bg-transparent text-white w-full focus:outline-none"
                              />
                            </>
                          ) : (
                            <p className="text-white capitalize">
                              {link?.platform ? `${link.platform}: ${link.url || ''}` : "Link not specified"}
                            </p>
                          )}
                        </div>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeSocialLink(index)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic mt-2">No social links added</p>
                )}
              </div>
              
              {/* Action Buttons */}
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end mt-6 space-x-4"
                >
                  {!isProfileIncomplete && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center"
                    >
                      <FaTimesCircle className="mr-2" />
                      Cancel
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading || (!isDirty && !isProfileIncomplete)}
                    className={`px-5 py-2.5 bg-[#d7ff42] text-[#1d2132] rounded-lg font-medium flex items-center ${
                      isDirty || isProfileIncomplete ? 'hover:bg-opacity-90' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-t-transparent border-[#1d2132] animate-spin rounded-full mr-2"></div>
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    Save Profile
                  </motion.button>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(OrganizerProfile);