import React from 'react';
import { format } from 'date-fns';

const ConfirmationStep = ({ bookingDetails }) => {
  const { date, time, attendeeName, attendeeEmail, timezoneLabel } = bookingDetails;
  
  const formattedDate = date ? format(new Date(date), "d MMMM yyyy") : "";

  return (
    <div className="flex-1 w-full bg-white p-12 flex flex-col items-center justify-center text-center h-full">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-teal-50 mx-auto">
          {/* Decorative Success Graphic */}
          <div className="relative">
             <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#E6F4F1"/>
                <path d="M43.5 24.5L28.5 39.5L20.5 31.5" stroke="#0F766E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                
                {/* Balloons */}
                <circle cx="16" cy="18" r="6" fill="#818CF8" />
                <path d="M16 24V30" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
                
                <circle cx="48" cy="14" r="8" fill="#F472B6" />
                <path d="M48 22V32" stroke="#F472B6" strokeWidth="2" strokeLinecap="round"/>
             </svg>
          </div>
        </div>
        
        {/* Sparkles */}
        <div className="absolute top-0 right-10 text-yellow-400">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l3.5 8.5L24 12l-8.5 3.5L12 24l-3.5-8.5L0 12l8.5-3.5L12 0z"/>
           </svg>
        </div>
        <div className="absolute bottom-4 left-6 text-yellow-400">
           <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l3.5 8.5L24 12l-8.5 3.5L12 24l-3.5-8.5L0 12l8.5-3.5L12 0z"/>
           </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking confirmed</h2>
      <p className="text-sm text-gray-600 mb-1">
        You're booked with Victoire Serruys.
      </p>
      <p className="text-sm text-gray-600 mb-6">
        An invitation has been emailed to you.
      </p>

      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800">{formattedDate}</h3>
        <p className="text-lg font-bold text-gray-800">{time}</p>
        <p className="text-xs text-gray-500 mt-1">{timezoneLabel}</p>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100 w-full text-sm text-gray-500 pb-2 flex justify-center space-x-2">
        <span>Email sent to:</span> <span className="font-semibold text-gray-700">{attendeeEmail}</span>
      </div>
    </div>
  );
};

export default ConfirmationStep;
