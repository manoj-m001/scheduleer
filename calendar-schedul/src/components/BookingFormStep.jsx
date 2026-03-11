import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { MapPin, ArrowLeft } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(2, { message: "First name is required (min 2 characters)" }),
  surname: z.string().min(2, { message: "Surname is required (min 2 characters)" }),
  email: z.string().email({ message: "Invalid email address" }),
});

const BookingFormStep = ({ selectedDate, selectedTime, selectedTimezoneObj, onBack, onSubmit, isLoading, submitError }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const formattedDate = selectedDate ? format(selectedDate, "EEEE, d MMMM yyyy") : "";

  return (
    <div className="flex-1 w-full bg-white p-8 px-12 pb-12 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your information</h2>
        
        <div className="mb-6">
          <div className="flex items-center text-sm font-semibold text-gray-800 mb-1">
            {formattedDate} {selectedTime} <span className="ml-2 text-teal-600 font-normal cursor-pointer hover:underline" onClick={onBack}>Edit</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={14} className="mr-1" />
            Google Meet
          </div>
          <div className="text-xs text-gray-400 mt-1">({selectedTimezoneObj.label})</div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-sm text-red-700 font-medium leading-tight">{submitError}</p>
          </div>
        )}

        <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center">
                First name <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                {...register("firstName")}
                disabled={isLoading}
                className={`w-full p-2.5 text-sm border rounded-md outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 ${
                  errors.firstName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center">
                Surname <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                {...register("surname")}
                disabled={isLoading}
                className={`w-full p-2.5 text-sm border rounded-md outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 ${
                  errors.surname ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname.message}</p>}
            </div>
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center">
                Your email address <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                disabled={isLoading}
                className={`w-full p-2.5 text-sm border rounded-md outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400 ${
                  errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </form>
      </div>

      <div className="flex justify-between items-center mt-12 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 rounded text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <button
          type="submit"
          form="booking-form"
          disabled={isLoading}
          className="px-6 py-2 bg-slate-700 text-white rounded text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center min-w-[120px] justify-center"
        >
          {isLoading ? (
             <span className="flex items-center">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Processing...
             </span>
          ) : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default BookingFormStep;
