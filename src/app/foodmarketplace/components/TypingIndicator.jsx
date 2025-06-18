"use client";
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 mb-6 message-enter">
      
      {/* Custom Avatar */}
      <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 text-sm font-medium">
          AI
        </div>
      </div>

      {/* Typing Bubble */}
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm relative">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.1s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.2s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.3s]"></div>
        </div>

        {/* Message tail */}
        <div className="absolute w-3 h-3 bg-white border-l border-b border-gray-100 left-0 bottom-0 transform -translate-x-1 rounded-bl-full" />
      </div>
    </div>
  );
};

export default TypingIndicator;
