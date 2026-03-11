import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isAfter, isBefore, isSameDay, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarStep = ({ selectedDate, onSelectDate }) => {
  // Hardcoded for March 2026 based on requirements
  const currentMonth = new Date(2026, 2, 1); // March is 0-indexed (2)
  
  // Date constraints: disable past dates (simulated as before March 9, 2026 for this demo)
  // and disable weekends
  const todaySimulated = new Date(2026, 2, 9);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = monthStart;
  const endDate = monthEnd;
  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Helper to get day index where Monday = 0, Sunday = 6
  const getDayIndex = (date) => {
    const day = getDay(date);
    return day === 0 ? 6 : day - 1;
  };

  const isDateDisabled = (date) => {
    const dayIndex = getDayIndex(date);
    const isWeekend = dayIndex === 5 || dayIndex === 6; // Sat=5, Sun=6 in our 0-indexed array where Mon=0
    const isPast = isBefore(date, todaySimulated);
    return isWeekend || isPast;
  };

  // Calculate empty padding days for the start of the month
  const startDayIndex = getDayIndex(monthStart);
  const paddingDays = Array.from({ length: startDayIndex }).fill(null);

  return (
    <div className="w-full flex-1">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-2xl font-semibold mb-4 border-2 border-slate-300">
          V
        </div>
        <h2 className="text-xl text-white font-medium mb-1">Meet with Victoire Serruys</h2>
      </div>

      <div className="mb-6">
        <div className="flex justify-center items-center text-white mb-6">
          <button className="p-1 opacity-50 cursor-not-allowed">
             <ChevronLeft size={20} />
          </button>
          <span className="font-semibold text-lg mx-4">
            {format(currentMonth, dateFormat)}
          </span>
          <button className="p-1 opacity-50 cursor-not-allowed">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((day) => (
            <div key={day} className="text-xs font-semibold text-slate-300 mb-4 tracking-wider">
              {day}
            </div>
          ))}
          
          {paddingDays.map((_, index) => (
             <div key={`empty-${index}`} className="h-10"></div>
          ))}
          
          {days.map((day, index) => {
            const disabled = isDateDisabled(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const formattedDay = format(day, "d");
            const fullDateStr = format(day, "MMMM d, yyyy");
            
            return (
              <div key={index} className="flex justify-center items-center h-10 mb-1 relative">
                <button
                  onClick={() => !disabled && onSelectDate(day)}
                  disabled={disabled}
                  aria-label={disabled ? `${fullDateStr} - Not available` : isSelected ? `${fullDateStr} - Selected` : `${fullDateStr} - Available`}
                  aria-pressed={isSelected}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-700 focus-visible:ring-blue-400
                    ${disabled ? 'text-slate-500/50 cursor-not-allowed line-through decoration-slate-500/30 font-normal hover:bg-transparent' : 'text-slate-100 hover:bg-slate-600/70 cursor-pointer active:scale-95'}
                    ${isSelected ? 'bg-white text-slate-800 hover:bg-slate-100 font-bold shadow-md shadow-slate-900/20 ring-2 ring-white ring-offset-2 ring-offset-slate-700' : ''}
                  `}
                >
                  {formattedDay}
                </button>
                {/* Subtle indicator dot for today or available dates could go here if wanted */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarStep;
