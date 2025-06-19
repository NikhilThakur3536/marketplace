"use client"

import React, { useState } from "react";
import Header from "./components/Header";
import PromoBanner from "./components/PromoBanner";
import CategoryTabs from "./components/CategoryTabs";
import ProductGrid from "./components/ProductGrid";
import BottomNav from "./components/BottomNav";
import ChatInterface from "./components/ChatInterface";
import { MessageCircle } from "lucide-react";

const HomePage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-[#EEF9FA] min-h-screen ">
        <Header />
        <div className="px-4 space-y-1">
          <PromoBanner />
          <CategoryTabs />
          <ProductGrid />
        </div>
        <BottomNav />
          {!isChatOpen && (
            <div className="sticky bottom-24 ml-[80%] rounded-full w-fit h-fit py-2 px-3 bg-green-400 z-50 ">
              <button onClick={toggleChat}>
                <MessageCircle color="white" size={20} />
              </button>
            </div>
          )}
          {isChatOpen && (
            <div className="sticky ml-[25%] bottom-24  z-50">
              <ChatInterface onClose={closeChat} />
            </div>
          )}
      </div>
    </div>
  );
};

export default HomePage;