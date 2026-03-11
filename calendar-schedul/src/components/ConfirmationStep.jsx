import React from 'react';
import { format } from 'date-fns';

const ConfirmationStep = ({ bookingDetails }) => {
  const { date, time, attendeeName, attendeeEmail, timezoneLabel } = bookingDetails;
  
  const formattedDate = date ? format(new Date(date), "d MMMM yyyy") : "";

  return (
    <div className="flex-1 w-full bg-white px-6 py-12 md:p-16 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
      <div className="relative mb-8 md:mb-10">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center bg-teal-50 mx-auto animate-success-pop shadow-sm border border-teal-100/50">
          {/* Decorative Success Graphic */}
          <div className="relative">
             <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 md:w-20 md:h-20">
                <circle cx="32" cy="32" r="32" fill="#E6F4F1" className="opacity-50"/>
                <path d="M43.5 24.5L28.5 39.5L20.5 31.5" stroke="#0F766E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark"/>
                
                {/* Decorative floating dots/balloons */}
                <circle cx="12" cy="18" r="5" fill="#818CF8" className="animate-pulse" style={{ animationDelay: '300ms' }} />
                <circle cx="52" cy="14" r="6" fill="#F472B6" className="animate-pulse" style={{ animationDelay: '600ms' }} />
                <circle cx="48" cy="50" r="4" fill="#FBBF24" className="animate-pulse" style={{ animationDelay: '100ms' }} />
             </svg>
          </div>
        </div>
      </div>

      <div className="animate-fade-up max-w-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 tracking-tight">Booking confirmed</h2>
        <p className="text-base text-gray-600 mb-2">
          You're successfully booked with <span className="font-semibold text-gray-800">Victoire Serruys</span>.
        </p>
        <p className="text-sm text-gray-500 mb-10">
          A calendar invitation has been sent to your email.
        </p>

          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">{formattedDate}</h3>
          <p className="text-lg md:text-xl font-bold text-teal-700 mb-2">{time}</p>
          <div className="text-xs font-medium text-gray-500 bg-white border border-gray-200 inline-block px-3 py-1 rounded-full shadow-sm">
            {timezoneLabel}
          </div>
        
        <div className="pt-2 w-full text-sm flex flex-col items-center space-y-1">
          <span className="text-gray-400 font-medium uppercase tracking-wider text-[11px]">Confirmation sent to</span>
          <span className="font-semibold text-gray-700 px-3 py-1.5 rounded-md break-all w-full max-w-xs">{attendeeEmail}</span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
