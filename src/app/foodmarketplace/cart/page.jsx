"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MapPin, ShoppingBag } from "lucide-react";
import ItemCards from "./components/ItemCards";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import AddressForm from "./components/AddressForm";
import BottomNav from "../components/BottomNavbar";

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [totalComponents, setTotalComponents] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [originalTotalPrice, setOriginalTotalPrice] = useState(0);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("/");
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(null);
  const [orderType, setOrderType] = useState("PICKUP");
  const [userAddress, setUserAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const normalizeUrl = (url) => {
    return url.replace(/\s+/g, "-");
  };

  const fetchProductDetails = async (productId, token) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/product/listv2`,
        { productIds: [productId] },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const product = response.data?.data?.rows?.[0];
      return {
        productLanguages: product?.productLanguages,
        variants: product?.variants,
        store: product?.store || { name: "Unknown Restaurant" }, 
      };
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
      return null;
    }
  };

  const mergeCarts = async (localCart, serverCart, token) => {
    console.log("Merging carts - Local:", localCart, "Server:", serverCart);
    const mergedItems = [...serverCart];

    for (const localItem of localCart) {
      if (!localItem.productId || !localItem.productVarientUomId) {
        console.warn("Skipping local item:", localItem);
        continue;
      }
      const existingItem = mergedItems.find((item) => item.product?.id === localItem.productId);
      if (existingItem) {
        existingItem.quantity = Math.max(existingItem.quantity, localItem.quantity);
        existingItem.product = {
          ...existingItem.product,
          productLanguages: existingItem.product?.productLanguages || [
            { name: localItem.name || "Unknown Product", description: localItem.description || "No description" },
          ],
        };
        existingItem.store = existingItem.store || localItem.store || { name: "Unknown Restaurant" };
        existingItem.addons = (existingItem.addons || []).map((addon, index) => ({
          ...addon,
          product: {
            ...addon.product,
            productLanguages: addon.product?.productLanguages || [
              { name: localItem.addons[index]?.name || "Unknown Add-on" },
            ],
          },
        }));
      } else {
        const payload = {
          productVarientUomId: localItem.productVarientUomId,
          productId: localItem.productId,
          quantity: localItem.quantity,
          addons: localItem.addons || [],
        };
        try {
          const response = await axios.post(`${BASE_URL}/user/cart/add`, payload, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          });
          const newItem = response.data?.data;
          if (newItem) {
            if (!newItem.product?.productLanguages || !newItem.store) {
              const productDetails = await fetchProductDetails(newItem.product.id, token);
              if (productDetails) {
                newItem.product = {
                  ...newItem.product,
                  productLanguages: productDetails.productLanguages || [
                    { name: localItem.name || "Unknown Product", description: localItem.description || "No description" },
                  ],
                  variants: productDetails.variants || newItem.product.variants,
                };
                newItem.store = productDetails.store || localItem.store || { name: "Unknown Restaurant" };
              }
            }
            newItem.addons = (newItem.addons || []).map((addon, index) => ({
              ...addon,
              product: {
                ...addon.product,
                productLanguages: addon.product?.productLanguages || [
                  { name: localItem.addons[index]?.name || "Unknown Add-on" },
                ],
              },
            }));
            mergedItems.push(newItem);
          }
        } catch (error) {
          console.error("Error adding local item to server cart:", error);
        }
      }
    }

    try {
      for (const item of mergedItems) {
        if (!item.product?.id || !item.id || !item.product?.variants?.[0]?.productVarientUoms?.[0]?.id) {
          console.warn("Skipping item with missing fields:", item);
          continue;
        }
        const payload = {
          cartId: item.id,
          productVarientUomId: item.product.variants[0].productVarientUoms[0].id,
          productId: item.product.id,
          quantity: item.quantity,
          addons: (item.addons || []).map((addon) => ({
            addOnId: addon.id,
            addOnProductId: addon.productId,
            addOnVarientId: addon.product?.variants?.[0]?.id || null,
            productVarientUomId: addon.product?.variants?.[0]?.productVarientUoms?.[0]?.id || null,
            quantity: addon.quantity || 1,
          })),
        };
        await axios.post(`${BASE_URL}/user/cart/edit`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(
          mergedItems.map((item) => ({
            id: item.id,
            productId: item.product?.id,
            productVarientUomId: item.product?.variants?.[0]?.productVarientUoms?.[0]?.id,
            quantity: item.quantity,
            name: item.product?.productLanguages?.[0]?.name,
            description: item.product?.productLanguages?.[0]?.description,
            store: item.store || { name: "Unknown Restaurant" },
            addons: (item.addons || []).map((addon) => ({
              addOnId: addon.id,
              addOnProductId: addon.productId,
              addOnVarientId: addon.product?.variants?.[0]?.id || null,
              productVarientUomId: addon.product?.variants?.[0]?.productVarientUoms?.[0]?.id || null,
              quantity: addon.quantity || 1,
              name: addon.product?.productLanguages?.[0]?.name,
            })),
          }))
        )
      );
      console.log("Merged cart:", mergedItems);
      return mergedItems;
    } catch (error) {
      console.error("Error merging carts:", error);
      setOrderStatus({ type: "error", message: "Failed to sync cart data." });
      return serverCart;
    }
  };

  useEffect(() => {
    const savedCart = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.warn("Invalid cart data in localStorage, resetting to empty array");
          setCartItems([]);
          localStorage.setItem("cart", JSON.stringify([]));
        }
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        setCartItems([]);
        localStorage.setItem("cart", JSON.stringify([]));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && cartItems.length > 0) {
      localStorage.setItem(
        "cart",
        JSON.stringify(
          cartItems.map((item) => ({
            id: item.id,
            productId: item.productId || item.product?.id,
            productVarientUomId: item.productVarientUomId || item.product?.variants?.[0]?.productVarientUoms?.[0]?.id,
            quantity: item.quantity,
            name: item.name || item.product?.productLanguages?.[0]?.name,
            description: item.description || item.product?.productLanguages?.[0]?.description,
            store: item.store || { name: "Unknown Restaurant" },
            addons: (item.addons || []).map((addon) => ({
              addOnId: addon.addOnId || addon.id,
              addOnProductId: addon.addOnProductId || addon.productId,
              addOnVarientId: addon.addOnVarientId || addon.product?.variants?.[0]?.id || null,
              productVarientUomId: addon.productVarientUomId || addon.product?.variants?.[0]?.productVarientUoms?.[0]?.id || null,
              quantity: addon.quantity || 1,
              name: addon.name || addon.product?.productLanguages?.[0]?.name,
            })),
          }))
        )
      );
    }
  }, [cartItems]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(newCart)) {
            setCartItems(newCart);
          }
        } catch (error) {
          console.error("Error parsing updated cart from storage event:", error);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 && !loading) {
      setShowPopup({ type: "success", message: "Cart updated!" });
      const timer = setTimeout(() => setShowPopup(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [cartItems]);

  useEffect(() => {
    if (selectedCoupon && cartItems.length > 0) {
      handleCouponSelect(selectedCoupon);
    } else if (!cartItems.length) {
      setSelectedCoupon(null);
      setTotalPrice(originalTotalPrice);
      setSubTotal(originalTotalPrice);
    }
  }, [cartItems, originalTotalPrice]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = localStorage.getItem("lastRestaurantUrl") || "/";
      setRedirectUrl(normalizeUrl(url));
    }
  }, []);

  useEffect(() => {
    const fetchUserAddress = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setAddressLoading(false);
        return;
      }
      try {
        const response = await axios.post(
          `${BASE_URL}/user/customerAddress/list`,
          { limit: 4, offset: 0 },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        const addresses = response.data?.data?.rows || [];
        console.log("Fetched addresses:", addresses);
        if (addresses.length > 0) {
          setUserAddress(addresses.find((addr) => addr.defaultAddress) || addresses[0]);
        }
      } catch (error) {
        console.error("Failed to fetch user address:", error);
        setShowPopup({ type: "error", message: "Failed to load address." });
      } finally {
        setAddressLoading(false);
      }
    };
    fetchUserAddress();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("redirectUrl", "/foodmarketplace/cart");
        }
        setOrderStatus({ type: "error", message: "Please log in to view your cart." });
        setShowAuthPrompt(true);
        setLoading(false);
        return;
      }
      try {
        const payload = { languageId: "2bfa9d89-61c4-401e-aae3-346627460558" };
        const response = await axios.post(`${BASE_URL}/user/cart/listv1`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        console.log("Server cart response:", response.data?.data?.rows);
        const serverItems = response.data?.data?.rows || [];
        const normalizedServerItems = serverItems.map((item) => ({
          ...item,
          quantity: Math.floor(item.quantity || 1),
        }));
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        console.log("Local cart before merge:", localCart);
        const mergedCart = await mergeCarts(localCart, normalizedServerItems, token);
        console.log("Cart items after merge:", mergedCart);
        setCartItems(mergedCart);
        calculateTotal(mergedCart);
      } catch (error) {
        console.error("Failed to fetch or merge cart items:", error);
        setOrderStatus({ type: "error", message: "Failed to load cart items." });
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [redirectUrl]);

  useEffect(() => {
    const fetchCoupons = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token || originalTotalPrice <= 0) return;
      setCouponLoading(true);
      try {
        const payload = { limit: 4000, offset: 0, totalAmount: originalTotalPrice.toString() };
        const response = await axios.post(`${BASE_URL}/user/coupon/list`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        const couponList = response.data?.data?.rows || [];
        const eligibleCoupons = couponList.filter(
          (coupon) => coupon.isEligible && originalTotalPrice >= (coupon.minPurchaseAmount || 0)
        );
        setCoupons(eligibleCoupons);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        setOrderStatus({ type: "error", message: "Failed to load coupons." });
      } finally {
        setCouponLoading(false);
      }
    };
    fetchCoupons();
  }, [originalTotalPrice]);

  const calculateTotal = (items) => {
    let totalQuantity = items.reduce((sum, item) => sum + Math.floor(item.quantity || 1), 0);
    let totalPrice = 0;
    items.forEach((item) => {
      const basePrice = item.priceInfo?.price || 0;
      let addOnPrice = 0;
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
    setOriginalTotalPrice(totalPrice);
    setSubTotal(totalPrice);
    if (!selectedCoupon) {
      setTotalPrice(totalPrice);
    }
  };

  const handleRemoveItem = async (cartId) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setOrderStatus({ type: "error", message: "Please log in to remove items." });
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/user/cart/remove`,
        { cartId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== cartId);
        calculateTotal(updatedItems);
        return updatedItems;
      });
      setShowPopup({ type: "success", message: "Item removed from cart!" });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      await fetchCartItems();
    }
  };

  const debouncedUpdateQuantity = useCallback(
    debounce(async (cartId, newQuantity) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setOrderStatus({ type: "error", message: "Please log in to update cart." });
        return;
      }
      const parsedQuantity = Number(newQuantity);
      if (isNaN(parsedQuantity) || !Number.isInteger(parsedQuantity)) {
        console.error("Invalid quantity in debouncedUpdateQuantity:", newQuantity);
        setOrderStatus({ type: "error", message: "Quantity must be a valid integer." });
        return;
      }
      const adjustedQuantity = Math.max(1, Math.floor(parsedQuantity));
      try {
        const item = cartItems.find((item) => item.id === cartId);
        if (!item) {
          console.error("Item not found in cart for cartId:", cartId);
          setOrderStatus({ type: "error", message: "Item not found in cart. Refreshing cart..." });
          await fetchCartItems();
          return;
        }
        if (!item.product?.id || !item.product?.variants?.[0]?.productVarientUoms?.[0]?.id) {
          console.error("Required fields missing for cartId:", cartId);
          setOrderStatus({ type: "error", message: "Product information missing. Refreshing cart..." });
          await fetchCartItems();
          return;
        }
        const payload = {
          cartId: cartId,
          productVarientUomId: item.product.variants[0].productVarientUoms[0].id,
          productId: item.product.id,
          quantity: adjustedQuantity,
          addons: (item.addons || []).map((addon) => ({
            addOnId: addon.id,
            addOnProductId: addon.productId,
            addOnVarientId: addon.product?.variants?.[0]?.id || null,
            productVarientUomId: addon.product?.variants?.[0]?.productVarientUoms?.[0]?.id || null,
            quantity: addon.quantity || 1,
          })),
        };
        await axios.post(`${BASE_URL}/user/cart/edit`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        setCartItems((prevItems) => {
          const updatedItems = prevItems.map((item) =>
            item.id === cartId ? { ...item, quantity: adjustedQuantity } : item
          );
          calculateTotal(updatedItems);
          if (selectedCoupon) {
            handleCouponSelect(selectedCoupon);
          }
          return updatedItems;
        });
        setShowPopup({ type: "success", message: "Cart quantity updated!" });
      } catch (error) {
        console.error("Error updating item quantity:", error);
        const errorMessage = error.response?.data?.message || error.message;
        if (errorMessage.includes("error") || errorMessage.includes("inventory")) {
          setOrderStatus({
            type: "error",
            message: `Insufficient inventory for ${
              item?.product?.productLanguages?.[0]?.name || "this product"
            }. Please try another item.`,
          });
        } else {
          setOrderStatus({ type: "error", message: `Failed to update quantity: ${errorMessage}` });
        }
        await fetchCartItems();
      }
    }, 300),
    [cartItems, selectedCoupon]
  );

  const handleUpdateQuantity = async (cartId, quantity) => {
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || !Number.isInteger(parsedQuantity)) {
      console.error("Invalid quantity provided:", quantity);
      setOrderStatus({ type: "error", message: "Quantity must be a valid integer." });
      return;
    }
    const adjustedQuantity = parsedQuantity;
    if (adjustedQuantity < 0) {
      console.error("Negative quantity provided:", adjustedQuantity);
      setOrderStatus({ type: "error", message: "Quantity cannot be negative." });
      return;
    }
    if (adjustedQuantity === 0) {
      await handleRemoveItem(cartId);
      return;
    }
    await debouncedUpdateQuantity(cartId, adjustedQuantity);
  };

  const handlePlaceOrder = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("usertoken") : null;
    if (!token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectUrl", "/foodmarketplace/cart");
      }
      setShowAuthPrompt(true);
      return;
    }
    if (!userAddress) {
      setOrderStatus({ type: "error", message: "Please add a delivery address." });
      return;
    }
    try {
      setOrderLoading(true);
      setOrderStatus(null);
      const payload = {
        timezone: "America/New_York",
        totalAmount: totalPrice.toFixed(2),
        subTotal: subTotal.toFixed(2),
        paymentType: "CASH",
        orderType: orderType,
      };
      if (selectedCoupon) {
        const couponAmount = (subTotal - totalPrice).toFixed(2);
        payload.couponCode = selectedCoupon.code || "";
        payload.couponAmount = couponAmount;
      }
      await axios.post(`${BASE_URL}/user/order/addv1`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-js": "application/x-javascript",
        },
      });
      setOrderStatus({ type: "success", message: "Order placed successfully!" });
      setCartItems([]);
      setTotalComponents(0);
      setTotalPrice(0);
      setSubTotal(0);
      setOriginalTotalPrice(0);
      setSelectedCoupon(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("lastRestaurantUrl");
        localStorage.setItem("cart", JSON.stringify([]));
      }
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

  const handleAuthChoice = (choice) => {
    setShowAuthPrompt(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectUrl", "/foodmarketplace/cart");
    }
    router.push(`/foodmarketplace/${choice}`);
  };

  const handleCouponSelect = (coupon) => {
    if (originalTotalPrice < (coupon.minPurchaseAmount || 0)) {
      setShowPopup({
        type: "error",
        message: `Minimum purchase of ₹${coupon.minPurchaseAmount || 0} required for ${coupon.code || ""}`,
      });
      setTimeout(() => setShowPopup(null), 3000);
      return;
    }
    setSelectedCoupon(coupon);
    let discount = 0;
    if (coupon.isPercentage) {
      discount = (originalTotalPrice * coupon.discount) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discount || 0;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }
    setTotalPrice(Math.max(0, originalTotalPrice - discount));
    setShowPopup({
      type: "success",
      message: `Coupon ${coupon.code || ""} applied! Saved ₹${discount.toFixed(2)}`,
    });
    setTimeout(() => setShowPopup(null), 3000);
  };

  const handleAddressSubmit = (address) => {
    setUserAddress(address);
    setShowAddressForm(false);
    setShowPopup({
      type: "success",
      message: isEditAddress ? "Address updated successfully!" : "Address saved successfully!",
    });
    setTimeout(() => setShowPopup(null), 2000);
  };

  const handleCancel = () => {
    setShowAddressForm(false);
    setIsEditAddress(false);
  };

  const handleChangeAddress = () => {
    setIsEditAddress(true);
    setShowAddressForm(true);
  };

  return (
    <div className="relative flex justify-center">
      <div className="max-w-md w-full min-h-screen bg-white p-4 flex flex-col gap-4">
        {showPopup && (
          <div
            className={`fixed top-16 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[120] transition-opacity duration-300 ${
              showPopup.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {showPopup.message}
          </div>
        )}
        {showAuthPrompt && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[130] overflow-y-auto"
            onClick={() => setShowAuthPrompt(false)}
          >
            <div
              className="max-w-md w-full bg-white rounded-xl m-4 p-6 flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-lg font-semibold text-gray-800 text-center">
                Please log in or register to place your order
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleAuthChoice("login")}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleAuthChoice("register")}
                  className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
        {!userAddress && !addressLoading && (
          <div className="w-full rounded-xl px-4 bg-red-100 text-red-600 p-4 mb-4">
            <p className="text-center">Please add a delivery address to place your order.</p>
            <button
              onClick={() => {
                setIsEditAddress(false);
                setShowAddressForm(true);
              }}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
            >
              Add Address
            </button>
          </div>
        )}
        {addressLoading ? (
          <div className="w-full rounded-xl px-4 bg-gradient-to-r from-blue-100 to-blue-200">
            <p className="text-center p-4">Loading address...</p>
          </div>
        ) : userAddress ? (
          <div className="w-full rounded-xl px-4 bg-gradient-to-r from-blue-100 to-blue-200">
            <div className="flex gap-4 p-4">
              <div className="w-[5%] flex items-center">
                <div className="w-fit h-fit rounded-full p-1 bg-blue-200">
                  <MapPin color="blue" size={20} />
                </div>
              </div>
              <div className="flex flex-col w-[60%]">
                <p className="font-bold text-black text-xl">Delivery Address</p>
                <p className="text-xs">
                  {[
                    userAddress?.addressLine1 || "",
                    userAddress?.addressLine2 || "",
                    userAddress?.road || "",
                    userAddress?.landmark || "",
                    userAddress?.label || "",
                  ]
                    .filter(Boolean)
                    .join(", ")
                  }
                </p>
              </div>
              <button
                onClick={handleChangeAddress}
                className="bg-blue-600 text-white flex items-center justify-center w-fit h-fit px-4 py-2 transform translate-y-2 rounded-lg"
              >
                <span className="text-xs">Change</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-xl px-4 bg-gradient-to-r from-blue-100 to-blue-200">
            <div className="p-4 flex justify-center">
              <button
                onClick={() => {
                  setIsEditAddress(false);
                  setShowAddressForm(true);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
              >
                Enter Your Address for Delivery
              </button>
            </div>
          </div>
        )}
        {showAddressForm && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[130] overflow-y-auto"
            onClick={handleCancel}
          >
            <div
              className="max-w-md w-full bg-white rounded-xl m-4 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <AddressForm
                onAddressSubmit={handleAddressSubmit}
                onCancel={handleCancel}
                baseUrl={BASE_URL}
                userAddress={isEditAddress ? userAddress : null}
                isEdit={isEditAddress}
              />
            </div>
          </div>
        )}
        <div className="w-full flex flex-col gap-2 flex-1">
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 w-full flex items-center gap-2 px-2 py-4">
            <ShoppingBag color="white" size={20} />
            <p className="text-white font-bold text-xl">Your Items</p>
          </div>
          <div className="w-full flex flex-col gap-4 px-2 bg-white border border-gray-200 flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-gray-500 text-center">Loading...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                {orderStatus?.type === "success" ? "Cart is empty after order." : "Your cart is empty."}
              </p>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold text-gray-800">Order Type</p>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded-lg border ${
                        orderType === "PICKUP"
                          ? "border-blue-600 bg-blue-100 text-blue-600"
                          : "border-gray-200 hover:bg-gray-100 text-gray-800"
                      }`}
                      onClick={() => setOrderType("PICKUP")}
                    >
                      Pickup
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg border ${
                        orderType === "DELIVERY"
                          ? "border-blue-600 bg-blue-100 text-blue-600"
                          : "border-gray-200 hover:bg-gray-100 text-gray-800"
                      }`}
                      onClick={() => setOrderType("DELIVERY")}
                    >
                      Delivery
                    </button>
                  </div>
                </div>
                {cartItems.map((item) => {
                  console.log("Item passed to ItemCards:", item);
                  const addOns = item.addons || [];
                  const addOnPrice = addOns.reduce(
                    (sum, addon) => sum + (addon.priceInfo?.price || addon.product?.priceInfo?.price || 0),
                    0
                  );
                  const itemTotal = ((item.priceInfo?.price || 0) + addOnPrice) * Math.floor(item.quantity || 0);
                  const isIncrementDisabled = item.product?.variants?.[0]?.quantity <= item.quantity;
                  return (
                    <ItemCards
                      key={item.id}
                      id={item.id}
                      name={item.product?.productLanguages?.[0]?.name || item.name || "Unknown Product"}
                      total={itemTotal}
                      restaurantName={item.store?.name || "Unknown Restaurant"}
                      description={
                        item.product?.productLanguages?.[0]?.description || item.description || "No description"
                      }
                      customizations={item.customizations || ""}
                      count={Math.floor(item.quantity || 0)}
                      addOns={
                        addOns.length > 0
                          ? addOns
                              .map((addon) => addon.product?.productLanguages?.[0]?.name || addon.name || "")
                              .filter(Boolean)
                              .join(", ")
                          : "No add-ons"
                      }
                      onRemove={() => handleRemoveItem(item.id)}
                      onIncrement={() => debouncedUpdateQuantity(item.id, (item.quantity || 0) + 1)}
                      onDecrement={() => debouncedUpdateQuantity(item.id, Math.max(1, (item.quantity || 0) - 1))}
                      onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
                      isIncrementDisabled={isIncrementDisabled}
                    />
                  );
                })}
                <button
                  className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white mb-2"
                  onClick={() => router.push(normalizeUrl(redirectUrl))}
                >
                  Add Items
                </button>
                {cartItems.length > 0 && (
                  <div className="border-t pt-4 mt-2 bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="mb-4">
                      <p className="text-lg font-semibold text-gray-800 mb-2">Available Coupons</p>
                      {couponLoading ? (
                        <p className="text-sm text-gray-500">Loading coupons...</p>
                      ) : coupons.length === 0 ? (
                        <p className="text-sm text-gray-500">No coupons available.</p>
                      ) : (
                        <div className="flex flex-row overflow-x-auto gap-3 pb-2 snap-x">
                          {coupons.map((coupon) => (
                            <button
                              key={coupon.id}
                              onClick={() => handleCouponSelect(coupon)}
                              className={`flex-shrink-0 w-[150px] p-3 rounded-lg border ${
                                selectedCoupon?.id === coupon.id
                                  ? "border-blue-600 bg-blue-100 text-blue-600"
                                  : "border-gray-200 hover:bg-gray-100 text-gray-800"
                              }`}
                            >
                              <p className="text-sm font-medium text-left">
                                {coupon.name || coupon.code} -{" "}
                                {coupon.isPercentage
                                  ? `${coupon.discount}% off`
                                  : `₹${coupon.discount} off`}
                                {coupon.minPurchaseAmount && ` (Min ₹${coupon.minPurchaseAmount})`}
                              </p>
                              <p className="text-xs text-gray-500 text-left mt-1">
                                {coupon.description || "No description"}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-lg font-semibold text-gray-800">Total Items</p>
                      <p className="text-lg font-medium">{totalComponents}</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-lg font-semibold text-gray-600">Subtotal</p>
                      <p className="text-lg font-medium">₹{subTotal.toFixed(2)}</p>
                    </div>
                    {selectedCoupon && (
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-600">Coupon Discount</p>
                        <p className="text-sm text-green-600">
                          -₹{(subTotal - totalPrice).toFixed(2)}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-gray-800">Total</p>
                      <p className="text-xl font-bold text-blue-600">
                        ₹{totalPrice.toFixed(2)}
                      </p>
                    </div>
                    {selectedCoupon && (
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-600">Coupon Applied</p>
                        <p className="text-sm text-green-600">
                          {selectedCoupon.name || selectedCoupon.code}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {orderStatus && (
                  <div
                    className={`p-2 rounded-lg text-white text-center ${
                      orderStatus.type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                    role="alert"
                  >
                    {orderStatus.message}
                    {orderStatus.type === "success" && (
                      <button
                        className="ml-2 text-sm underline"
                        onClick={() => router.push("/food-marketplace/orders")}
                      >
                        View Orders
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0 || orderLoading || !userAddress}
          className={`w-full py-4 rounded-xl text-white font-semibold text-lg mb-16 ${
            cartItems.length === 0 || orderLoading || !userAddress
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
            `Place Order ₹${totalPrice.toFixed(2)}`
          )}
        </button>
        <BottomNav />
      </div>
    </div>
  );
}