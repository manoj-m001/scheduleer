import React from 'react';
import { STAGES } from '../constants';

const ProgressBar = ({ stage }) => {
  const isDetailsOrConfirmation = stage === STAGES.DETAILS || stage === STAGES.CONFIRMATION;
  return (
    <div className="flex flex-col items-center mb-8 w-full max-w-lg mx-auto">
      <div className="flex items-center w-full relative h-2 mb-2">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-orange-400 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: isDetailsOrConfirmation ? '100%' : '50%' }}
        ></div>
        
        <div className="flex justify-between w-full z-10 px-12">
          {/* Step 1 Circle */}
          <div className="relative flex justify-center">
            <div className={`w-4 h-4 rounded-full border-2 bg-white ${
              stage === STAGES.CALENDAR 
                ? 'border-orange-400' 
                : 'border-orange-400 bg-orange-400'
            } flex items-center justify-center`}>
              {isDetailsOrConfirmation && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              )}
            </div>
          </div>
          
          {/* Step 2 Circle */}
          <div className="relative flex justify-center">
             <div className={`w-4 h-4 rounded-full border-2 bg-white ${
              isDetailsOrConfirmation 
                ? 'border-orange-400' 
                : 'border-gray-300'
            } flex items-center justify-center`}>
               {stage === STAGES.CONFIRMATION && (
                 <svg className="w-2.5 h-2.5 text-white bg-orange-400 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
               )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between w-full px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <span className={stage === STAGES.CALENDAR ? "text-gray-800" : ""}>Choose time</span>
        <span className={isDetailsOrConfirmation ? "text-gray-800" : ""}>Your info</span>
      </div>
    </div>
  );
};

export default ProgressBar;
