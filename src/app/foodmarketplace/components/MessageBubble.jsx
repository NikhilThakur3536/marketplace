"use client";
import React from 'react';

const MessageBubble = ({ message, isUser, timestamp, avatar }) => {
  return (
    <div className={`flex items-start gap-3 mb-6 message-enter ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* Custom Avatar */}
      <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
        <div className={`w-full h-full flex items-center justify-center text-sm font-medium ${
          isUser 
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
          ) : (
            isUser ? 'You' : 'AI'
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md' 
            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>

          {/* Message Tail */}
          <div className={`absolute w-3 h-3 ${
            isUser 
              ? 'bg-orange-500 right-0 bottom-0 transform translate-x-1' 
              : 'bg-white border-l border-b border-gray-100 left-0 bottom-0 transform -translate-x-1'
          } rounded-bl-full`} />
        </div>

        <span className={`text-xs text-gray-400 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
