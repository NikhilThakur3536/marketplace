"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isPizzaOrder, setIsPizzaOrder] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // Scroll to the bottom of messages when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Handle bot response based on context
    handleBotResponse(input, isPizzaOrder);
    setInput("");
  };

  // Handle bot response based on user input
  const handleBotResponse = (userInput, isPizzaOrder) => {
    let botMessage = {
      id: Date.now() + 1,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (isPizzaOrder) {
      // Expecting pizza maker's name
      const name = userInput.trim();
      if (name) {
        botMessage.text = `Thank you! Your pizza order is confirmed with ${name}. Redirecting to checkout...`;
        setMessages((prev) => [...prev, botMessage]);
        setIsPizzaOrder(false);
        // Redirect to checkout after a short delay to show the message
        setTimeout(() => {
          router.push("/checkout");
        }, 2000);
        return;
      } else {
        botMessage.text = "Please provide the pizza maker's name.";
        setMessages((prev) => [...prev, botMessage]);
        return;
      }
    }

    // Check for pizza order or existing order logic
    if (userInput.toLowerCase() === "pizza") {
      botMessage.text =
        "Great choice! Please choose your toppings (e.g., pepperoni, cheese) and provide the pizza maker's name.";
      setIsPizzaOrder(true);
    } else if (userInput.toLowerCase().startsWith("create order:")) {
      const item = userInput.slice(13).trim();
      if (item) {
        botMessage.text = `Order created for: ${item}. Confirmation #${Math.floor(
          Math.random() * 10000
        )}.`;
      } else {
        botMessage.text = "Please specify an item to order.";
      }
    } else {
      botMessage.text = "I can help with orders! Try 'create order: item_name' or order a 'pizza'.";
    }

    setMessages((prev) => [...prev, botMessage]);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="z-70 fixed h-[100vh] background-blur-2xl flex items-center justify-center mx-[10%]">
      {/* Background with blur effect */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{
          backgroundImage: "url('')", 
        }}
      ></div>

      {/* Chat container */}
      <div className="relative z-10 w-full max-w-md p-4">
        {/* Chat header */}
        <div className="bg-gray-200 rounded-t-lg p-3 flex items-center">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            SP
          </div>
          <h2 className="text-lg font-semibold">Food Marketplace</h2>
        </div>

        {/* Chat messages */}
        <div
          className="bg-white p-4 h-[60vh] overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-2 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-2 max-w-xs ${
                  message.sender === "user"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-70">{message.timestamp}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-gray-100 rounded-b-lg p-3 flex items-center">
          <input
            type="text"
            placeholder="Type here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none"
          />
          <button onClick={handleSendMessage} className="ml-2 text-purple-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;