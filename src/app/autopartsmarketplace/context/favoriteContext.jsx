// context/favoriteContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const FavoriteContext = createContext();

export const useFavorite = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children, marketplace }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize as true to delay rendering
  const [showPopup, setShowPopup] = useState(null);

  const router = useRouter();

  // Determine the base URL and endpoint suffix based on marketplace
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";
  const endpointSuffix = marketplace === "electronicsmarketplace" ? "v1" : "";

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    const lang = localStorage.getItem("selectedLanguage") || "2bfa9d89-61c4-401e-aae3-346627460558";

    setLoading(true);
    try {
      const payload = { languageId: lang };
      const response = await axios.post(
        `${BASE_URL}/user/favoriteProduct/list${endpointSuffix}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("fav item response", response);

      const items = response.data?.data?.rows?.map((item) => ({
        id: item.id || item.productId || "unknown-id",
        productLanguages: item.productLanguages || [{ name: "Unknown Product", longDescription: "No description" }],
        varients: item.varients,
        media: item.media || [{ url: "/placeholder.jpg" }],
        addons: item.addons || [],
        productVarientUomId: item.varients?.[0]?.productVarientUom?.id,
      })) || [];

      setFavoriteItems(items);
      // Save to local storage for faster initial load
      localStorage.setItem("favoriteItems", JSON.stringify(items));
    } catch (error) {
      console.error("Error details:", error.response?.data, error.message);
      setShowPopup({
        type: "error",
        message: error.response?.data?.message || "Failed to load favorites.",
      });
      setTimeout(() => setShowPopup(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Load favorites from local storage on mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteItems") || "[]");
    if (storedFavorites.length > 0) {
      setFavoriteItems(storedFavorites);
      setLoading(false); // Set loading to false if local storage has data
    }
    fetchFavorites(); // Fetch from backend to ensure data is up-to-date
  }, [marketplace]);

  // Helper function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favoriteItems.some((item) => item.id === productId);
  };

  const toggleFavorite = async ({ productId, name }) => {
    const token = localStorage.getItem("token");

    try {
      const isCurrentlyFavorite = isFavorite(productId);
      if (isCurrentlyFavorite) {
        const response = await axios.post(
          `${BASE_URL}/user/favoriteProduct/remove`,
          { productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.custom(
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
            {name} removed from favorites!
          </div>,
          { id: "quantity-toast", duration: 200 }
        );
      } else {
        const response = await axios.post(
          `${BASE_URL}/user/favoriteProduct/add`,
          { productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.custom(
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
            {name} added to favorites!
          </div>,
          { id: "quantity-toast", duration: 200 }
        );
      }

      // Refresh the favorites list after toggling
      fetchFavorites();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setShowPopup({
        type: "error",
        message: error.response?.data?.message || "Failed to update favorites.",
      });
      setTimeout(() => setShowPopup(null), 200);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{ favoriteItems, fetchFavorites, toggleFavorite, isFavorite, loading, showPopup }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};