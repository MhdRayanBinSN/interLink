import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSave, FaImage, FaCloudUploadAlt, FaPlus, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
  }[];
};

const EditEvent: React.FunctionComponent<IEditEventProps> = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, control, watch } = useForm<EventFormData>();
  const [isLoading, setIsLoading] = useState(true);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "speakers"
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Mock API call - replace with actual API call
        const mockEventData = {
          title: 'React Summit 2024',
          description: 'A conference about React and modern web development',
          website: 'https://reactsummit2024.com',
          maxParticipants: 500,
          registrationDeadline: new Date('2024-06-01'),
          speakers: [
            {
              name: 'John Doe',
              bio: 'Senior React Developer',
              topic: 'React Performance'
            }
          ]
        };

        Object.entries(mockEventData).forEach(([key, value]) => {
          setValue(key as keyof EventFormData, value);
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventData();
  }, [setValue, eventId]);

  const onSubmit = async (data: EventFormData) => {
    try {
      console.log('Updating event:', data);
      navigate(`/organizer/dashboard/event/${eventId}/statistics`);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d7ff42]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Event Details</h2>
          <div className="space-y-6">
            {/* Title and Description */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Event Title
              </label>
              <input
                {...register('title', { required: 'Event title is required' })}
                className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
              />
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
                  </div>
                </div>
              </div>
            </div>

            {/* Website and Participants */}
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
                  {...register('maxParticipants')}
                  className="w-full px-4 py-2 bg-[#1d2132] border border-gray-700 rounded-[10px] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                />
              </div>
            </div>

            {/* Registration Deadline */}
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
        </motion.div>

        {/* Speakers Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#222839] p-6 rounded-[10px] border border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Speakers</h2>
            <button
              type="button"
              onClick={() => append({ name: '', bio: '', topic: '' })}
              className="flex items-center text-[#d7ff42] hover:text-opacity-80"
            >
              <FaPlus className="mr-2" />
              Add Speaker
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-[#1d2132] rounded-[10px]">
                <div className="flex justify-between mb-4">
                  <h3 className="text-white font-medium">Speaker {index + 1}</h3>
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
        </motion.div>

        {/* Update Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#d7ff42] text-[#1d2132] rounded-[10px] font-semibold hover:bg-opacity-90 transform hover:scale-[1.02] transition-all duration-200 flex items-center"
          >
            <FaSave className="mr-2" />
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
