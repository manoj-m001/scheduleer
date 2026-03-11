import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { TIMEZONES } from '../constants';
import { ChevronDown, Globe } from 'lucide-react';

const TimeSlotSelection = ({ selectedDate, selectedTimezone, onSelectTimezone, onSelectTime }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch slots from backend
  useEffect(() => {
    if (!selectedDate) return;
    
    setLoading(true);
    
    // Convert to ISO string for backend query
    const isoDate = selectedDate.toISOString();
    
    fetch(`http://localhost:5000/api/slots?date=${encodeURIComponent(isoDate)}`)
      .then(res => res.json())
      .then(data => {
         if (data.slots) {
            setAvailableSlots(data.slots);
         } else {
            // fallback
            setAvailableSlots([]);
         }
      })
      .catch(err => {
         console.error("Failed to fetch time slots", err);
         setAvailableSlots([]);
      })
      .finally(() => {
         setLoading(false);
      });
      
  }, [selectedDate, selectedTimezone]);

  if (!selectedDate) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-gray-400">
        Please select a date on the calendar.
      </div>
    );
  }

  const selectedTzObj = TIMEZONES.find(tz => tz.value === selectedTimezone) || TIMEZONES[1];

  return (
    <div className="flex-1 px-8 py-6 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Meeting location</h3>
        <div className="flex items-center text-gray-600 text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          Google Meet
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Meeting duration</h3>
        <div className="bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded font-medium inline-block w-full text-center">
          30 min.
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-base font-semibold text-gray-800 mb-1">What time works best?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Showing times for <span className="font-semibold text-gray-800">{format(selectedDate, "d MMMM yyyy")}</span>
        </p>

        {/* Timezone Switcher */}
        <div className="relative mb-4">
          <button 
            type="button"
            className="flex items-center text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors w-full bg-transparent"
            onClick={() => setIsOpenMenu(!isOpenMenu)}
          >
            {selectedTzObj.label}
            <ChevronDown size={14} className="ml-1" />
          </button>
          
          {isOpenMenu && (
            <div className="absolute z-10 mt-1 pb-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto left-0 origin-top-left">
              <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                <div className="flex items-center bg-gray-50 border border-teal-500 rounded px-2 py-1.5 rounded text-sm group-hover:border-teal-500 transition-colors">
                  <span className="text-gray-400 mr-2"><Globe size={14} /></span>
                  <input type="text" placeholder="Search" className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400" />
                </div>
              </div>
              <ul className="py-1">
                {TIMEZONES.map((tz) => (
                  <li key={tz.value}>
                     <button
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-teal-50 hover:text-teal-800 transition-colors ${
                          selectedTimezone === tz.value ? 'bg-teal-50 text-teal-800 font-medium' : 'text-gray-600'
                        }`}
                        onClick={() => {
                          onSelectTimezone(tz.value);
                          setIsOpenMenu(false);
                        }}
                      >
                        {tz.label}
                      </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Time slots */}
        <div className="overflow-y-auto flex-1 pr-2 space-y-2 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {loading ? (
            <div className="h-full flex items-center justify-center"><div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            availableSlots.map((time, idx) => (
              <button
                key={idx}
                className="w-full py-3 border border-gray-200 rounded-md text-teal-700 font-semibold hover:border-teal-600 hover:bg-teal-50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent flex justify-center items-center"
                onClick={() => onSelectTime(time)}
              >
                {time}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelection;
