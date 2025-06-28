"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState("2bfa9d89-61c4-401e-aae3-346627460558"); // Default language ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchLanguages = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/user/language/list`,
        { limit: 100, offset: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setLanguages(res.data.data.rows);
      } else {
        setError("Failed to load languages.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <LanguageContext.Provider
      value={{ languages, selectedLanguageId, setSelectedLanguageId, loading, error, refreshLanguages: fetchLanguages }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);