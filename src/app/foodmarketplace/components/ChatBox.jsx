"use client";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatId, setChatId] = useState(null);
  const messagesEndRef = useRef(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
//   const AUTH_TOKEN = 'YOUR_AUTH_TOKEN'; // Replace with actual token
//   const PARTICIPANT_ID = 'd7a34198-0efb-4f93-968c-3ce80fdd9ba3'; // Replace with actual participant ID
//   const CUSTOMER_ID = '4b0f3e8c-6715-46bb-ae71-87279a38ed76'; // Replace with actual customer ID

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Create a new chat on component mount
  useEffect(() => {
    const id = localStorage.getItem("custoemrId")
    const token = localStorage.getItem("userToken")
    const createChat = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/user/chat/create`,
          {
            participantId: id,
            participantType: 'seller',
            chatType: 'direct',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChatId(response.data.data.id);
        // Optionally fetch initial messages here
        fetchMessages(response.data.data.id);
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    };

    createChat();
  }, []);

  // Fetch messages for the chat
  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/chat/${chatId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );
      // Assuming the response contains an array of messages
      const fetchedMessages = response.data.data.map((msg) => ({
        id: msg.id,
        text: msg.messageText,
        isUser: msg.senderId === CUSTOMER_ID,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        attachments: msg.attachments || [],
      }));
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (text) => {
    if (!chatId) return;

    const newMessage = {
      id: Date.now().toString(), // Temporary ID until API response
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/user/chat/${chatId}/message`,
        {
          messageText: text,
          attachments: [], // Add attachment logic if needed
        },
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      // Update the message with the actual ID from the API
      const apiMessage = response.data.data;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? {
                ...msg,
                id: apiMessage.id,
                attachments: apiMessage.attachments || [],
              }
            : msg
        )
      );

      // Simulate AI response (replace with actual AI integration if needed)
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message! This is a demo response from the AI assistant.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
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
              attachments={message.attachments} // Pass attachments if needed
            />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping || !chatId} />
      </div>
    </div>
  );
};

export default ChatBox;