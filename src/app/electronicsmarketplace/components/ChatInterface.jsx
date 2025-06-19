"use client"

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatInterface = ({ onClose, participantId = "d7a34198-0efb-4f93-968c-3ce80fdd9ba3", customerId = "4b0f3e8c-6715-46bb-ae71-87279a38ed76" }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [chatId, setChatId] = useState(null);
  const [token, setToken] = useState(null);
  const messagesEndRef = useRef(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Retrieve token and set Axios headers
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      setToken(userToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    } else {
      console.error("No user token found in localStorage");
    }
  }, []);

  // Fetch chat list and select or create chat
  const initializeChat = async () => {
    if (!token) {
      console.error("Cannot initialize chat: No user token available");
      return;
    }
    try {
      // Fetch chat list
      const response = await axios.get(`${BASE_URL}/user/chat/list`);
      if (response.data.success) {
        const chats = response.data.data;
        // Find a chat with matching participantId and customerId
        const existingChat = chats.find(
          (chat) =>
            chat.participantId === participantId &&
            chat.customerId === customerId &&
            chat.chatType === "direct"
        );
        if (existingChat) {
          setChatId(existingChat.id);
        } else {
          // Create a new chat if no matching chat is found
          await createChat();
        }
      }
    } catch (error) {
      console.error("Error fetching chat list:", error);
      // Fallback to creating a new chat
      await createChat();
    }
  };

  // Create a new chat session
  const createChat = async () => {
    if (!token) {
      console.error("Cannot create chat: No user token available");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/user/chat/create`, {
        participantId,
        participantType: "seller",
        chatType: "direct",
      });
      if (response.data.success) {
        setChatId(response.data.data.id);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  // Fetch messages for the chat
  const fetchMessages = async () => {
    if (!chatId || !token) {
      console.error("Cannot fetch messages: Missing chatId or token");
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/user/chat/${chatId}/messages`);
      if (response.data.success) {
        setMessages(response.data.data.map((msg) => ({
          id: msg.id,
          text: msg.messageText,
          sender: msg.senderId === customerId ? "user" : "ai",
          timestamp: new Date(msg.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: " Rosalia 2025-11-03 13:03:23 -0700",
            hour12: false,
          }),
          attachments: msg.attachments || [],
          isDeleted: msg.isDeleted,
        })));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatId || !token) {
      console.error("Cannot send message: Missing input, chatId, or token");
      return;
    }

    try {
      const newMessage = {
        messageText: inputValue,
        attachments: [],
      };
      const response = await axios.post(`${BASE_URL}/user/chat/${chatId}/message`, newMessage);
      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: response.data.data.id,
            text: response.data.data.messageText,
            sender: "user",
            timestamp: new Date(response.data.data.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            attachments: response.data.data.attachments,
            isDeleted: response.data.data.isDeleted,
          },
        ]);
        setInputValue("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Delete a message
  const handleDeleteMessage = async (messageId) => {
    if (!token) {
      console.error("Cannot delete message: No user token available");
      return;
    }
    try {
      const response = await axios.delete(`${BASE_URL}/user/chat/messages/${messageId}`);
      if (response.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isDeleted: true, text: "This message was deleted" } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (token) {
      initializeChat();
    }
  }, [token]);

  useEffect(() => {
    if (chatId && token) {
      fetchMessages();
    }
  }, [chatId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-80">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-400 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">AI Assistant</h3>
            <p className="text-white text-opacity-90 text-xs">Online</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-opacity-80 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="h-64 overflow-y-auto bg-gray-50 p-3 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } items-start`}
            >
              {message.sender === "ai" && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-xs">AI</span>
                </div>
              )}
              <div
                className={`max-w-48 px-3 py-2 rounded-lg text-xs ${
                  message.sender === "user"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm border"
                } ${message.isDeleted ? "opacity-50 italic" : ""}`}
              >
                <p>{message.text}</p>
                {message.attachments.length > 0 && (
                  <div className="mt-2">
                    {message.attachments.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-xs"
                      >
                        Attachment {index + 1}
                      </a>
                    ))}
                  </div>
                )}
                {message.sender === "user" && !message.isDeleted && (
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="text-red-500 text-xs mt-1 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div
              className={`text-xs text-gray-500 mt-1 ${
                message.sender === "user" ? "text-right mr-2" : "text-left ml-8"
              }`}
            >
              {message.timestamp}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message"
              className="w-full px-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !chatId || !token}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;