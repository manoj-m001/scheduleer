import { useState } from 'react';
import axios from 'axios';
import { STAGES, TIMEZONES } from './constants';
import ProgressBar from './components/ProgressBar';
import CalendarStep from './components/CalendarStep';
import TimeSlotSelection from './components/TimeSlotSelection';
import BookingFormStep from './components/BookingFormStep';
import ConfirmationStep from './components/ConfirmationStep';

function App() {
  const [stage, setStage] = useState(STAGES.CALENDAR);
  
  // State for Booking
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState('+05:30'); // Default to IST/Colombo/Mumbai
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStage(STAGES.DETAILS);
  };

  const handleBookingSubmit = async (data) => {
    console.log("frontend: handleBookingSubmit triggered");
    setIsLoading(true);
    setSubmitError(null);
    
    const timezoneObj = TIMEZONES.find(tz => tz.value === selectedTimezone) || TIMEZONES[1];

    const payload = {
      firstName: data.firstName,
      surname: data.surname,
      email: data.email,
      date: selectedDate.toISOString(),
      time: selectedTime,
      timezone: selectedTimezone,
      timezoneLabel: timezoneObj.label
    };

    try {
      // Send to our backend
      console.log("frontend: starting axios POST request...");
      console.time("Booking API Call");
      const response = await axios.post('http://localhost:5000/api/book', payload);
      console.timeEnd("Booking API Call");
      console.log("frontend: API request finished, updating state...");
      
      setBookingDetails({
         ...payload,
         attendeeName: `${data.firstName} ${data.surname}`,
         attendeeEmail: data.email
      });
      setStage(STAGES.CONFIRMATION);
    } catch (error) {
      console.timeEnd("Booking API Call");
      console.error("Booking error:", error);
      if (error.response && error.response.status === 409) {
         setSubmitError("Oops! This time slot was just booked by someone else. Please select another time.");
      } else {
         setSubmitError("An error occurred while booking. Please try again or check your connection.");
      }
    } finally {
      setIsLoading(false);
      console.log("frontend: isLoading set to false");
    }
  };

  const selectedTimezoneObj = TIMEZONES.find(tz => tz.value === selectedTimezone);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans">
      
      {/* Dynamic Header based on Stage */}
      {stage !== STAGES.CONFIRMATION ? (
        <>
          <ProgressBar stage={stage} />
          <div className="flex items-center space-x-2 mb-8 text-2xl font-bold text-slate-800">
             <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center rounded-md">
                <div className="w-4 h-4 rounded-sm border-2 border-white transform rotate-45"></div>
             </div>
             <span>climatiq</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center mb-8">
           <ProgressBar stage={stage} />
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-[850px] bg-white rounded-lg shadow-xl overflow-hidden min-h-[500px] flex mx-auto relative border border-gray-100">
        
        {/* Render Stage */}
        {stage === STAGES.CALENDAR && (
          <div className="flex w-full flex-col md:flex-row h-full">
            {/* Left side: Calendar dark panel */}
            <div className="w-full md:w-1/2 bg-slate-700 p-8 flex flex-col">
              <CalendarStep 
                selectedDate={selectedDate} 
                onSelectDate={handleDateSelect} 
              />
            </div>
            
            {/* Right side: Time slots panel */}
            <div className="w-full md:w-1/2 bg-white">
              <TimeSlotSelection 
                selectedDate={selectedDate}
                selectedTimezone={selectedTimezone}
                onSelectTimezone={setSelectedTimezone}
                onSelectTime={handleTimeSelect}
              />
            </div>
          </div>
        )}

        {stage === STAGES.DETAILS && (
          <BookingFormStep
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedTimezoneObj={selectedTimezoneObj}
            onBack={() => setStage(STAGES.CALENDAR)}
            onSubmit={handleBookingSubmit}
            isLoading={isLoading}
            submitError={submitError}
          />
        )}

        {stage === STAGES.CONFIRMATION && (
          <ConfirmationStep bookingDetails={bookingDetails} />
        )}
      </div>

      {/* Floating ask button */}
      <button className="fixed bottom-6 right-6 bg-white shadow-lg border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center transition-shadow z-50">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
        Ask me anything...
      </button>

    </div>
  )
}

export default App
