"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Header({ selectedLang, setSelectedLang }) {
  const [languages, setLanguages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `${BASE_URL}/user/language/list`,
          {
            limit: 4,
            offset: 0
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        setLanguages(response?.data?.data?.rows || []);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, [BASE_URL]);

  const handleSelectLang = (lang) => {
    setSelectedLang(lang.name);
    localStorage.setItem("selectedLang", lang.name);
    setShowDropdown(false);
  };

  return (
    <div className="w-full h-12 relative">
      <div className="sticky flex justify-between px-4 py-2">
        <Image src="/infoware.png" alt="logo" width={80} height={30} />
        <div
          className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer relative"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Globe size={20} color="black" />
          </motion.div>

          <AnimatePresence>
            {showDropdown && (
              <motion.ul
                className="absolute top-10 right-0 bg-white border border-gray-200 shadow-lg rounded-md w-40 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {languages.map((lang, i) => (
                  <li
                    key={i}
                    onClick={() => handleSelectLang(lang)}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      lang.name === selectedLang ? "bg-gray-100 font-bold" : ""
                    }`}
                  >
                    {lang.name}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
