"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import axios from "axios";

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);
  const [showPopup, setShowPopup] = useState(null);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectUrl", "/electronicsmarketplace");
      }
      setShowPopup({
        type: "error",
        message: "Please log in to manage favorites.",
      });
      setTimeout(() => {
        setShowPopup(null);
        router.push("/food-marketplace/login");
      }, 2000);
      return;
    }

    const newFavoriteState = !isFavorite;
    const endpoint = newFavoriteState
      ? "/user/favoriteProduct/add"
      : "/user/favoriteProduct/remove";
    const action = newFavoriteState ? "added to" : "removed from";

    try {
      await axios.post(
        `${BASE_URL}${endpoint}`,
        { productId: product.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsFavorite(newFavoriteState);
      setShowPopup({
        type: "success",
        message: `${product.name} ${action} favorites!`,
      });
      setTimeout(() => setShowPopup(null), 2000);
    } catch (error) {
      console.error(`Error ${action} favorite:`, error);
      setShowPopup({
        type: "error",
        message: error.response?.data?.message || `Failed to ${action} favorites.`,
      });
      setTimeout(() => setShowPopup(null), 3000);
    }
  };

  const handleCardClick = () => {
    router.push(`/electronicsmarketplace/products/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
    >
      {showPopup && (
        <div
          className={`fixed top-16 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[1000] transition-opacity duration-300 ${
            showPopup.type === "success" ? "bg-blue-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {showPopup.message}
        </div>
      )}
      <div className="relative mb-3">
        <Image
          src={product.image || "/laptop.png"}
          alt={product.name}
          width={160}
          height={120}
          className="w-full h-24 object-cover rounded-lg bg-blue-300/30 py-4"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center"
        >
          <Heart
            size={20}
            className={isFavorite ? "text-red-500" : "text-gray-400"}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="space-y-1 mb-3 relative">
        <h3 className="font-semibold bg-gradient-to-r from-blue-500 via-violet-600 to-orange-500 bg-clip-text text-transparent line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">{product.specs}</p>
        {typeof product.price === "number" && (
          <p className="font-bold text-gray-900 mt-2">₹{product.price.toLocaleString()}</p>
        )}
        <button
          onClick={() => router.push(`/electronicsmarketplace/products/${product.id}`)}
          className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center ml-auto hover:bg-green-600 transition-colors absolute right-4 transform -translate-y-8"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;