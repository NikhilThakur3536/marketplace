"use client";

import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const languageId = "2bfa9d89-61c4-401e-aae3-346627460558";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chatId, setChatId] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [chatProductId, setChatProductId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [productName, setProductName] = useState(null);
  const [productDescription, setProductDescription] = useState(null);
  const [chatListCache, setChatListCache] = useState(null);

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  const checkExistingChat = useCallback(
    async (participantId, productId) => {
      if (!productId) {
        setChatError("Missing product ID");
        return { chatId: null, chatProductId: null };
      }

      try {
        const token = getToken();
        if (!token) {
          setChatError("Authentication token missing");
          return { chatId: null, chatProductId: null };
        }

        let chats = chatListCache;
        if (!chats) {
          const response = await axios.get(`${BASE_URL}/user/chat/list`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
            chats = response.data.data;
            setChatListCache(chats);
          } else {
            setChatError("No existing chats found");
            return { chatId: null, chatProductId: null };
          }
        }

        const existingChat = chats.find(
          (chat) =>
            chat.participantType === "seller" &&
            chat.chatType === "direct" &&
            chat.productId === productId &&
            chat.participantId === participantId
        );

        if (existingChat) {
          const chatProductId = existingChat.chatProducts?.[0]?.id || null;
          return { chatId: existingChat.id, chatProductId };
        }
        setChatError("No matching chat found for this product");
        return { chatId: null, chatProductId: null };
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setChatError(`Failed to check existing chats: ${errorMessage}`);
        return { chatId: null, chatProductId: null };
      }
    },
    [chatListCache]
  );

  const fetchMessages = useCallback(
    async (chatId) => {
      if (!chatId) {
        setChatError("No chat ID provided");
        return;
      }

      setIsChatLoading(true);
      setChatError(null);
      setMessages([]);
      setProductName(null);
      setProductDescription(null);

      try {
        const token = getToken();
        if (!token) {
          throw new Error("Authentication token missing");
        }

        const response = await axios.post(
          `${BASE_URL}/user/chat/messages/get`,
          { chatId, languageId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const messagesData = Array.isArray(response.data.data?.messages)
            ? response.data.data.messages
            : response.data.data?.results || [];

          setMessages(
            messagesData.length === 0
              ? []
              : messagesData.map((msg, index) => ({
                  id: msg.id || `temp-${index}`,
                  text: msg.messageText || "",
                  sender: msg.senderId === participantId ? "other" : "user",
                  timestamp: msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  attachments: msg.attachments || [],
                  proposedPrice: msg.proposedPrice || null,
                }))
          );

          if (response.data.data?.activeNegotiation) {
            setProductName(response.data.data.activeNegotiation.product?.name || "Unnamed Product");
            setProductDescription(
              response.data.data.activeNegotiation.variant?.name || "No description"
            );
          }
        } else {
          throw new Error("Failed to fetch messages: API success is false");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setChatError(`Failed to fetch messages: ${errorMessage}`);
      } finally {
        setIsChatLoading(false);
      }
    },
    [participantId]
  );

  const initiateChat = useCallback(
    async (participantId, productId, varientId, inventoryId) => {
      if (!participantId || !productId) {
        setChatError("No participant ID or product ID provided");
        return false;
      }

      if (isChatLoading) {
        return false;
      }

      setIsChatLoading(true);
      setChatError(null);
      setMessages([]);

      try {
        const { chatId: existingChatId, chatProductId: existingChatProductId } = await checkExistingChat(
          participantId,
          productId
        );
        if (existingChatId) {
          setChatId(existingChatId);
          setParticipantId(participantId);
          setChatProductId(existingChatProductId);
          await fetchMessages(existingChatId);
          return existingChatId;
        }

        const token = getToken();
        if (!token) {
          throw new Error("Authentication token missing");
        }

        const response = await axios.post(
          `${BASE_URL}/user/chat/create`,
          {
            participantId,
            participantType: "seller",
            chatType: "direct",
            productId,
            varientId,
            inventoryId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const newChatId = response.data.data.id;
          const newChatProductId = response.data.data.chatProducts?.[0]?.id || null;
          setChatId(newChatId);
          setParticipantId(participantId);
          setChatProductId(newChatProductId);
          await fetchMessages(newChatId);
          setChatListCache(null);
          return newChatId;
        }
        throw new Error("Failed to create chat session");
      } catch (err) {
        if (err.response?.data?.error === "Chat already exists" && err.response?.data?.existingChatId) {
          const existingChatId = err.response.data.existingChatId;
          setChatId(existingChatId);
          setParticipantId(participantId);
          const token = getToken();
          if (!token) {
            setChatError("Authentication token missing for fetching existing chat details");
            return false;
          }
          const chatResponse = await axios.get(`${BASE_URL}/user/chat/list`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const existingChat = chatResponse.data.data.find((chat) => chat.id === existingChatId);
          const existingChatProductId = existingChat?.chatProducts?.[0]?.id || null;
          setChatProductId(existingChatProductId);
          await fetchMessages(existingChatId);
          setChatListCache(chatResponse.data.data);
          return existingChatId;
        }

        const errorMessage = err.response?.data?.message || err.message;
        setChatError(`Failed to create chat: ${errorMessage}`);
        return false;
      } finally {
        setIsChatLoading(false);
      }
    },
    [checkExistingChat, fetchMessages, isChatLoading]
  );

  const sendMessage = useCallback(
    async (chatId, messageText, proposedPrice = null) => {
      if (!chatId || !messageText.trim()) {
        setChatError("Invalid chat ID or empty message");
        return false;
      }

      if (proposedPrice !== null && proposedPrice !== undefined && !chatProductId) {
        setChatError("Cannot send proposed price without a valid chat product ID");
        return false;
      }

      setIsSending(true);
      setChatError(null);

      const optimisticMsg = {
        id: Date.now().toString(),
        text: messageText,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        attachments: [],
        proposedPrice: proposedPrice || null,
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        const token = getToken();
        if (!token) {
          throw new Error("Authentication token missing");
        }

        const payload = { messageText };
        if (proposedPrice !== null && proposedPrice !== undefined) {
          payload.proposedPrice = parseFloat(proposedPrice);
          payload.chatProductId = chatProductId;
        }

        const response = await axios.post(`${BASE_URL}/user/chat/${chatId}/message`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === optimisticMsg.id
                ? {
                    id: response.data.data.id,
                    text: response.data.data.messageText,
                    sender: "user",
                    timestamp: new Date(response.data.data.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    attachments: response.data.data.attachments || [],
                    proposedPrice: response.data.data.proposedPrice || null,
                  }
                : msg
            )
          );
          setChatListCache(null);
          return true;
        }
        throw new Error("Failed to send message");
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setChatError(`Failed to send message: ${errorMessage}`);
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMsg.id));
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [chatProductId]
  );

  const fetchChats = useCallback(async () => {
    setIsChatLoading(true);
    setChatError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token missing");
      }

      if (chatListCache) {
        setIsChatLoading(false);
        return chatListCache.map((chat) => ({
          id: chat.id,
          participantId: chat.participantId,
          participantType: chat.participantType,
          chatType: chat.chatType,
          productId: chat.chatProducts?.[0]?.product?.id,
          chatProductId: chat.chatProducts?.[0]?.id || null,
          varientId: chat.chatProducts?.[0]?.varientId,
          inventoryId: chat.chatProducts?.[0]?.inventoryId,
          productSeller: chat.store?.name,
          productName: chat.chatProducts?.[0]?.product?.productLanguages?.[0]?.name,
        }));
      }

      const response = await axios.get(`${BASE_URL}/user/chat/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        setChatListCache(response.data.data);
        return response.data.data.map((chat) => ({
          id: chat.id,
          participantId: chat.participantId,
          participantType: chat.participantType,
          chatType: chat.chatType,
          productId: chat.chatProducts?.[0]?.product?.id,
          chatProductId: chat.chatProducts?.[0]?.id || null,
          varientId: chat.chatProducts?.[0]?.varientId,
          inventoryId: chat.chatProducts?.[0]?.inventoryId,
          productSeller: chat.store?.name,
          productName: chat.chatProducts?.[0]?.product?.productLanguages?.[0]?.name,
        }));
      }
      throw new Error("No chats found or API call unsuccessful");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setChatError(`Failed to fetch chats: ${errorMessage}`);
      return [];
    } finally {
      setIsChatLoading(false);
    }
  }, [chatListCache]);

  const deleteMessage = useCallback(async (messageId) => {
    if (!messageId) {
      setChatError("No message ID provided");
      return false;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token missing");
      }

      await axios.delete(`${BASE_URL}/user/chat/messages/${messageId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      setChatListCache(null);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setChatError(`Failed to delete message: ${errorMessage}`);
      return false;
    }
  }, []);

  const clearChat = useCallback(() => {
    setChatId(null);
    setParticipantId(null);
    setChatProductId(null);
    setMessages([]);
    setChatError(null);
    setIsChatLoading(false);
    setIsSending(false);
    setProductName(null);
    setProductDescription(null);
    setChatListCache(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chatId,
        participantId,
        chatProductId,
        messages,
        isSending,
        isChatLoading,
        chatError,
        initiateChat,
        fetchMessages,
        sendMessage,
        deleteMessage,
        clearChat,
        fetchChats,
        productName,
        productDescription,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};