"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ItemCards from "./components/ItemCards";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);
  const [removeError, setRemoveError] = useState(null);
  const router = useRouter();

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
          cartId: item.id, // Assuming item.id is the cartId
          productId: item.productId,
          varientId: item.varientId,
          name: item.product?.productLanguages?.[0]?.name || "Unknown Product",
          restaurantName: item.product?.restaurant?.name || "Unknown seller",
          description: item.product?.productLanguages?.[0]?.description || "",
          count: parseFloat(item.quantity) || 1,
          customizations: item.customizations || "",
          price: item.priceInfo?.price || 0, // Store base price for calculations
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

  const handleRemove = async (cartId) => {
    try {
      setRemoveError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const payload = {
        cartId,
      };

      console.log("Removing cart item with payload:", payload);

      const response = await axios.post(`${BASE_URL}/user/cart/remove`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Remove Cart Item API Response:", response.data);

      if (response.data?.success) {
        setCartItems(cartItems.filter((item) => item.cartId !== cartId));
      } else {
        throw new Error(response.data?.message || "Failed to remove item.");
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
      setRemoveError(error.message || "Failed to remove item. Please try again.");
    }
  };

  const handleUpdateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    setCartItems(
      cartItems.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              count: newQuantity,
              total: `$${(item.price * newQuantity).toFixed(2)}`,
            }
          : item
      )
    );
  };

  const calculateCartTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + parseFloat(item.total.replace("$", "") || 0), 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setCheckoutError(null);
      setCheckoutSuccess(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const payload = {
        timezone: "Asia/Kolkata",
        totalAmount: calculateCartTotal(),
        paymentType: "CASH",
      };

      console.log("Placing order with payload:", payload);

      const response = await axios.post(`${BASE_URL}/user/order/addv2`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Order API Response:", response.data);

      if (response.data?.success) {
        setCheckoutSuccess(response.data.data?.message || "Order placed successfully!");
        setCartItems([]); // Clear cart
        setTimeout(() => {
          router.push("/orders"); // Redirect to orders page
        }, 2000); // Delay for user to see success message
      } else {
        throw new Error(response.data?.message || "Order placement failed.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setCheckoutError(err.message || "Failed to place order. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
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
          <button onClick={()=>router.push("/electronicsmarketplace")}>
            Goto Home
          </button>
            
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
        {removeError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            <p className="font-medium">{removeError}</p>
          </div>
        )}
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
              onRemove={() => handleRemove(item.cartId)}
              onUpdateQuantity={(newQuantity) => handleUpdateQuantity(item.cartId, newQuantity)}
            />
          ))}
        </div>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          {checkoutSuccess && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
              <p className="font-medium">{checkoutSuccess}</p>
            </div>
          )}
          {checkoutError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
              <p className="font-medium">{checkoutError}</p>
            </div>
          )}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Cart Total</h2>
            <span className="text-xl font-bold text-gray-800">${calculateCartTotal()}</span>
          </div>
          <button
            className={`w-full mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors ${
              checkoutLoading || !cartItems.length ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleCheckout}
            disabled={checkoutLoading || !cartItems.length}
          >
            {checkoutLoading ? (
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
            ) : (
              "Proceed to Checkout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}