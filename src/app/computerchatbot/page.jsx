"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ComputerBot() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [conversationState, setConversationState] = useState("greeting");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const messagesEndRef = useRef(null);
  const balls = [0, 1, 2, 3, 4];
  const [randomLefts, setRandomLefts] = useState([]);

  const products = {
    laptop: [
      { name: "TechTrend Innovations", model: "ProBook X1", image: "https://images.unsplash.com/photo-1618424181497-157f25ec7fb4", price: 800 },
      { name: "GigaTech Systems", model: "UltraSlim Z2", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a0a2", price: 1200 },
      { name: "NexGen Tech", model: "FlexBook V3", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef", price: 600 },
    ],
    desktop: [
      { name: "PowerPC Solutions", model: "CoreTower T5", image: "https://images.unsplash.com/photo-1593642532973-d31b97d0eb4c", price: 700 },
      { name: "EliteBuild Tech", model: "MasterDesk D7", image: "https://images.unsplash.com/photo-1593642634367-d91a11aa6736", price: 1000 },
    ],
    tablet: [
      { name: "MobileTech Inc.", model: "TabPro S9", image: "https://images.unsplash.com/photo-1544244015-1a7f5f1b29a8", price: 500 },
      { name: "SmartGadgets", model: "Slate X4", image: "https://images.unsplash.com/photo-1516321318423-4b6b6e7f8e5a", price: 650 },
    ],
    mobile: [
      { name: "PhoneTech Co.", model: "SmartPhone X", image: "https://images.unsplash.com/photo-1511707171634-5f897206b43b", price: 700 },
      { name: "ConnectSphere", model: "Galaxy Z", image: "https://images.unsplash.com/photo-1605468037736-32d6a4d1b402", price: 900 },
    ],
    headphones: [
      { name: "SoundWave", model: "AudioPro H1", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", price: 150 },
      { name: "BeatSync", model: "NoiseCancel V2", image: "https://images.unsplash.com/photo-1618366712010-f33e9f06f945", price: 250 },
    ],
  };

  const productTypes = ["Laptop", "Desktop", "Tablet", "Mobile", "Headphones"];
  const specificationOptions = {
    laptop: [
      { name: "16GB RAM, 512GB SSD, 15.6\" Display", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a0a2", price: 900 },
      { name: "8GB RAM, 256GB SSD, 13.3\" Display", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef", price: 600 },
      { name: "32GB RAM, 1TB SSD, 17.3\" Display", image: "https://images.unsplash.com/photo-1618424181497-157f25ec7fb4", price: 1500 },
    ],
    desktop: [
      { name: "16GB RAM, 1TB HDD, RTX 3060", image: "https://images.unsplash.com/photo-1593642532973-d31b97d0eb4c", price: 800 },
      { name: "32GB RAM, 512GB SSD, RTX 3080", image: "https://images.unsplash.com/photo-1593642634367-d91a11aa6736", price: 1200 },
    ],
    tablet: [
      { name: "8GB RAM, 128GB Storage, 10.5\" Display", image: "https://images.unsplash.com/photo-1544244015-1a7f5f1b29a8", price: 500 },
      { name: "12GB RAM, 256GB Storage, 12.9\" Display", image: "https://images.unsplash.com/photo-1516321318423-4b6b6e7f8e5a", price: 700 },
    ],
    mobile: [
      { name: "6GB RAM, 128GB Storage, 6.5\" Display", image: "https://images.unsplash.com/photo-1511707171634-5f897206b43b", price: 700 },
      { name: "8GB RAM, 256GB Storage, 6.7\" Display", image: "https://images.unsplash.com/photo-1605468037736-32d6a4d1b402", price: 900 },
    ],
    headphones: [
      { name: "Wireless, Noise-Cancelling, 30hr Battery", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", price: 150 },
      { name: "Bluetooth 5.0, ANC, 40hr Battery", image: "https://images.unsplash.com/photo-1618366712010-f33e9f06f945", price: 250 },
    ],
  };

  const quantityOptions = [1, 2, 3];
  const budgetOptions = [
    { label: "$100-$500", min: 100, max: 500 },
    { label: "$500-$1000", min: 500, max: 1000 },
    { label: "$1000-$1500", min: 1000, max: 1500 },
    { label: "$1500+", min: 1500, max: Infinity },
  ];

  useEffect(() => {
    const generatedLefts = balls.map(() => Math.floor(Math.random() * 260));
    setRandomLefts(generatedLefts);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const greetingMessage = {
      id: Date.now(),
      text: "Hello! Welcome to Tech Marketplace. Would you like to purchase a product?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      buttons: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    };
    setMessages([greetingMessage]);
  }, []);

  const handleImageClick = (value) => {
    const userMessage = {
      id: Date.now(),
      text: value.charAt(0).toUpperCase() + value.slice(1),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    handleBotResponse(value.toLowerCase());
  };

  const handleBotResponse = (value) => {
    let botMessage = {
      id: Date.now() + 1,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    switch (conversationState) {
      case "greeting":
        if (value === "yes") {
          botMessage.text = "Great! What type of product are you looking for?";
          botMessage.buttons = productTypes.map((type) => ({
            label: type,
            value: type.toLowerCase(),
          }));
          setConversationState("productSelection");
        } else {
          botMessage.text = "Alright, let me know if you change your mind!";
          botMessage.buttons = [{ label: "Shop Products", value: "yes" }];
        }
        break;

      case "productSelection":
        if (productTypes.map((t) => t.toLowerCase()).includes(value)) {
          setSelectedProductType(value);
          botMessage.text = `Nice choice! Please select your location to find available ${value} retailers.`;
          botMessage.buttons = [
            { label: "USA", value: "USA" },
            { label: "Global", value: "Global" },
          ];
          setConversationState(`location_${value}`);
        } else {
          botMessage.text = "Please choose a valid product type.";
        }
        break;

      case `location_laptop`:
      case `location_desktop`:
      case `location_tablet`:
      case `location_mobile`:
      case `location_headphones`:
        const productType = conversationState.split("_")[1];
        botMessage.text = `How many ${productType}${productType === "headphones" ? "" : "s"} would you like to purchase?`;
        botMessage.buttons = quantityOptions.map((qty) => ({
          label: `${qty}`,
          value: qty.toString(),
        }));
        setConversationState(`quantity_${productType}`);
        break;

      case `quantity_laptop`:
      case `quantity_desktop`:
      case `quantity_tablet`:
      case `quantity_mobile`:
      case `quantity_headphones`:
        const qtyType = conversationState.split("_")[1];
        const quantity = parseInt(value);
        setSelectedQuantity(quantity);
        botMessage.text = `Got it! You want ${quantity} ${qtyType}${quantity > 1 && qtyType !== "headphones" ? "s" : ""}. What's your budget for this purchase?`;
        botMessage.buttons = budgetOptions.map((budget) => ({
          label: budget.label,
          value: budget.label,
        }));
        setConversationState(`budget_${qtyType}`);
        break;

      case `budget_laptop`:
      case `budget_desktop`:
      case `budget_tablet`:
      case `budget_mobile`:
      case `budget_headphones`:
        const budgetType = conversationState.split("_")[1];
        const selectedBudgetOption = budgetOptions.find((b) => b.label === value);
        setSelectedBudget(selectedBudgetOption);
        const availableRetailers = products[budgetType].filter(
          (c) => c.price * selectedQuantity >= selectedBudgetOption.min && c.price * selectedQuantity <= selectedBudgetOption.max
        );
        if (availableRetailers.length === 0) {
          botMessage.text = `Sorry, no ${budgetType}${budgetType === "headphones" ? "" : "s"} match your budget of ${value} for ${selectedQuantity} item${selectedQuantity > 1 ? "s" : ""}. Try a different budget or quantity.`;
          botMessage.buttons = budgetOptions.map((budget) => ({
            label: budget.label,
            value: budget.label,
          }));
          setConversationState(`budget_${budgetType}`);
        } else {
          botMessage.text = `Here are available ${budgetType} retailers within your budget (${value}):\n${availableRetailers
            .map((c) => `${c.name} (${c.model}, $${c.price * selectedQuantity})`)
            .join("\n")}\n\nClick an image to select a retailer!`;
          botMessage.images = availableRetailers.map((c) => c.image);
          botMessage.names = availableRetailers.map((c) => c.model);
          botMessage.values = availableRetailers.map((c) => c.model.toLowerCase());
          setConversationState(`retailer_${budgetType}`);
        }
        break;

      case `retailer_laptop`:
      case `retailer_desktop`:
      case `retailer_tablet`:
      case `retailer_mobile`:
      case `retailer_headphones`:
        const type = conversationState.split("_")[1];
        const filteredSpecifications = specificationOptions[type].filter(
          (s) => s.price * selectedQuantity >= selectedBudget.min && s.price * selectedQuantity <= selectedBudget.max
        );
        if (filteredSpecifications.length === 0) {
          botMessage.text = `Sorry, no ${type}${type === "headphones" ? "" : "s"} specifications match your budget of ${selectedBudget.label} for ${selectedQuantity} item${selectedQuantity > 1 ? "s" : ""}. Try a different budget.`;
          botMessage.buttons = budgetOptions.map((budget) => ({
            label: budget.label,
            value: budget.label,
          }));
          setConversationState(`budget_${type}`);
        } else {
          botMessage.text = `Please select your ${type} specifications by clicking an image (within ${selectedBudget.label}).`;
          botMessage.images = filteredSpecifications.map((s) => s.image);
          botMessage.names = filteredSpecifications.map((s) => s.name);
          botMessage.values = filteredSpecifications.map((s) => s.name.toLowerCase());
          setConversationState(`specifications_${type}`);
        }
        break;

      case `specifications_laptop`:
      case `specifications_desktop`:
      case `specifications_tablet`:
      case `specifications_mobile`:
      case `specifications_headphones`:
        const fType = conversationState.split("_")[1];
        const selectedSpec = specificationOptions[fType].find((s) => s.name.toLowerCase() === value);
        const totalCost = selectedSpec.price * selectedQuantity;
        botMessage.text = `Thank you! Your order of ${selectedQuantity} ${fType}${fType === "headphones" && selectedQuantity === 1 ? "" : "s"} (${value}) is confirmed. Total cost: $${totalCost}. Redirecting to checkout...`;
        setMessages((prev) => [...prev, botMessage]);
        setConversationState("greeting");
        setSelectedQuantity(1);
        setSelectedBudget(null);
        setTimeout(() => {
          router.push("/checkout");
        }, 2000);
        return;

      default:
        botMessage.text = "Oops! Would you like to purchase a product?";
        botMessage.buttons = [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ];
        setConversationState("greeting");
    }

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="z-80 h-screen w-screen flex justify-center items-center bg-black">
      <div className="bg-[#2a1548] h-[500px] w-[300px] rounded-xl flex flex-col overflow-hidden">
        <div className="z-20 w-full h-full px-2 py-3 overflow-y-auto relative">
          <div className="absolute inset-0 z-10 overflow-hidden">
            {randomLefts.length > 0 &&
              balls.map((ball, index) => (
                <motion.div
                  key={index}
                  className="absolute bottom-0 w-6 h-6 rounded-full bg-fuchsia-500 blur-lg"
                  style={{ left: `${randomLefts[index]}px` }}
                  initial={{ y: 100 }}
                  animate={{ y: -700 }}
                  transition={{
                    duration: 6 + Math.random() * 8,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                />
              ))}
          </div>
          <div className="relative z-20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg text-sm whitespace-pre-line max-w-[80%] ${
                    msg.sender === "user" ? "bg-cyan-800 text-white" : "bg-gray-200/20 text-white"
                  }`}
                >
                  {msg.text}
                  {msg.images && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {msg.images.map((img, idx) => (
                        <div key={idx} className="text-center">
                          <img
                            src={img}
                            alt={msg.names[idx]}
                            className={`w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${
                              msg.values ? "hover:border-2 hover:border-fuchsia-600" : ""
                            }`}
                            onClick={msg.values ? () => handleImageClick(msg.values[idx]) : undefined}
                          />
                          {msg.names && <p className="text-xs mt-1">{msg.names[idx]}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.buttons && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.buttons.map((btn, i) => (
                        <button
                          key={i}
                          onClick={() => handleImageClick(btn.value)}
                          className="bg-[#2a1548] text-white text-xs px-2 py-1 rounded hover:bg-[#3d1f68]"
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-right mt-1 opacity-70">{msg.timestamp}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}