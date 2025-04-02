import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSave, FaImage, FaPlus, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { serverUrl } from '../../../helpers/Constant';
import { toast } from 'react-toastify';
import { Check } from 'lucide-react'; // Add this import for the checkmark icon

interface IEditEventProps {}

type EventFormData = {
  title: string;
  description: string;
  bannerImage?: FileList;
  website?: string;
  maxParticipants: number;
  registrationDeadline: Date;
  speakers: {
    name: string;
    bio: string;
    topic: string;
    image?: FileList;
    imageUrl?: string;
  }[];
  eventType: string;
  category: string;
  startDateTime: Date;
  endDateTime: Date;
  mode: 'online' | 'offline' | 'hybrid';
  venue?: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  entryType: 'free' | 'paid';
  ticketPrice?: number;
  status: string;
  languages: string[];
  aboutEvent?: string;
  streamingLink?: string;
  targetAudience: string[];
};

const EditEvent: React.FunctionComponent<IEditEventProps> = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false); // Add this state to track successful updates

  const { 
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors }
  } = useForm<EventFormData>({
    defaultValues: {
      startDateTime: new Date(),
      endDateTime: new Date(),
      registrationDeadline: new Date(),
      mode: 'offline',
      entryType: 'free',
      status: 'draft',
      languages: [],
      speakers: []
    }
  });

  const { 
    fields: speakerFields, 
    append: appendSpeaker, 
    remove: removeSpeaker 
  } = useFieldArray({
    control,
    name: "speakers"
  });

  const eventMode = watch('mode');
  const entryType = watch('entryType');

  const getToken = async () => {
    const token = localStorage.getItem('organizer_token');
    
    if (!token) {
      toast.error('Please login to edit events');
      navigate('/organizer/login', { state: { returnUrl: `/organizer/dashboard/event/${eventId}/edit` } });
      return null;
    }
    
    return token;
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('organizer_token');
        
        if (!token) {
          toast.error('Please login to edit events');
          navigate('/organizer/login');
          return;
        }
        
        console.log('Fetching event data for ID:', eventId);
        console.log('Using token:', token); // For debugging - remove in production
        
        const response = await axios.get(
          `${serverUrl}/events/getOrganizerEventById/${eventId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          const eventData = response.data.data;
          console.log('Event data received:', eventData);
          
          setValue('title', eventData.title);
          setValue('description', eventData.description || '');
          setValue('website', eventData.website || '');
          setValue('eventType', eventData.eventType || '');
          setValue('category', eventData.category || '');
          setValue('maxParticipants', eventData.maxParticipants || 0);
          
          if (eventData.startDateTime) {
            setValue('startDateTime', new Date(eventData.startDateTime));
          }
          if (eventData.endDateTime) {
            setValue('endDateTime', new Date(eventData.endDateTime));
          }
          if (eventData.registrationDeadline) {
            setValue('registrationDeadline', new Date(eventData.registrationDeadline));
          }
          
          setValue('organizerName', eventData.organizerName || '');
          setValue('organizerEmail', eventData.organizerEmail || '');
          setValue('organizerPhone', eventData.organizerPhone || '');
          
          setValue('mode', eventData.mode || 'offline');
          setValue('venue', eventData.venue || '');
          setValue('streamingLink', eventData.streamingLink || '');
          
          setValue('entryType', eventData.entryType || 'free');
          setValue('ticketPrice', eventData.ticketPrice || 0);
          
          setValue('status', eventData.status || 'draft');
          setValue('languages', eventData.languages || []);
          setValue('targetAudience', eventData.targetAudience || []);
          setValue('aboutEvent', eventData.aboutEvent || '');
          
          if (eventData.speakers && eventData.speakers.length > 0) {
            setValue('speakers', eventData.speakers.map((speaker: { name: any; bio: any; topic: any; imageUrl: any; }) => ({
              name: speaker.name || '',
              bio: speaker.bio || '',
              topic: speaker.topic || '',
              imageUrl: speaker.imageUrl || ''
            })));
          }
          
          if (eventData.bannerImageUrl) {
            setBannerPreview(`${eventData.bannerImageUrl}`);
          }
        } else {
          setError('Failed to fetch event details');
          toast.error('Failed to load event data');
        }
      } catch (err: any) {
        console.error('Error fetching event data:', err);
        
        // Check specifically for 401 errors
        if (err.response && err.response.status === 401) {
          toast.error('Your session has expired. Please login again.');
          localStorage.removeItem('organizer_token');
          navigate('/organizer/login');
        } else {
          setError(err.message || 'Failed to fetch event details');
          toast.error('Error loading event details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, setValue, navigate]);

  useEffect(() => {
    const bannerFile = watch('bannerImage')?.[0];
    if (bannerFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(bannerFile);
    }
  }, [watch('bannerImage')]);

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      const token = await getToken();
      
      if (!token) {
        setIsSubmitting(false);
        return;
      }
      
      console.log('Submitting event update:', data);
      
      const formData = new FormData();
      
      if (data.bannerImage && data.bannerImage[0]) {
        formData.append('bannerImage', data.bannerImage[0]);
      }
      
      if (data.speakers && data.speakers.length > 0) {
        data.speakers.forEach((speaker, index) => {
          if (speaker.image && speaker.image[0]) {
            formData.append('speakerImages', speaker.image[0]);
            formData.append(`speakerIndex${index}`, index.toString());
          }
        });
      }
      
      const cleanEventData = {
        ...data,
        bannerImage: undefined,
        speakers: data.speakers?.map(s => ({
          ...s,
          image: undefined 
        })) || []
      };
      
      formData.append('eventData', JSON.stringify(cleanEventData));
      
      // Clear any existing toasts
      toast.dismiss();
      
      const response = await axios.put(
        `${serverUrl}/events/updateEvent/${eventId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Clear any existing toasts first
        toast.dismiss();
        
        // Show a beautiful success toast that matches your login page style
        toast.success(
          <div className="flex items-center">
            <div>
              <p className="font-medium">Success!</p>
              <p className="text-sm opacity-90">Event updated successfully</p>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              background: "rgba(255, 255, 255, 0.30)",
              color: "white",
              fontWeight: "500",
              borderRadius: "10px",
              padding: "16px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              backdropFilter: "blur(7.6px)",
              WebkitBackdropFilter: "blur(7.6px)"
            }
          }
        );
        
        // Reset form state
        setUpdateSuccess(true);
        setIsSubmitting(false);
      } else {
        toast.error(response.data?.error || 'Failed to update event', {
          position: "top-center",
          style: {
            background: "#ff5252",
            color: "white",
            borderRadius: "10px"
          }
        });
        setError(response.data?.error || 'Failed to update event');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error('Error updating event:', err);
      
      // Set loading state to false in the catch block too
      setIsSubmitting(false);
      
      const errorMessage = err.response?.data?.error || 'Error updating event';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('organizer_token');
        navigate('/organizer/login', { state: { returnUrl: `/organizer/dashboard/event/${eventId}/edit` } });
      }
    }
    // No finally block - we manually set isSubmitting in each code path
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d7ff42]"></div>
      </div>
    );
  }

  

  return (
    
    <div className="max-w-4xl mx-auto py-8">
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Event Details</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Event Title
              </label>
              <input
                {...register('title', { required: 'Event title is required' })}
                className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Event Type
                </label>
                <select
                  {...register('eventType', { required: 'Event type is required' })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="workshop">Workshop</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="seminar">Seminar</option>
                  <option value="bootcamp">Bootcamp</option>
                </select>
                {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Category
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="ai-ml">AI/ML</option>
                  <option value="web-dev">Web Development</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="mobile-dev">Mobile Development</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Event Banner
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-[10px] bg-[#1d2132]">
                {bannerPreview ? (
                  <div className="w-full">
                    <img 
                      src={bannerPreview} 
                      alt="Banner preview" 
                      className="max-h-64 mx-auto object-contain"
                    />
                    <div className="flex justify-center mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setValue('bannerImage', undefined);
                          setBannerPreview(null);
                        }}
                        className="text-sm text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-[#d7ff42] hover:text-[#d7ff42]/80">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          {...register('bannerImage')}
                          className="sr-only"
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Event Website
                </label>
                <input
                  type="url"
                  {...register('website')}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Maximum Participants
                </label>
                <input
                  type="number"
                  {...register('maxParticipants', { required: 'Maximum participants is required' })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
                {errors.maxParticipants && <p className="text-red-500 text-sm mt-1">{errors.maxParticipants.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Start Date & Time
                </label>
                <Controller
                  control={control}
                  name="startDateTime"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      selected={value}
                      onChange={onChange}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white"
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  End Date & Time
                </label>
                <Controller
                  control={control}
                  name="endDateTime"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      selected={value}
                      onChange={onChange}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white"
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Registration Deadline
              </label>
              <Controller
                control={control}
                name="registrationDeadline"
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    selected={value}
                    onChange={onChange}
                    dateFormat="MMMM d, yyyy"
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">Event Mode</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('mode')}
                    value="online"
                    className="text-[#d7ff42] bg-[#1d2132] border-gray-700 focus:ring-[#d7ff42]"
                  />
                  <span className="ml-2 text-gray-200">Online</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('mode')}
                    value="offline"
                    className="text-[#d7ff42] bg-[#1d2132] border-gray-700 focus:ring-[#d7ff42]"
                  />
                  <span className="ml-2 text-gray-200">Offline</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('mode')}
                    value="hybrid"
                    className="text-[#d7ff42] bg-[#1d2132] border-gray-700 focus:ring-[#d7ff42]"
                  />
                  <span className="ml-2 text-gray-200">Hybrid</span>
                </label>
              </div>
            </div>

            {(eventMode === 'offline' || eventMode === 'hybrid') && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Venue
                </label>
                <input
                  {...register('venue', { required: 'Venue is required for offline events' })}
                  placeholder="Enter full venue address"
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
                {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue.message}</p>}
              </div>
            )}

            {(eventMode === 'online' || eventMode === 'hybrid') && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Streaming Link
                </label>
                <input
                  {...register('streamingLink', { required: 'Streaming link is required for online events' })}
                  placeholder="Enter streaming URL"
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
                {errors.streamingLink && <p className="text-red-500 text-sm mt-1">{errors.streamingLink.message}</p>}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">Entry Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('entryType')}
                    value="free"
                    className="text-[#d7ff42] bg-[#1d2132] border-gray-700 focus:ring-[#d7ff42]"
                  />
                  <span className="ml-2 text-gray-200">Free</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('entryType')}
                    value="paid"
                    className="text-[#d7ff42] bg-[#1d2132] border-gray-700 focus:ring-[#d7ff42]"
                  />
                  <span className="ml-2 text-gray-200">Paid</span>
                </label>
              </div>
            </div>

            {entryType === 'paid' && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Ticket Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('ticketPrice', { required: 'Ticket price is required for paid events' })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
                {errors.ticketPrice && <p className="text-red-500 text-sm mt-1">{errors.ticketPrice.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Event Status
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Event Languages
              </label>
              <select
                multiple
                {...register('languages')}
                className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="malayalam">Malayalam</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
              </select>
              <p className="text-gray-400 text-xs mt-1">Hold Ctrl/Cmd to select multiple languages</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Organizer Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Organizer Name
              </label>
              <input
                {...register('organizerName', { required: 'Organizer name is required' })}
                className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
              />
              {errors.organizerName && <p className="text-red-500 text-sm mt-1">{errors.organizerName.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('organizerEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format'
                    }
                  })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
                {errors.organizerEmail && <p className="text-red-500 text-sm mt-1">{errors.organizerEmail.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register('organizerPhone', { required: 'Phone number is required' })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
                {errors.organizerPhone && <p className="text-red-500 text-sm mt-1">{errors.organizerPhone.message}</p>}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Speakers</h2>
            <button
              type="button"
              onClick={() => appendSpeaker({ name: '', bio: '', topic: '' })}
              className="flex items-center text-[#d7ff42] hover:text-opacity-80"
            >
              <FaPlus className="mr-2" />
              Add Speaker
            </button>
          </div>

          <div className="space-y-4">
            {speakerFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-[#1d2132] rounded-[10px]">
                <div className="flex justify-between mb-4">
                  <h3 className="text-white font-medium">Speaker {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeSpeaker(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    {...register(`speakers.${index}.name` as const)}
                    placeholder="Speaker Name"
                    className="w-full px-4 py-2 bg-[#222839] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                  <input
                    {...register(`speakers.${index}.topic` as const)}
                    placeholder="Topic"
                    className="w-full px-4 py-2 bg-[#222839] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                  <textarea
                    {...register(`speakers.${index}.bio` as const)}
                    placeholder="Speaker Bio"
                    rows={3}
                    className="w-full px-4 py-2 bg-[#222839] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Speaker Image
                    </label>
                    <input
                      type="file"
                      {...register(`speakers.${index}.image` as const)}
                      className="hidden"
                      id={`speaker-image-${index}`}
                      accept="image/*"
                    />
                    <label
                      htmlFor={`speaker-image-${index}`}
                      className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-700 rounded-lg bg-[#222839] cursor-pointer"
                    >
                      <div className="text-center">
                        <FaImage className="mx-auto h-6 w-6 text-gray-400" />
                        <span className="text-sm text-gray-400">Upload photo</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-[#d7ff42] text-[#1d2132] rounded-[10px] font-semibold hover:bg-opacity-90 transform hover:scale-[1.02] transition-all duration-200 flex items-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 border-2 border-t-transparent border-[#1d2132] rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Update Event
              </>
            )}
          </button>
        </div>
      </form>
    
    </div>
  );
};

export default EditEvent;

