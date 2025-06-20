"use client";

import { useState, useEffect } from "react";
import  Layout  from "../components/Layout";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "../context/cartContext";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api-base-url.com";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const { cartItemCount, fetchCartItemCount } = useCart();

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("userToken");
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
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

      console.log("Fetch cart items response:", response.data); // Debug
      if (response.data?.success && response.data?.data?.rows?.length >= 0) {
        const apiItems = response.data.data.rows.map((item) => {
          const product = item.product;
          const variant = product?.varients?.[0];
          const price = variant?.inventory?.price || 0;
          const originalPrice = price * 1.3;
          return {
            id: item.id,
            productId: product?.id,
            variantId: variant?.id,
            name: product?.productLanguages?.[0]?.name || "Unknown Product",
            brand: product?.category?.categoryLanguages?.[0]?.name || "Generic",
            price: item.priceInfo?.price || 0,
            originalPrice: originalPrice,
            quantity: Math.floor(item.quantity) || 1,
            image: product?.productImages?.[0]?.url || "/placeholder.svg?height=200&width=200",
          };
        });
        setCartItems(apiItems);
      } else {
        setCartItems([]);
      }
      await fetchCartItemCount(); // Ensure count is updated
    } catch (err) {
      console.error("Error fetching cart items:", err.message);
      setError("Failed to load cart. Please try again.");
      await fetchCartItemCount(); // Update count even on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [router]);

  const updateQuantity = async (id, newQuantity) => {
    const parsedQuantity = Math.floor(Number(newQuantity));
    if (parsedQuantity < 1 || isNaN(parsedQuantity)) return;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/user/cart/edit`,
        {
          cartId: id,
          quantity: parsedQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update quantity response:", response.data); // Debug
      if (response.data?.success) {
        await fetchCartItems();
        setCartMessage("Quantity updated successfully!");
      } else {
        setCartMessage("Unexpected response from server.");
      }
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      console.error("Error updating quantity:", err.message);
      setCartMessage("Failed to update quantity. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/user/cart/remove`,
        {
          cartId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Remove item response:", response.data); // Debug
      if (response.data?.success) {
        await fetchCartItems();
        setCartMessage("Item removed from cart!");
      } else {
        setCartMessage("Failed to remove item.");
      }
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      console.error("Error removing item:", err.message);
      setCartMessage("Failed to remove item. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setCartMessage("Your cart is empty. Add items before checking out.");
      setTimeout(() => setCartMessage(""), 3000);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      if (!token) {
        router.push("/autopartsmarketplace/login");
        return;
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Checkout response:", response.data); // Debug
      if (response.data?.success) {
        setCartItems([]);
        setCartMessage("Order placed successfully!");
        await fetchCartItemCount(); // Reset cart count
        setTimeout(() => {
          setCartMessage("");
          router.push("/autopartsmarketplace");
        }, 3000);
      } else {
        setCartMessage("Failed to place order. Please try again.");
        setTimeout(() => setCartMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error placing order:", err.message);
      setCartMessage("Failed to place order. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <Layout showBackButton title="Shopping Cart" cartItemCount={cartItemCount}>
        <div className="p-4 text-center text-gray-400">Loading cart...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showBackButton title="Shopping Cart" cartItemCount={cartItemCount}>
        <div className="p-4 text-center text-red-400">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout showBackButton title="Shopping Cart" cartItemCount={cartItemCount}>
      <div className="p-4 relative">
        {cartItems.length > 0 ? (
          <>
            <div className="mb-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="mb-3">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-blue-400 mb-1">{item.brand}</div>
                        <h3 className="text-sm font-medium mb-2 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold">
                              {formatPrice(item.price * item.quantity)}
                              <span className="text-xs text-gray-400 ml-2">({formatPrice(item.price)} each)</span>
                            </div>
                            <div className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice * item.quantity)}</div>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-slate-700 rounded-l-md"
                              disabled={loading}
                            >
                              <Icon name="minus" size={14} />
                            </button>
                            <div className="w-8 h-7 flex items-center justify-center bg-slate-700 border-x border-slate-600">{item.quantity}</div>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-slate-700 rounded-r-md"
                              disabled={loading}
                            >
                              <Icon name="plus" size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-400 flex items-center"
                        disabled={loading}
                      >
                        <Icon name="trash" size={14} className="mr-1" /> Remove
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mb-4">
              <CardContent>
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Discount</span><span className="text-green-400">- {formatPrice(discount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                  <div className="border-t border-slate-700 pt-2 mt-2">
                    <div className="flex justify-between font-medium"><span>Total</span><span>{formatPrice(total)}</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="primary"
              fullWidth
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-slate-800 rounded-full p-6 mb-4"><Icon name="cart" size={48} className="text-gray-400" /></div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-center mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Button variant="primary" onClick={() => router.push("/autopartsmarketplace")}>Continue Shopping</Button>
          </div>
        )}

        {cartMessage && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-50 flex items-center justify-between max-w-xs w-full">
            <p>{cartMessage}</p>
            <button
              onClick={() => setCartMessage("")}
              className="ml-4 text-white hover:text-gray-200"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}