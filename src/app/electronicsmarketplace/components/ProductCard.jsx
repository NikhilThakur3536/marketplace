"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);
  const router = useRouter(); // Initialize router

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Prevent the click from triggering the card navigation
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    router.push(`/electronicsmarketplace/products/${product.id}`); // Navigate to the product details page
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
    >
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
          <svg
            className={`w-5 h-5 ${isFavorite ? "text-red-500 fill-current" : "text-gray-400"}`}
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <div className="space-y-1 mb-3">
        <h3 className="font-semibold bg-gradient-to-r from-blue-500 via-violet-600 to-orange-500 bg-clip-text text-transparent line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">{product.specs}</p>
        {typeof product.price === "number" && (
          <p className="font-bold text-gray-900">${product.price.toLocaleString()}</p>
        )}
      </div>
      <button
        onClick={(e) => e.stopPropagation()} // Prevent the click from triggering the card navigation
        className="w-8 h-8 bg-gradient-to-r from-[#9FD770] to-[#64C058] rounded-full flex items-center justify-center ml-auto hover:bg-green-600 transition-colors"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default ProductCard;