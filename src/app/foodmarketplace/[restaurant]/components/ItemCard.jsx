"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomizeModal from "./CustomizeModal";

export default function ItemCard({
  id,
  productId,
  isVeg,
  name,
  price,
  discountedPrice,
  rating,
  totalReviews,
  description,
  image,
  variants,
  addonDetails,
  productVarientUomId,
  addToCart,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // Track favorite status
  const [showPopup, setShowPopup] = useState(null); // Popup for feedback
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(id);
    } else {
      console.error("addToCart function is not provided to ItemCard");
    }
    setIsModalOpen(false);
  };

  const handleFavoriteToggle = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectUrl", "/food-marketplace/cart");
      }
      setShowPopup({
        type: "error",
        message: "Please log in to add to favorites.",
      });
      setTimeout(() => {
        setShowPopup(null);
        router.push("/food-marketplace/login");
      }, 2000);
      return;
    }

    try {
      const payload = { productId };
      await axios.post(`${BASE_URL}/user/favoriteProduct/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsFavorite(true);
      setShowPopup({
        type: "success",
        message: `${name} added to favorites!`,
      });
      setTimeout(() => setShowPopup(null), 2000);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      setShowPopup({
        type: "error",
        message: error.response?.data?.message || "Failed to add to favorites.",
      });
      setTimeout(() => setShowPopup(null), 3000);
    }
  };

  const item = {
    id,
    productId,
    isVeg,
    name,
    price,
    discountedPrice,
    rating,
    totalReviews,
    description,
    image,
    variants,
    addonDetails,
    productVarientUomId,
  };

  return (
    <>
      <div className="relative flex justify-between border border-gray-400 w-full p-2 rounded-lg">
        {showPopup && (
          <div
            className={`fixed top-16 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[120] transition-opacity duration-300 ${
              showPopup.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {showPopup.message}
          </div>
        )}
        <div className="w-[50%] flex flex-col gap-2">
          <div className="flex gap-2">
            <div className={`p-1 border-2 ${isVeg ? "border-green-700" : "border-red-700"} flex items-center justify-center`}>
              <div className={`w-4 h-4 rounded-full ${isVeg ? "bg-green-700" : "bg-red-700"}`} />
            </div>
            <p className={`${isVeg ? "bg-green-700" : "bg-red-700"} rounded-lg text-white font-medium p-1 text-xs`}>
              {isVeg ? "Veg" : "Non-Veg"}
            </p>
          </div>
          <h2 className="text-xl font-bold text-black">{name}</h2>
          <div className="flex gap-1">
            <span className="text-lg font-medium text-black">₹{discountedPrice}</span>
            <s className="text-sm text-gray-400">₹{price}</s>
          </div>
          <p className="text-gray-400 text-sm">{description}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddClick}
              className="w-[35%] border-2 border-green-700 rounded-lg py-2 flex items-center justify-center"
            >
              <span className="text-sm font-bold text-green-700">ADD</span>
            </button>
            <button
              onClick={handleFavoriteToggle}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
              />
            </button>
          </div>
        </div>
        <div className="w-[50%] bg-rose-100 relative flex flex-col">
          <Image src={image} alt={name} fill className="object-cover object-center rounded-lg" />
        </div>
      </div>
      <CustomizeModal
        item={item}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        addToCart={handleAddToCart}
      />
    </>
  );
}