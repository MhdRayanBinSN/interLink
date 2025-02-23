import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaImage, FaCloudUploadAlt, FaCalendarPlus, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface ICreateEventProps {}

type EventFormData = {
  // Basic Details
  title: string;
  eventType: string;
  category: string;
  description: string;
  bannerImage?: FileList;
  
  // Organizer Details
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  organizationName?: string;
  
  // Schedule & Location
  startDateTime: Date;
  endDateTime: Date;
  mode: 'online' | 'offline' | 'hybrid';
  venue?: string;
  
  // Participation Details
  targetAudience: string[];
  eligibilityCriteria?: string;
  maxParticipants: number;
  registrationDeadline: Date;
  
  // Ticketing
  entryType: 'free' | 'paid';
  ticketPrice?: number;
  paymentGateway?: string;
  
  // Additional Info
  speakers: {
    name: string;
    bio: string;
    topic: string;
  }[];
  agenda?: string;
  resources?: FileList;
  socialLinks: {
    platform: string;
    url: string;
  }[];
  
  // Technical Details
  streamingLink?: string;
  status: string;

  // Additional fields
  eventWebsite?: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    upiId?: string;
  };
};

const FORM_STEPS = [
  { id: 1, title: 'Basic Details' },
  { id: 2, title: 'Media & Links' },
  { id: 3, title: 'Organizer Info' },
  { id: 4, title: 'Schedule' },
  { id: 5, title: 'Participation' },
  { id: 6, title: 'Ticketing' },
  { id: 7, title: 'Additional Info' },
  { id: 8, title: 'Technical Details' },
];

const CreateEvent: React.FunctionComponent<ICreateEventProps> = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, control, handleSubmit, watch, formState: { errors }, trigger } = useForm<EventFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "speakers"
  });

  // Add this with your other useFieldArray calls
  const { fields: socialLinkFields, append: appendSocialLink, remove: removeSocialLink } = useFieldArray({
    control,
    name: "socialLinks"
  });

  const eventMode = watch('mode');
  const entryType = watch('entryType');

  const onSubmit = async (data: EventFormData) => {
    try {
      // Mock API call
      console.log('Form data:', data);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await trigger(fields as (keyof EventFormData)[]);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof EventFormData)[] => {
    switch (step) {
      case 1:
        return ['title', 'eventType', 'category', 'description'];
      case 2:
        return ['bannerImage', 'eventWebsite', 'socialLinks'];
      // ... add cases for other steps
      default:
        return [];
    }
  };

  function setValue(arg0: string, date: Date): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {FORM_STEPS.map(step => (
            <div
              key={step.id}
              className={`flex-1 h-2 mx-1 rounded-full ${
                step.id <= currentStep ? 'bg-[#d7ff42]' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white text-center">
          {FORM_STEPS[currentStep - 1].title}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Basic Event Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Event Title
                </label>
                <input
                  {...register('title', { required: 'Event title is required' })}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                )}
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
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
              </div>

              {/* Continue with other sections following the same pattern */}
            </div>
          </motion.div>
        )}

        {/* Step 2: Media & Links */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Event Media & Links</h2>
            <div className="space-y-6">
              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Event Banner
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-[10px] bg-[#1d2132]">
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
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Website */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Event Website
                </label>
                <input
                  type="url"
                  {...register('eventWebsite')}
                  placeholder="https://"
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
              </div>

              {/* Social Media Links */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-200">
                    Social Media Links
                  </label>
                  <button
                    type="button"
                    onClick={() => appendSocialLink({ platform: '', url: '' })}
                    className="flex items-center text-[#d7ff42] hover:text-opacity-80"
                  >
                    <FaPlus className="mr-2" />
                    Add Link
                  </button>
                </div>
                {socialLinkFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 mb-4">
                    <select
                      {...register(`socialLinks.${index}.platform` as const)}
                      className="w-1/3 px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    >
                      <option value="">Select Platform</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                    </select>
                    <div className="flex-1 relative">
                      <input
                        type="url"
                        {...register(`socialLinks.${index}.url` as const)}
                        placeholder="https://"
                        className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="absolute right-2 top-2 text-red-500 hover:text-red-400"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resources/Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Resources & Attachments
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-[10px] bg-[#1d2132]">
                  <div className="space-y-1 text-center">
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-[#d7ff42] hover:text-[#d7ff42]/80">
                        <span>Upload files</span>
                        <input
                          type="file"
                          multiple
                          {...register('resources')}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PDF, DOC, PPT up to 10MB each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Organizer Info */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Organizer Details</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Organizer Name
                  </label>
                  <input
                    {...register('organizerName', { required: 'Organizer name is required' })}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Organization/College Name
                  </label>
                  <input
                    {...register('organizationName')}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
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
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
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
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Schedule */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Schedule & Location</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Start Date & Time
                  </label>
                  <DatePicker
                    selected={watch('startDateTime')}
                    onChange={(date: Date | null) => date && setValue('startDateTime', date)}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    End Date & Time
                  </label>
                  <DatePicker
                    selected={watch('endDateTime')}
                    onChange={(date: Date | null) => date && setValue('endDateTime', date)}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Event Mode</label>
                <div className="flex space-x-4">
                  {['online', 'offline', 'hybrid'].map((mode) => (
                    <label key={mode} className="flex items-center">
                      <input
                        type="radio"
                        {...register('mode')}
                        value={mode}
                        className="text-[#d7ff42] bg-[#1d2132] border-gray-700 focus:ring-[#d7ff42]"
                      />
                      <span className="ml-2 text-gray-200 capitalize">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {(eventMode === 'offline' || eventMode === 'hybrid') && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Venue
                  </label>
                  <input
                    {...register('venue', { required: 'Venue is required for offline events' })}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 5: Participation */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Participation Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Target Audience
                </label>
                <select
                  multiple
                  {...register('targetAudience')}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                >
                  <option value="students">Students</option>
                  <option value="professionals">Professionals</option>
                  <option value="all">Open for All</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Maximum Participants
                  </label>
                  <input
                    type="number"
                    {...register('maxParticipants', { required: 'Maximum participants is required' })}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Registration Deadline
                  </label>
                  <DatePicker
                    selected={watch('registrationDeadline')}
                    onChange={(date: Date | null) => date && setValue('registrationDeadline', date)}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 6: Ticketing */}
        {currentStep === 6 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Ticketing & Fees</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Entry Type</label>
                <div className="flex space-x-4">
                  {['free', 'paid'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        {...register('entryType')}
                        value={type}
                        className="text-[#d7ff42] bg-[#1d2132] border-gray-700 focus:ring-[#d7ff42]"
                      />
                      <span className="ml-2 text-gray-200 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {entryType === 'paid' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Ticket Price (₹)
                    </label>
                    <input
                      type="number"
                      {...register('ticketPrice', { required: 'Ticket price is required for paid events' })}
                      className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Payment Gateway
                    </label>
                    <select
                      {...register('paymentGateway')}
                      className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    >
                      <option value="">Select Gateway</option>
                      <option value="razorpay">Razorpay</option>
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 7: Additional Info */}
        {currentStep === 7 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Additional Information</h2>
            <div className="space-y-6">
              {/* Speakers */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-200">
                    Speakers
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ name: '', bio: '', topic: '' })}
                    className="flex items-center text-[#d7ff42] hover:text-opacity-80"
                  >
                    <FaPlus className="mr-2" />
                    Add Speaker
                  </button>
                </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 bg-[#1d2132] rounded-[10px] mb-4">
                    <div className="flex justify-between mb-4">
                      <h4 className="text-white font-medium">Speaker {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => remove(index)}
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Agenda */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Event Agenda
                </label>
                <textarea
                  {...register('agenda')}
                  rows={4}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 8: Technical Details */}
        {currentStep === 8 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Technical Details</h2>
            <div className="space-y-4">
              {(eventMode === 'online' || eventMode === 'hybrid') && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Streaming Link
                  </label>
                  <input
                    {...register('streamingLink', { 
                      required: 'Streaming link is required for online events'
                    })}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
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
            </div>
          </motion.div>
        )}

        {/* Bank Details */}
        {entryType === 'paid' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Bank Details</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    {...register('bankDetails.accountName', { required: 'Account name is required' })}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    {...register('bankDetails.accountNumber', { required: 'Account number is required' })}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Bank Name
                  </label>
                  <input
                    {...register('bankDetails.bankName', { required: 'Bank name is required' })}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    IFSC Code
                  </label>
                  <input
                    {...register('bankDetails.ifscCode', { required: 'IFSC code is required' })}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    UPI ID (Optional)
                  </label>
                  <input
                    {...register('bankDetails.upiId')}
                    className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 bg-gray-700 text-white rounded-[10px] font-semibold hover:bg-opacity-90 transform hover:scale-[1.02] transition-all duration-200 flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              Previous
            </button>
          )}
          
          {currentStep < FORM_STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-[#7557e1] text-white rounded-[10px] font-semibold hover:bg-opacity-90 transform hover:scale-[1.02] transition-all duration-200 flex items-center ml-auto"
            >
              Next
              <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-4 bg-[#d7ff42] text-[#1d2132] rounded-[10px] font-semibold hover:bg-opacity-90 transform hover:scale-[1.02] transition-all duration-200 flex items-center ml-auto"
            >
              <FaCalendarPlus className="mr-2" />
              Create Event
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
