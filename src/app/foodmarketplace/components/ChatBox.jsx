"use client";
import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message! This is a demo response from the AI assistant. In a real implementation, this would be connected to an actual AI service.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full w-14 h-14 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-80 h-96 flex flex-col bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
              <p className="text-white/80 text-xs">Online</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white hover:bg-white/10 w-8 h-8 p-0 rounded transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-orange-50 to-orange-100/50 p-4 space-y-1">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};

export default ChatBox;
