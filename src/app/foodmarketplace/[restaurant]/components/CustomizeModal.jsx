"use client";

import { X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function CustomizeModal({ item, isOpen, onClose, addToCart }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [extras, setExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false); // New state for auth popup

  // Filter valid size options
  const sizeOptions = (Array.isArray(item?.variants) ? item.variants : []).filter(
    (size) => size?.name && Number.isFinite(Number(size?.price)) && size?.productVarientUomId
  );

  // Filter valid extra options
  const extraOptions = (Array.isArray(item?.addonDetails) ? item.addonDetails : []).filter(
    (extra) => extra?.id && extra?.productId
  );

  // Set default size if available
  useEffect(() => {
    if (sizeOptions.length > 0 && !selectedSize) {
      setSelectedSize(sizeOptions[0].name);
    }
  }, [sizeOptions, selectedSize]);

  if (!isOpen || !item) {
    return null;
  }

  // Handle extra option selection
  const handleExtraChange = (extra) => {
    const extraName = extra?.product?.productLanguages?.[0]?.name || "Unnamed Add-on";
    setExtras((prevExtras) =>
      prevExtras.includes(extraName)
        ? prevExtras.filter((e) => e !== extraName)
        : [...prevExtras, extraName]
    );
  };

  // Handle quantity increment
  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  // Handle quantity decrement
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    const basePrice = Number.isFinite(Number(item?.price)) ? Number(item?.price) : 0;
    const sizePrice = sizeOptions.length > 0
      ? Number(sizeOptions.find((s) => s.name === selectedSize)?.price ?? 0)
      : 0;
    const extrasPrice = extras.reduce((sum, extra) => {
      const extraItem = extraOptions.find(
        (e) => (e?.product?.productLanguages?.[0]?.name || "Unnamed Add-on") === extra
      );
      const extraPrice = Number.isFinite(Number(extraItem?.inventory?.price))
        ? Number(extraItem.inventory.price)
        : 0;
      return sum + extraPrice;
    }, 0);
    const subtotal = Number.isFinite(basePrice + sizePrice + extrasPrice)
      ? basePrice + sizePrice + extrasPrice
      : basePrice;
    const total = subtotal * quantity;
    return total.toFixed(2);
  };

  // Handle adding to cart
  const handleAddToCart = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        setShowAuthPopup(true); // Show popup if token is not found
        return;
      }
      if (!BASE_URL) throw new Error("API base URL is not set.");
      if (!item.productId) throw new Error("Product ID is missing.");

      let productVarientUomId;
      if (sizeOptions.length > 0) {
        const selectedVariant = sizeOptions.find((s) => s.name === selectedSize);
        if (!selectedVariant?.productVarientUomId) {
          throw new Error("Selected size is invalid or missing ID.");
        }
        productVarientUomId = selectedVariant.productVarientUomId;
      } else {
        productVarientUomId = item.productVarientUomId || null;
      }

      const payload = {
        productVarientUomId: productVarientUomId,
        productId: item.productId,
        quantity: quantity,
        addons: extras.map((extraName) => {
          const extra = extraOptions.find(
            (e) => (e?.product?.productLanguages?.[0]?.name || "Unnamed Add-on") === extraName
          );
          if (!extra) throw new Error(`Invalid add-on: ${extraName}`);
          return {
            addOnId: extra.id,
            addOnProductId: extra.productId,
            addOnVarientId: extra.product?.varients?.[0]?.id || null,
            productVarientUomId: extra.product?.varients?.[0]?.productVarientUoms?.[0]?.id || null,
            quantity: 1,
          };
        }),
      };

      await axios.post(`${BASE_URL}/user/cart/addv1`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (addToCart) {
        addToCart(item.id, quantity);
      } else {
        console.error("addToCart function not provided to CustomizeModal");
      }

      onClose();
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      setError(err.message || "Failed to add item to cart. Please try again.");
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    window.location.href = "/foodmarketplace/login"; 
    setShowAuthPopup(false);
  };

  // Handle register redirect
  const handleRegisterRedirect = () => {
    window.location.href = "/foodmarketplace/register"; 
    setShowAuthPopup(false);
  };

  return (
    <>
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
          {sizeOptions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-black">Select Size</h3>
              <div className="flex flex-col gap-2 mt-2">
                {sizeOptions.map((size) => (
                  <label key={size.name} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="size"
                      value={size.name}
                      checked={selectedSize === size.name}
                      onChange={() => setSelectedSize(size.name)}
                      className="text-green-700"
                    />
                    <span className="text-black">
                      {size.name} (+${Number.isFinite(Number(size.price)) ? Number(size.price).toFixed(2) : "0.00"})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {extraOptions.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-black">Extra Options</h3>
              <div className="flex flex-col gap-2 mt-2">
                {extraOptions.map((extra) => (
                  <label key={extra.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={extras.includes(
                        extra.product?.productLanguages?.[0]?.name || "Unnamed Add-on"
                      )}
                      onChange={() => handleExtraChange(extra)}
                      className="text-green-700"
                    />
                    <span className="text-black">
                      {extra.product?.productLanguages?.[0]?.name || "Unnamed Add-on"} (+$
                      {Number.isFinite(Number(extra.inventory?.price))
                        ? Number(extra.inventory.price).toFixed(2)
                        : "0.00"})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-black">No add-ons available for this item.</p>
          )}
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-black">Quantity</h3>
            <div className="flex gap-2 items-center">
              <button
                className="w-fit h-fit rounded-full p-1 bg-green-50"
                onClick={handleIncrement}
                aria-label={`Increase quantity of ${item.name || "Item"}`}
              >
                <Plus color="green" size={20} />
              </button>
              <span className="text-sm font-bold text-black">{quantity}</span>
              <button
                className={`w-fit h-fit rounded-full p-1 ${quantity === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-red-50"}`}
                onClick={handleDecrement}
                disabled={quantity === 1}
                aria-label={`Decrease quantity of ${item.name || "Item"}`}
              >
                <Minus color={quantity === 1 ? "gray" : "red"} size={20} />
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {!Number.isFinite(Number(item?.price)) && (
            <p className="text-red-500 text-sm text-center">Warning: Item price is missing or invalid.</p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-black">Total: ₹{calculateTotal()}</span>
            <button
              onClick={handleAddToCart}
              className="font-semibold py-2 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Authentication Popup */}
      {showAuthPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-[90%] max-w-sm p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Authentication Required</h2>
              <button onClick={() => setShowAuthPopup(false)}>
                <X size={24} color="black" />
              </button>
            </div>
            <p className="text-black text-center">Please log in or register to add items to your cart.</p>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleLoginRedirect}
                className="flex-1 py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={handleRegisterRedirect}
                className="flex-1 py-2 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}