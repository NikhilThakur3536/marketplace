"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function CustomizeModal({ item, isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [extras, setExtras] = useState([]);
  const [error, setError] = useState(null);

  const sizeOptions = (Array.isArray(item?.variants) ? item.variants : []).filter(
    (size) => size.name && Number.isFinite(size.price) && size.productVarientUomId
  );
  const extraOptions = (Array.isArray(item?.addonDetails) ? item.addonDetails : []);

  useEffect(() => {
    if (sizeOptions.length > 0 && !selectedSize) {
      setSelectedSize(sizeOptions[0].name);
    }
  }, [sizeOptions, selectedSize]);

  if (!isOpen || !item) {
    return null;
  }

  const handleExtraChange = (extra) => {
    const extraName = extra.product?.productLanguages?.[0]?.name;
    console.log("Extra changed:", extraName);
    setExtras((prevExtras) =>
      prevExtras.includes(extraName)
        ? prevExtras.filter((e) => e !== extraName)
        : [...prevExtras, extraName]
    );
  };

  const calculateTotal = () => {
    const sizePrice = sizeOptions.find((s) => s.name === selectedSize)?.price || 0;
    const extrasPrice = extras.reduce(
      (sum, extra) =>
        sum +
        (extraOptions.find((e) => e.product?.productLanguages?.[0]?.name === extra)?.inventory?.price || 0),
      0
    );
    return (sizePrice + extrasPrice).toFixed(2);
  };

  const handleAddToCart = async () => {
    console.log("Add to Cart clicked, starting handleAddToCart");
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
      if (!BASE_URL) throw new Error("API base URL is not set.");
      if (!item.productId) throw new Error("Product ID is missing.");
      if (!selectedSize) throw new Error("Please select a size.");

      const selectedVariant = sizeOptions.find((s) => s.name === selectedSize);
      if (!selectedVariant?.productVarientUomId) {
        throw new Error("Selected size is invalid or missing ID.");
      }
      console.log("sizeoptions",sizeOptions)
      console.log("selected variant size",selectedVariant)

      const payload = {
        productVarientUomId: selectedVariant.productVarientUomId,
        productId: item.productId,
        quantity: 1,
        addons: [
          {
            addOnProductId: item.productId,
            addOnVarientId: selectedVariant.id,
            productVarientUomId: selectedVariant.productVarientUomId,
            quantity: 1,
          },
          ...extras.map((extraName) => {
            const extra = extraOptions.find((e) => e.product?.productLanguages?.[0]?.name === extraName);
            if (!extra) throw new Error(`Invalid add-on: ${extraName}`);
            return {
              addOnId: extra.id,
              addOnProductId: extra?.productId,
              addOnVarientId: extra?.product?.varients?.[0]?.id,
              productVarientUomId: extra.product?.varients?.[0]?.productVarientUoms?.[0]?.id,
              quantity: 1,
            };
          }),
        ],
      };

      console.log("Sending API request with payload:", payload);
      const response = await axios.post(`${BASE_URL}/user/cart/addv1`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Cart API call successful:", response.data);
      onClose();
    } catch (err) {
      console.error("Error adding to cart:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.message || "Failed to add item to cart. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[90%] max-w-md p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">{item.name || "Item"}</h2>
          <button onClick={onClose}>
            <X size={24} color="black" />
          </button>
        </div>
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <Image
            src={item.image || "/pizza.jpg"}
            alt={item.name || "Item"}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-black">Select Size</h3>
          <div className="flex flex-col gap-2 mt-2">
            {sizeOptions.length > 0 ? (
              sizeOptions.map((size) => (
                <label key={size.name} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="size"
                    value={size.name}
                    checked={selectedSize === size.name}
                    onChange={() => {
                      console.log("Size selected:", size.name);
                      setSelectedSize(size.name);
                    }}
                    className="text-green-700"
                  />
                  <span className="text-black">
                    {size.name} (${Number.isFinite(size.price) ? size.price.toFixed(2) : "0.00"})
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No size options available</p>
            )}
          </div>
        </div>
        {extraOptions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-black">Extra Options</h3>
            <div className="flex flex-col gap-2 mt-2">
              {extraOptions.map((extra) => (
                <label key={extra?.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={extras.includes(extra.product?.productLanguages?.[0]?.name)}
                    onChange={() => handleExtraChange(extra)}
                    className="text-green-700"
                  />
                  <span className="text-black">
                    {extra.product?.productLanguages?.[0]?.name} (+$
                    {Number.isFinite(extra.inventory?.price) ? extra.inventory?.price.toFixed(2) : "0.00"})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-black">Total: ${calculateTotal()}</span>
          <button
            onClick={handleAddToCart}
            disabled={sizeOptions.length === 0 || !selectedSize}
            className={`font-semibold py-2 px-4 rounded-lg text-white ${
              sizeOptions.length === 0 || !selectedSize
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}