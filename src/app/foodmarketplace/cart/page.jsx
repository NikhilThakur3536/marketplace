"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MapPin, ShoppingBag } from "lucide-react";
import ItemCards from "./components/ItemCards";
import { useRouter } from "next/navigation";
import BottomNav from "../components/BottomNavbar";
import debounce from "lodash/debounce";

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
        // Normalize quantity to 1 if undefined or 0
        const normalizedItems = items.map((item) => ({
          ...item,
          quantity: Math.floor(item.quantity || 1),
        }));
        normalizedItems.forEach((item, index) => {
          console.log(`Item ${index} id:`, item.id, `productId:`, item.product?.id, `quantity:`, item.quantity, `variant:`, item.product?.varients?.[0], `addons:`, item.addons || item.CartAddOns);
        });

        setCartItems(normalizedItems);
        calculateTotal(normalizedItems);
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
    let totalQuantity = items.reduce((sum, item) => sum + Math.floor(item.quantity || 1), 0);
    let totalPrice = 0;

    items.forEach((item) => {
      const basePrice = item.priceInfo?.price || 0;
      let addOnPrice = 0;

      // Check for add-ons in item.addons or item.CartAddOns
      const addOns = item.addons || item.CartAddOns || [];
      if (addOns.length > 0) {
        addOnPrice = addOns.reduce((sum, addon) => {
          const addonPrice = addon.priceInfo?.price || addon.product?.priceInfo?.price || 0;
          return sum + addonPrice;
        }, 0);
      }

      const itemTotal = (basePrice + addOnPrice) * Math.floor(item.quantity || 1);
      totalPrice += itemTotal;
    });

    setTotalComponents(totalQuantity);
    setTotalPrice(totalPrice);
  };

  const handleRemoveItem = async (cartId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOrderStatus({ type: "error", message: "Please log in to remove items." });
      return;
    }

    try {
      console.log("Removing item with cartId:", cartId);
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
      await fetchCartItems();
    }
  };

  const debouncedUpdateQuantity = useCallback(
    debounce(async (cartId, newQuantity) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setOrderStatus({ type: "error", message: "Please log in to update cart." });
        return;
      }

      // Ensure newQuantity is at least 1
      const adjustedQuantity = Math.max(1, Math.floor(newQuantity));

      try {
        console.log("Updating quantity for cartId:", cartId, "to", adjustedQuantity);
        console.log("Current cartItems:", cartItems.map(item => ({ id: item.id, productId: item.product?.id, quantity: item.quantity, variant: item.product?.varients?.[0], addons: item.addons || item.CartAddOns })));
        const item = cartItems.find((item) => item.id === cartId);
        if (!item) {
          console.error("Item not found in cart for cartId:", cartId);
          setOrderStatus({ type: "error", message: "Item not found in cart. Refreshing cart..." });
          await fetchCartItems();
          return;
        }

        if (!item.product?.id) {
          console.error("Product ID missing for cartId:", cartId);
          setOrderStatus({ type: "error", message: "Product information missing. Refreshing cart..." });
          await fetchCartItems();
          return;
        }

        const variant = item.product.varients?.[0];
        if (!variant || !variant.id) {
          console.error("Variant ID missing for productId:", item.product.id);
          setOrderStatus({ type: "error", message: "Product variant information missing. Refreshing cart..." });
          await fetchCartItems();
          return;
        }

        const payload = {
          cartId: cartId,
          productId: item.product.id,
          quantity: adjustedQuantity,
        };

        console.log("Sending payload to /user/cart/edit:", payload);

        const response = await axios.post(`${BASE_URL}/user/cart/edit`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("API response:", response.data);

        setCartItems((prevItems) => {
          const updatedItems = prevItems.map((item) =>
            item.id === cartId ? { ...item, quantity: adjustedQuantity } : item
          );
          calculateTotal(updatedItems);
          return updatedItems;
        });
      } catch (error) {
        console.error("Error updating item quantity:", error);
        const errorMessage = error.response?.data?.message || error.message;
        if (errorMessage.includes("d3cc") || errorMessage.includes("insufficient inventory")) {
          setOrderStatus({ type: "error", message: `Insufficient inventory for ${item?.product?.productLanguages?.[0]?.name || 'this product'}. Please try another item.` });
        } else {
          setOrderStatus({ type: "error", message: "Failed to update quantity. Refreshing cart..." });
        }
        await fetchCartItems();
      }
    }, 500),
    [cartItems]
  );

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
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
      // Normalize quantity to 1 if undefined or 0
      const normalizedItems = items.map((item) => ({
        ...item,
        quantity: Math.floor(item.quantity || 1),
      }));
      console.log("Fetched cart items:", normalizedItems);
      setCartItems(normalizedItems);
      calculateTotal(normalizedItems);
    } catch (fetchError) {
      console.error("Failed to refetch cart items:", fetchError);
      setOrderStatus({ type: "error", message: "Failed to sync cart." });
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

      const response = await axios.post(`${BASE_URL}/user/order/addv1`, payload, {
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
      <div className="max-w-md w-full h-screen bg-white p-2 flex flex-col gap-4">
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
              cartItems.map((item) => {
                const isIncrementDisabled = item.product?.varients?.[0]?.inventory <= item.quantity;
                const addOns = item.addons || item.CartAddOns || [];
                const addOnPrice = addOns.reduce((sum, addon) => sum + (addon.priceInfo?.price || addon.product?.priceInfo?.price || 0), 0);
                const itemTotal = ((item.priceInfo?.price || 0) + addOnPrice) * Math.floor(item.quantity || 1);

                return (
                  <ItemCards
                    key={item.id}
                    id={item.id}
                    name={item.product?.productLanguages?.[0]?.name || "Unknown Product"}
                    total={itemTotal}
                    restaurantName={item.product?.restaurant?.name || "Unknown Restaurant"}
                    description={item.product?.productLanguages?.[0]?.shortDescription || "No description"}
                    customizations={item.customizations || "None"}
                    count={Math.floor(item.quantity || 1)}
                    addOns={
                      addOns.length
                        ? addOns
                            .map((addon) => addon.product?.productLanguages?.[0]?.name)
                            .filter(Boolean)
                            .join(", ") || "No Add-ons"
                        : "No Add-ons"
                    }
                    onRemove={() => handleRemoveItem(item.id)}
                    onIncrement={() => debouncedUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                    onDecrement={() => debouncedUpdateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                    isIncrementDisabled={isIncrementDisabled}
                  />
                );
              })
            )}

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
                  <p className="text-lg font-semibold text-gray-800">Total Price (incl. add-ons)</p>
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

        <button
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0 || orderLoading}
          className={`w-full py-4 rounded-xl text-white text-lg font-semibold ${
            cartItems.length === 0 || orderLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
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