"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Search, Globe } from 'lucide-react';

import Header from './components/Header';
import AnimatedText from './components/AnimatedText';
import OffersSection from './components/OffereSelection';
import FoodCards from './components/FoodCards';
import RestaurantsSection from './components/RestaurantSection';
import FooterSection from './components/FooterSection';
import { Navbar } from './components/Navbar';
import ChatInterface from './components/ChatInterface';

// Simple translations
const translations = {
  en: {
    availableLanguages: "Available Languages",
    enterItemOrRestaurant: "Enter Item or Restaurant",
    noLanguagesAvailable: "No languages available",
    loadingLanguages: "Loading languages...",
  },
  guj: {
    availableLanguages: "ઉપલબ્ધ ભાષાઓ",
    enterItemOrRestaurant: "આઇટમ અથવા રેસ્ટોરન્ટ દાખલ કરો",
    noLanguagesAvailable: "કોઈ ભાષાઓ ઉપલબ્ધ નથી",
    loadingLanguages: "ભાષાઓ લોડ થઈ રહી છે...",
  },
};

export default function MobileView() {
  const router = useRouter();

  const [chatCollapse, setChatCollapse] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        if (!BASE_URL) throw new Error('NEXT_PUBLIC_BASE_URL is not defined in .env');

        const apiUrl = `${BASE_URL.replace(/\/$/, '')}/user/language/list`;
        const deviceToken = localStorage.getItem('deviceToken');
        const deviceId = localStorage.getItem('deviceId');
        const domainId = localStorage.getItem('domainId');

        if (!deviceToken || !deviceId || !domainId) {
          throw new Error('Missing localStorage values. Ensure deviceToken, deviceId, and domainId are set.');
        }

        const response = await axios.post(apiUrl, {
          limit: 4,
          offset: 0
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deviceToken}`,
            'X-Device-ID': deviceId,
            'X-Domain-ID': domainId,
          }
        });

        if (response.data.success && Array.isArray(response.data.data?.rows)) {
          setLanguages(response.data.data.rows);
          const firstActive = response.data.data.rows.find(lang => lang.status === 'ACTIVE');
          if (firstActive) setActiveLanguage(firstActive.code);
        } else {
          setError(response.data.error || "Failed to fetch languages");
        }
      } catch (err) {
        const msg = err.response?.data?.error || err.message || "Unknown error occurred";
        setError(`Error: ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleLanguageSelect = (code) => {
    const selected = languages.find(lang => lang.code === code && lang.status === 'ACTIVE');
    if (selected) setActiveLanguage(code);
  };

  const handleSearchClick = () => {
    router.push('/searchpage');
  };

  const toggleChat = () => {
    setChatCollapse(prev => !prev);
  };

  const t = (key) => translations[activeLanguage]?.[key] || translations.en[key];

  return (
    <div className="bg-black w-screen h-screen relative overflow-y-scroll overflow-x-hidden flex justify-center">
      <div className="max-w-[360px] relative">

        {/* Chat Button */}
        <div
          className="fixed bottom-20 right-2 z-50 w-12 h-12 bg-red-200 rounded-full backdrop-blur-2xl flex items-center justify-center cursor-pointer"
          onClick={toggleChat}
        >
          <span className="text-white font-bold">{chatCollapse ? "💬" : "✕"}</span>
        </div>
        {!chatCollapse && <ChatInterface />}

        {/* Navigation & Header */}
        <Navbar />
        <Header handleSearchClick={handleSearchClick} />
        <AnimatedText />

        {/* Search Box */}
        <hr className="absolute left-6 mt-4 w-[85%] h-[1px] border border-dashed border-white" />
        <div className="bg-orange-500 rounded-xl w-[80%] h-8 mt-8 mx-auto">
          <div className="flex gap-1">
            <Search size={20} className="text-white mt-2 -translate-y-0.5 ml-1" />
            <input
              type="text"
              placeholder={t('enterItemOrRestaurant')}
              onClick={handleSearchClick}
              className="text-white text-xs mt-1.5 underline underline-offset-2 placeholder:text-white bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Language Section */}
        <div className="absolute top-0 mt-1 ml-56 mx-auto w-fit text-white">
          {loading && <p className="text-center">{t('loadingLanguages')}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {!loading && !error && languages.length > 0 && (
            <div className="">
              <button
                type="button"
                className="inline-flex items-center justify-center w-full rounded-md border border-gray-600 bg-gray-800 px-1 py-1 text-sm font-medium hover:bg-gray-700 focus:outline-none"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                <Globe className="" size={16} />
              </button>

              {dropdownOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-md bg-gray-800 shadow-lg max-h-48 overflow-auto flex justify-center overflow-x-hidden">
                  <ul
                    tabIndex={-1}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                    className="ml-4 text-[0.5rem]"
                  >
                    {languages.map(lang => (
                      <li
                        key={lang.id}
                        role="menuitem"
                        className={`cursor-pointer px-4 py-2 hover:bg-orange-500 ${
                          lang.code === activeLanguage ? 'font-bold text-orange-400' : ''
                        } ${lang.status !== 'ACTIVE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => lang.status === 'ACTIVE' && handleLanguageSelect(lang.code)}
                      >
                      ({lang.code.toUpperCase()})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!loading && !error && languages.length === 0 && (
            <p className="text-center">{t('noLanguagesAvailable')}</p>
          )}
        </div>

        {/* Curve SVG Design */}
        <svg className="ml-2 mt-8 overflow-hidden" width="350" height="141" viewBox="0 0 392 141" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 45.9485C0 39.7463 4.72636 34.5659 10.9026 33.9987L378.903 0.202825C385.934 -0.442896 392 5.09177 392 12.1525V129C392 135.627 386.627 141 380 141H12C5.37258 141 0 135.627 0 129V45.9485Z"
            fill="#FC603A"
          />
        </svg>

        {/* Page Content */}
        {console.log(languages)}
       <FoodCards language={activeLanguage} />
        <OffersSection language={activeLanguage} />
        <RestaurantsSection language={activeLanguage} />
        <FooterSection language={activeLanguage} />
      </div>
    </div>
  );
}
