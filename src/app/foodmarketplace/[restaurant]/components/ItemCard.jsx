"use client";

import Image from "next/image";
import { useState } from "react";
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

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Callback to handle adding to cart from the modal
  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(id);
    } else {
      console.error("addToCart function is not provided to ItemCard");
    }
    setIsModalOpen(false); // Close modal after adding
  };

  // Create an item object to pass to CustomizeModal
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
      <div className="flex justify-between border border-gray-400 w-full p-2 rounded-lg">
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
          <button
            onClick={handleAddClick}
            className="w-[35%] border-2 border-green-700 rounded-lg py-2 flex items-center justify-center"
          >
            <span className="text-sm font-bold text-green-700">ADD</span>
          </button>
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