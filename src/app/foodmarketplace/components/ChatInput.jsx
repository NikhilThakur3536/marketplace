"use client";
import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Simulate file upload (replace with actual file upload logic)
    const uploadedUrls = files.map((file) => `https://example.com/${file.name}`);
    setAttachments(uploadedUrls);
  };

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {/* Attachment button */}
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors rounded-md cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </label>

        {/* Message input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={disabled}
            className="w-full h-10 pr-12 pl-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
          />
          {/* Emoji button */}
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-orange-500 transition-colors rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="m9 9 1.5 1.5L12 9l1.5 1.5L15 9" />
              <path d="m9 15a3 3 0 0 0 6 0" />
            </svg>
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m22 2-7 20-4-9-9-4zm0 0l-7 8" />
          </svg>
        </button>
      </form>
      {attachments.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Attachments: {attachments.map((url) => url.split('/').pop()).join(', ')}
        </div>
      )}
    </div>
  );
};

export default ChatInput;