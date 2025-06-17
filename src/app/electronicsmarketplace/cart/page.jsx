"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Plus, Minus, Heart, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    success: "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-base rounded-xl",
    lg: "px-6 py-3 text-lg rounded-2xl",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

function Badge({ children, variant = "default", className = "" }) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-gray-100 text-gray-700",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</span>;
}

export default function Test() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const lastSubtotal = useRef(0);

  const MINIMUM_CART_VALUE = 500;

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiJ9.MjllY2M3ZTYtODgxZi00MjRlLWFkZTMtMWI3ZGQ0MGRmZDVh.rqAF7Mz2liJ3WriJpabV29ndeDkiCjkfLfDrg-iFXvg";
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        console.log("Fetching cart items from:", `${BASE_URL}/user/cart/listv2`);
        const response = await axios.post(
          `${BASE_URL}/user/cart/listv2`,
          {
            languageId: "2bfa9d89-61c4-401e-aae3-346627460558",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Cart list response:", response.data);

        if (response.data.success && response.data.data?.rows) {
          const mappedItems = response.data.data.rows.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.productLanguages[0]?.name || "Unknown Product",
            description: item.varientLanguages?.[0]?.name || item.product.productLanguages[0]?.name || "No description",
            price: item.priceInfo.price || 0,
            originalPrice: null,
            quantity: parseInt(item.quantity, 10) || 1,
            image: "/placeholder.jpg",
            inStock: item.status === "ACTIVE",
          }));
          setCartItems(mappedItems);
        } else {
          throw new Error("Invalid API response: success=false or missing data.rows");
        }
      } catch (err) {
        console.error("Error fetching cart items:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.response?.data?.message || err.message || "Failed to fetch cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch coupons
  const fetchCoupons = useCallback(
    debounce(async (subtotal) => {
      if (Math.abs(subtotal - lastSubtotal.current) < 1) {
        console.log("Skipping coupon fetch: subtotal unchanged");
        return;
      }

      try {
        setCouponLoading(true);
        const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiJ9.MjllY2M3ZTYtODgxZi00MjRlLWFkZTMtMWI3ZGQ0MGRmZDVh.rqAF7Mz2liJ3WriJpabV29ndeDkiCjkfLfDrg-iFXvg";
        console.log("Fetching coupons with subtotal:", subtotal);

        const response = await axios.post(
          `${BASE_URL}/user/coupon/list`,
          {
            limit: 4000,
            offset: 0,
            totalAmount: subtotal.toString(),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Coupon list response:", response.data);

        if (response.data.success && response.data.data?.rows) {
          const eligibleCoupons = response.data.data.rows.filter(
            (coupon) => coupon.isEligible && subtotal >= (coupon.minPurchaseAmount || MINIMUM_CART_VALUE)
          );
          console.log("Eligible coupons:", eligibleCoupons);
          setCoupons(eligibleCoupons);
          lastSubtotal.current = subtotal;
        } else {
          console.warn("No coupons found or invalid response");
          setCoupons([]);
        }
      } catch (err) {
        console.error("Error fetching coupons:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setCoupons([]);
        setShowPopup({ type: "error", message: "Failed to load coupons." });
      } finally {
        setCouponLoading(false);
      }
    }, 500),
    []
  );

  // Fetch coupons when subtotal changes
  useEffect(() => {
    if (cartItems.length > 0) {
      fetchCoupons(subtotal);
    }
  }, [subtotal, fetchCoupons]);

  // Recalculate total when cart items or coupon changes
  useEffect(() => {
    if (appliedPromo && cartItems.length > 0) {
      const coupon = coupons.find((c) => c.id === appliedPromo);
      if (coupon) {
        handleCouponSelect(coupon);
      } else {
        setAppliedPromo(null);
        setCouponDiscount(0);
      }
    } else {
      setCouponDiscount(0);
      setAppliedPromo(null);
    }
  }, [cartItems, coupons]);

  const updateQuantity = async (id, change) => {
    try {
      const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiJ9.MjllY2M3ZTYtODgxZi00MjRlLWFkZTMtMWI3ZGQ0MGRmZDVh.rqAF7Mz2liJ3WriJpabV29ndeDkiCjkfLfDrg-iFXvg";
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const item = cartItems.find((item) => item.id === id);
      if (!item) {
        throw new Error(`Item with id ${id} not found in cart`);
      }

      const newQuantity = Math.max(0, item.quantity + change);
      if (newQuantity === item.quantity) return;

      console.log("Updating quantity:", { cartId: id, productId: item.productId, newQuantity });
      const response = await axios.post(
        `${BASE_URL}/user/cart/edit`,
        {
          cartId: id,
          productId: item.productId,
          quantity: newQuantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Edit cart response:", response.data);

      if (response.data.success) {
        setCartItems((items) =>
          items
            .map((item) =>
              item.id === id ? { ...item, quantity: newQuantity } : item
            )
            .filter((item) => item.quantity > 0)
        );
        setShowPopup({ type: "success", message: "Cart quantity updated!" });
      } else {
        throw new Error(response.data.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setShowPopup({ type: "error", message: err.response?.data?.message || "Failed to update quantity" });
    }
  };

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiJ9.MjllY2M3ZTYtODgxZi00MjRlLWFkZTMtMWI3ZGQ0MGRmZDVh.rqAF7Mz2liJ3WriJpabV29ndeDkiCjkfLfDrg-iFXvg";
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      console.log("Removing item with cartId:", id);
      const response = await axios.post(
        `${BASE_URL}/user/cart/remove`,
        { cartId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Remove cart response:", response.data);

      if (response.data.success) {
        setCartItems((items) => items.filter((item) => item.id !== id));
        setShowPopup({ type: "success", message: "Item removed from cart!" });
      } else {
        throw new Error(response.data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Error removing item:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setShowPopup({ type: "error", message: err.response?.data?.message || "Failed to remove item from cart" });
    }
  };

  const handleCouponSelect = (coupon) => {
    const minCartValue = coupon.minPurchaseAmount || MINIMUM_CART_VALUE;
    if (subtotal < minCartValue) {
      setShowPopup({
        type: "error",
        message: `Minimum cart value of ₹${minCartValue} required for ${coupon.code}`,
      });
      setTimeout(() => setShowPopup(null), 3000);
      setAppliedPromo(null);
      setCouponDiscount(0);
      return;
    }

    let discount = 0;
    if (coupon.isPercentage) {
      discount = (subtotal * coupon.discount) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discount || 0;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    setAppliedPromo(coupon.id);
    setCouponDiscount(discount);
    setShowPopup({
      type: "success",
      message: `Coupon ${coupon.code} applied! Saved ₹${discount.toFixed(2)}`,
    });
    setTimeout(() => setShowPopup(null), 3000);
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      if (cartItems.length === 0) {
        throw new Error("Cart is empty. Add items to proceed.");
      }

      const selectedCoupon = appliedPromo ? coupons.find((c) => c.id === appliedPromo) : null;
      const payload = {
        timezone: "Asia/Kolkata",
        totalAmount: total.toFixed(2),
        subTotal: subtotal.toFixed(2),
        paymentType: "CASH",
        orderType: "PICKUP",
        couponCode: selectedCoupon ? selectedCoupon.id : "hyy",
        couponAmount: couponDiscount.toFixed(2),
      };

      const response = await axios.post(
        `${BASE_URL}/user/order/addv2 `,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setCartItems([]);
        setAppliedPromo(null);
        setCouponDiscount(0);
        setShowPopup({ type: "success", message: "Order placed successfully!" });
        setTimeout(() => {
          setShowPopup(null);
        }, 3000);
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Error placing order:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setShowPopup({
        type: "error",
        message: err.response?.data?.message || "Failed to place order",
      });
      setTimeout(() => setShowPopup(null), 3000);
    }
  };

  const deliveryFee = subtotal > 100 ? 0 : 9.99;
  const total = Math.max(0, subtotal - couponDiscount + deliveryFee);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto overflow-x-hidden">
        {showPopup && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 ${
              showPopup.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {showPopup.message}
          </div>
        )}
        <div className="bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => router.push("/electronicsmarketplace")} />
              <div>
                <h1 className="text-xl font-bold text-gray-800">My Cart</h1>
                <p className="text-sm text-gray-500">{cartItems.length} items</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HB</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-4 mb-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 translate-x-16"></div>
            <div className="relative">
              <h3 className="text-white font-bold text-lg mb-1">Save More!</h3>
              <p className="text-white/90 text-sm mb-3">Select a coupon below to get discounts</p>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Minimum cart value: ₹{coupons.length > 0 ? Math.min(...coupons.map(c => c.minPurchaseAmount || MINIMUM_CART_VALUE)) : MINIMUM_CART_VALUE}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="relative w-20 h-20 bg-blue-50 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  <button className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                    <Heart className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 truncate">{item.description}</p>
                      {!item.inStock && (
                        <Badge variant="destructive" className="text-xs mt-2">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 rounded-full flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 text-base">₹{item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={!item.inStock}
                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={!item.inStock}
                        className="w-8 h-8 rounded-full bg-green-500 border-2 border-green-500 text-white flex items-center justify-center hover:bg-green-600 hover:border-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {cartItems.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-4">Add some amazing electronics to get started!</p>
              <Button onClick={() => router.push("/electronicsmarketplace")} variant="primary">
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t">
            {couponLoading ? (
              <div className="text-center text-gray-500 rounded-xl p-3 mb-4 bg-gray-100">
                Loading coupons...
              </div>
            ) : coupons.length > 0 ? (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Coupons</h3>
                <div className="space-y-2">
                  {coupons.map((coupon, index) => (
                    <div
                      key={coupon.id || `coupon-${index}`}
                      className={`border rounded-xl p-3 flex justify-between items-center ${
                        appliedPromo === coupon.id ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-800">{coupon.code || "Unknown Code"}</p>
                        <p className="text-sm text-gray-500">
                          {coupon.description || `Save ${coupon.discount || "Unknown"}${coupon.isPercentage ? "%" : "₹"}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          Min. cart value: ₹{coupon.minPurchaseAmount || MINIMUM_CART_VALUE}
                        </p>
                      </div>
                      <Button
                        variant={appliedPromo === coupon.id ? "success" : "outline"}
                        size="sm"
                        onClick={() => handleCouponSelect(coupon)}
                        disabled={couponLoading || subtotal < (coupon.minPurchaseAmount || MINIMUM_CART_VALUE)}
                      >
                        {appliedPromo === coupon.id ? "Applied" : "Apply"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 rounded-xl p-3 mb-4 bg-gray-100">
                No coupons available for your current cart value
              </div>
            )}
            {couponError && (
              <div className="bg-red-100 border border-red-200 rounded-xl p-4 mb-4">
                <span className="text-red-700 text-sm">{couponError}</span>
              </div>
            )}
            {appliedPromo && (
              <div className="bg-green-100 border border-green-200 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 text-sm">
                    Coupon applied: {coupons.find((c) => c.id === appliedPromo)?.code || appliedPromo}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAppliedPromo(null);
                      setCouponDiscount(0);
                      setShowPopup({ type: "success", message: "Coupon removed!" });
                      setTimeout(() => setShowPopup(null), 3000);
                    }}
                    className="text-green-600 hover:text-green-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 pt-4 border-t">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full font-semibold rounded-xl"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Place Order ₹{total.toFixed(2)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}