"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Minus, Heart, Trash2, ShoppingCart, Tag } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;



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
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

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

        if (response.data.success && response.data.data?.rows) {
          const mappedItems = response.data.data.rows.map((item) => ({
            id: item.id,
            productId: item.productId, // Store productId for edit API
            name: item.product.productLanguages[0]?.name || "Unknown Product",
            description: item.varientLanguages?.[0]?.name || item.product.productLanguages[0]?.name || "No description",
            price: item.priceInfo.price || 0,
            originalPrice: null, // API doesn't provide originalPrice
            quantity: parseInt(item.quantity, 10) || 1,
            image: "/placeholder.svg?height=80&width=80", // Fallback since productImages is empty
            inStock: item.status === "ACTIVE",
          }));
          setCartItems(mappedItems);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (id, change) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const item = cartItems.find((item) => item.id === id);
      if (!item) return;

      const newQuantity = Math.max(0, item.quantity + change);
      if (newQuantity === item.quantity) return; // No change needed

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

      if (response.data.success) {
        setCartItems((items) =>
          items
            .map((item) =>
              item.id === id ? { ...item, quantity: newQuantity } : item
            )
            .filter((item) => item.quantity > 0)
        );
      } else {
        throw new Error(response.data.message || "Failed to update quantity");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update quantity");
    }
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
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

      const response = await axios.post(
        `${BASE_URL}/user/order/addv2`,
        {
          timezone: "Asia/Kolkata",
          totalAmount: total.toFixed(2),
          paymentType: "CASH",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCartItems([]); // Clear cart on successful order
        alert("Order placed successfully!");
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to place order");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedPromo === "SB83028" ? subtotal * 0.6 : 0;
  const deliveryFee = subtotal > 100 ? 0 : 9.99;
  const total = subtotal - discount + deliveryFee;

  const applyPromoCode = () => {
    if (promoCode === "SB83028") {
      setAppliedPromo(promoCode);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen items-center">
        <div className="text-center">
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center min-h-screen items-center">
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
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto overflow-x-hidden">
        <div className="bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-6 h-6 text-gray-600" onClick={()=>router.push("/electronicsmarketplace")}/>
              <div>
                <h1 className="text-xl font-bold text-gray-800">My Cart</h1>
                <p className="text-sm text-gray-500">{cartItems.length} items</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">HB</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-4 mb-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 translate-x-16"></div>
            <div className="relative">
              <h3 className="text-white font-bold text-lg mb-1">Save More!</h3>
              <p className="text-white/90 text-sm mb-3">Use code for 60% OFF on electronics</p>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">Code: SB83028</Badge>
            </div>
          </div>
        </div>
        {/* Cart Items */}
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
                      <span className="font-bold text-gray-800 text-base">${item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={!item.inStock}
                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={!item.inStock}
                        className="w-8 h-8 rounded-full bg-green-500 border-2 border-green-500 text-white flex items-center justify-center hover:bg-green-600 hover:border-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
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
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-4">Add some amazing electronics to get started!</p>
              <Button onClick={()=>router.push("/electronicsmarketplace/")}>Continue Shopping</Button>
            </div>
          )}
        </div>

        {/* Promo Code Section */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <Button onClick={applyPromoCode} className="px-4 rounded-xl">Apply</Button>
            </div>

            {appliedPromo && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-medium">Promo code applied: {appliedPromo}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAppliedPromo(null)}
                    className="text-green-600 hover:text-green-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (60% OFF)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button size="lg" className="w-full font-semibold" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}