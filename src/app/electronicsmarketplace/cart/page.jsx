"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ItemCards from "./components/ItemCards";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");

        const payload = {
          languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
        };

        console.log("Fetching cart items with payload:", payload);

        const response = await axios.post(`${BASE_URL}/user/cart/listv2`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Cart API Response:", response.data);

        const fetchedItems = response.data?.data?.rows || [];
        if (!fetchedItems.length) {
          setCartItems([]);
          return;
        }

        // Format the cart items for ItemCards
        const formattedItems = fetchedItems.map((item) => ({
          id: `${item.productId}-${item.varientId}`,
          productId: item.productId,
          varientId: item.varientId,
          name: item.product?.productLanguages?.[0]?.name || "Unknown Product",
          restaurantName: item.product?.restaurant?.name || "Unknown Restaurant",
          description: item.product?.productLanguages?.[0]?.description || "",
          count: parseFloat(item.quantity) || 1,
          customizations: item.customizations || "",
          total: `$${(item.priceInfo?.price * item.quantity).toFixed(2)}` || "$0.00",
          addOns: item.addons?.map((addon) => addon.name) || [],
          image: item.product?.productImages?.[0]?.url || "/default-food.jpg",
        }));

        console.log("Formatted Cart Items:", formattedItems);
        setCartItems(formattedItems);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError(err.message || "Failed to load cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemove = async (productId, varientId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const payload = {
        productId,
        varientId,
      };

      console.log("Removing cart item:", payload);

      const response = await axios.post(`${BASE_URL}/api/user/cart/remove`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Remove Cart Item API Response:", response.data);

      setCartItems(cartItems.filter((item) => item.productId !== productId || item.varientId !== varientId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleUpdateQuantity = (productId, varientId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    setCartItems(
      cartItems.map((item) =>
        item.productId === productId && item.varientId === varientId
          ? { ...item, count: newQuantity, total: `$${((item.price * newQuantity) / item.count).toFixed(2)}` }
          : item
      )
    );
  };

  const calculateCartTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + parseFloat(item.total.replace("$", "") || 0), 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Your cart is empty.</p>
          <a
            href="/menu"
            className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Menu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <ItemCards
              key={item.id}
              id={item.id}
              name={item.name}
              restaurantName={item.restaurantName}
              description={item.description}
              count={item.count}
              customizations={item.customizations}
              total={item.total}
              addOns={item.addOns}
              image={item.image}
              onRemove={() => handleRemove(item.productId, item.varientId)}
              onUpdateQuantity={(newQuantity) =>
                handleUpdateQuantity(item.productId, item.varientId, newQuantity)
              }
            />
          ))}
        </div>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Cart Total</h2>
            <span className="text-xl font-bold text-gray-800">${calculateCartTotal()}</span>
          </div>
          <button
            className="w-full mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => console.log("Proceed to checkout")} 
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}