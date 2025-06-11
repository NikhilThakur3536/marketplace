"use client"

import  { useState } from "react";
import { Menu, User } from "lucide-react";
import GeneralTab from "./GeneralTab";
import LocationsTab from "./LocationsTab";
import OrdersTab from "./OrdersTab";
import FavoritesTab from "./FavouritesTab";

const ProfileCard = () => {
  const [activeTab, setActiveTab] = useState("General");
  
  const tabs = ["General", "Locations", "Orders", "Favorites"];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return <GeneralTab />;
      case "Locations":
        return <LocationsTab />;
      case "Orders":
        return <OrdersTab />;
      case "Favorites":
        return <FavoritesTab />;
      default:
        return <GeneralTab />;
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg overflow-hidden h-screen">
      {/* Header */}
      <div className="relative p-6 pb-4 ">
        <div className="flex items-center justify-between mb-6">
          <Menu className="w-6 h-6 text-gray-600" />
          <h1 className="text-xl font-bold text-gray-900">ItsLife</h1>
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {/* Profile Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Martin Williams</h2>
            <p className="text-gray-500 text-sm">@Martinwill</p>
            <span className="inline-block mt-1 px-3 py-1 bg-green-400 text-white text-xs rounded-full font-medium">
              Add people
            </span>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-gray-800 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="px-6 pb-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProfileCard;
