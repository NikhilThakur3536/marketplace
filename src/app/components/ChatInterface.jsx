"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [conversationState, setConversationState] = useState("greeting");
  const [selectedFood, setSelectedFood] = useState("");
  const messagesEndRef = useRef(null);
  const router = useRouter();

  const restaurants = {
    pizza: [
      { name: "Pizza Palace", address: "123 Main St" },
      { name: "Slice Haven", address: "456 Oak Ave" },
      { name: "Dough Delight", address: "789 Pine Rd" },
    ],
    burger: [
      { name: "Burger Bonanza", address: "321 Elm St" },
      { name: "Grill Master", address: "654 Maple Dr" },
    ],
    pasta: [
      { name: "Pasta Paradise", address: "987 Cedar Ln" },
      { name: "Noodle Nook", address: "147 Birch Ave" },
    ],
  };

  const foodOptions = ["Pizza", "Burger", "Pasta"];
  const specificationOptions = {
    pizza: ["Pepperoni, Mild", "Cheese, Spicy", "Veggie, Medium"],
    burger: ["Lettuce & Tomato, Mild", "Cheese & Bacon, Spicy", "Veggie Patty, Medium"],
    pasta: ["Marinara, Mild", "Alfredo, Spicy", "Pesto, Medium"],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const greetingMessage = {
      id: Date.now(),
      text: "Hello! Welcome to Food Marketplace. Would you like to order food?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      buttons: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    };
    setMessages([greetingMessage]);
  }, []);

  const handleButtonClick = (value, messageId) => {
    const userMessage = {
      id: Date.now(),
      text: value.charAt(0).toUpperCase() + value.slice(1),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);

    handleBotResponse(value.toLowerCase(), messageId);
  };

  const handleBotResponse = (value, messageId) => {
    let botMessage = {
      id: Date.now() + 1,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    switch (conversationState) {
      case "greeting":
        if (value === "yes") {
          botMessage.text = "Great! What would you like to eat today?";
          botMessage.buttons = foodOptions.map((food) => ({
            label: food,
            value: food.toLowerCase(),
          }));
          setConversationState("foodSelection");
        } else if (value === "no") {
          botMessage.text = "Alright, let me know if you change your mind!";
          botMessage.buttons = [
            { label: "Order Food", value: "yes" },
          ];
        } else {
          botMessage.text = "Please select an option.";
          botMessage.buttons = [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ];
        }
        break;

      case "foodSelection":
        if (foodOptions.map((f) => f.toLowerCase()).includes(value)) {
          setSelectedFood(value);
          botMessage.text = `Awesome choice! Please provide your location to find nearby restaurants for ${value}.`;
          botMessage.buttons = [
            { label: "Dubai", value: "Dubai" },
            { label: "India", value: "India" },
          ];
          setConversationState(`location_${value}`);
        } else {
          botMessage.text = "Please choose a food option.";
          botMessage.buttons = foodOptions.map((food) => ({
            label: food,
            value: food.toLowerCase(),
          }));
        }
        break;

      case `location_pizza`:
      case `location_burger`:
      case `location_pasta`:
        const foodType = conversationState.split("_")[1];
        const availableRestaurants = restaurants[foodType];
        const randomRestaurant =
          availableRestaurants[Math.floor(Math.random() * availableRestaurants.length)];
        botMessage.text = `Here are nearby restaurants for ${foodType}:\n${availableRestaurants
          .map((r) => `${r.name} (${r.address})`)
          .join("\n")}\n\nI recommend ${randomRestaurant.name}! Which restaurant would you like?`;
        botMessage.buttons = availableRestaurants.map((r) => ({
          label: r.name,
          value: r.name.toLowerCase(),
        }));
        setConversationState(`restaurant_${foodType}`);
        break;

      case `restaurant_pizza`:
      case `restaurant_burger`:
      case `restaurant_pasta`:
        const selectedFoodType = conversationState.split("_")[1];
        botMessage.text = `Please specify your ${selectedFoodType} preferences.`;
        botMessage.buttons = specificationOptions[selectedFoodType].map((spec) => ({
          label: spec,
          value: spec.toLowerCase(),
        }));
        setConversationState(`specifications_${selectedFoodType}`);
        break;

      case `specifications_pizza`:
      case `specifications_burger`:
      case `specifications_pasta`:
        const finalFoodType = conversationState.split("_")[1];
        botMessage.text = `Thank you! Your ${finalFoodType} order is confirmed with specifications: ${value}. Redirecting to checkout...`;
        setConversationState("greeting");
        setMessages((prev) => [...prev, botMessage]);
        setTimeout(() => {
          router.push("/checkout");
        }, 2000);
        return;

      default:
        botMessage.text = "Something went wrong. Would you like to order food?";
        botMessage.buttons = [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ];
        setConversationState("greeting");
    }

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="fixed z-70 flex items-center justify-center mx-4 sm:mx-10 bg-black bg-opacity-50 mt-10  ">
      <div className="relative z-10 w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
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
              className={`flex mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-3 max-w-xs ${
                  message.sender === "user"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                <span className="text-xs opacity-70 block mt-1">{message.timestamp}</span>
                {message.buttons && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.buttons.map((button, index) => (
                      <button
                        key={index}
                        onClick={() => handleButtonClick(button.value, message.id)}
                        className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={messages[messages.length - 1].id !== message.id}
                      >
                        {button.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;