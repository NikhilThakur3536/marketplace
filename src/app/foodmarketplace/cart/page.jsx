"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, ShoppingBag } from "lucide-react";
import ItemCards from "./components/ItemCards";
import { useRouter } from "next/navigation";
import BottomNav from "../components/BottomNavbar";

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [totalComponents, setTotalComponents] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setOrderStatus({ type: "error", message: "Please log in to view your cart." });
        setLoading(false);
        return;
      }

      try {
        const payload = {
          languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
        };

        const response = await axios.post(`${BASE_URL}/user/cart/listv1`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const items = response.data?.data?.rows || [];
        console.log("Cart items response:", items);
        items.forEach((item, index) => {
          console.log(`Item ${index} add-ons:`, item.addons || item.CartAddOns || "No add-ons field");
        });

        setCartItems(items);
        calculateTotal(items);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        setOrderStatus({ type: "error", message: "Failed to load cart items." });
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = (items) => {
    let totalQuantity = items.length;
    let totalPrice = 0;

    items.forEach((item) => {
      totalPrice += (item.priceInfo?.price || 0) * (item.quantity || 0);
    });

    const taxRate = 0.1; // 10% tax
    const totalTax = totalPrice * taxRate;
    const totalPriceWithTax = totalPrice + totalTax;

    setTotalComponents(totalQuantity);
    setTotalPrice(totalPriceWithTax);
  };

  const handleRemoveItem = async (cartId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOrderStatus({ type: "error", message: "Please log in to remove items." });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/user/cart/remove`, { cartId }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== cartId);
        calculateTotal(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      const fetchCartItems = async () => {
        try {
          const payload = {
            languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
          };
          const response = await axios.post(`${BASE_URL}/user/cart/listv1`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const items = response.data?.data?.rows || [];
          setCartItems(items);
          calculateTotal(items);
        } catch (fetchError) {
          console.error("Failed to refetch cart items:", fetchError);
          setOrderStatus({ type: "error", message: "Failed to sync cart." });
        }
      };
      fetchCartItems();
    }
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOrderStatus({ type: "error", message: "Please log in to place an order." });
      return;
    }

    try {
      setOrderLoading(true);
      setOrderStatus(null);

      const payload = {
        timezone: "Asia/Kolkata",
        totalAmount: totalPrice.toFixed(2),
        paymentType: "CASH",
      };

      console.log("Placing order with payload:", payload);

      const response = await axios.post(`${BASE_URL}/user/order/addv2`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Order API response:", response.data);
      setOrderStatus({ type: "success", message: "Order placed successfully!" });
      setCartItems([]);
      setTotalComponents(0);
      setTotalPrice(0);

      // Clear success message after 5 seconds
      setTimeout(() => setOrderStatus(null), 5000);
    } catch (err) {
      console.error("Error placing order:", err);
      setOrderStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to place order. Please try again.",
      });
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      {/* <BottomNav /> */}
      <div className="max-w-md w-full h-screen bg-white p-2 flex flex-col gap-4">
        {/* Delivery Address */}
        <div className="w-full rounded-xl px-4 bg-gradient-to-r from-blue-100 to-fuchsia-100">
          <div className="flex gap-4 p-4">
            <div className="w-[5%] flex items-center justify-center">
              <div className="w-fit h-fit rounded-full p-1 bg-blue-200">
                <MapPin color="blue" size={20} />
              </div>
            </div>
            <div className="flex flex-col w-[80%]">
              <span className="font-bold text-black text-xl">Delivery Address</span>
              <p className="text-xs">Koramangala, Bangalore, Karnataka 560034</p>
            </div>
            <button className="bg-white border border-gray-200 flex items-center justify-center w-fit h-fit px-6 py-2 transform translate-y-2.5">
              <span className="text-xs">Change</span>
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="w-full flex flex-col gap-2 flex-1">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 w-full flex items-center gap-2 px-2 py-4">
            <ShoppingBag color="white" size={20} />
            <span className="text-white text-xl font-semibold">Your Items</span>
          </div>

          <div className="w-full flex flex-col gap-4 p-2 bg-white border border-gray-200 flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-gray-500 text-center">Loading cart...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                {orderStatus?.type === "success" ? "Cart is empty after order." : "Your cart is empty."}
              </p>
            ) : (
              cartItems.map((item) => (
                <ItemCards
                  key={item.id}
                  id={item.id}
                  name={item.product?.productLanguages?.[0]?.name || "Unknown Product"}
                  total={(item.priceInfo?.price * item.quantity) || 0}
                  restaurantName={item.product?.restaurant?.name || "Unknown Restaurant"}
                  description={item.product?.productLanguages?.[0]?.shortDescription || "No description"}
                  customizations={item.customizations || "None"}
                  count={item.quantity}
                  addOns={
                    item.addons?.length
                      ? item.addons
                          .map((addon) => addon.product?.productLanguages?.[0]?.name)
                          .filter(Boolean)
                          .join(", ") || "No Add-ons"
                      : item.CartAddOns?.length
                      ? item.CartAddOns.map((addon) => addon.product?.productLanguages?.[0]?.name)
                          .filter(Boolean)
                          .join(", ") || "No Add-ons"
                      : "No Add-ons"
                  }
                  onRemove={() => handleRemoveItem(item.id)}
                />
              ))
            )}

            {/* Total Items and Price */}
            {cartItems.length > 0 && (
              <div
                className="border-t pt-4 mt-4 bg-gray-50 rounded-xl p-4 shadow-sm"
                role="region"
                aria-label="Cart Summary"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold text-gray-800">Total Items</p>
                  <p className="text-lg font-bold text-gray-900">{totalComponents}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-800">Total Price (incl. tax)</p>
                  <p className="text-xl font-bold text-blue-600">${totalPrice.toFixed(2)}</p>
                </div>
              </div>
            )}
            {orderStatus && (
              <div
                className={`p-4 rounded-xl text-white text-center ${
                  orderStatus.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
                role="alert"
              >
                {orderStatus.message}
                {orderStatus.type === "success" && (
                  <button
                    className="ml-2 text-sm underline"
                    onClick={() => router.push("/foodmarketplace/orders")}
                  >
                    View Orders
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0 || orderLoading}
          className={`w-full py-4 rounded-xl text-white text-lg font-semibold ${
            cartItems.length === 0 || orderLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {orderLoading ? (
            <span className="inline-flex items-center">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
              Placing Order...
            </span>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
}