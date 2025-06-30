// src/context/cartContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function CartProvider({ children }) {
  const [cartItemCount, setCartItemCount] = useState(null);

  const fetchCartItemCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        `${BASE_URL}/user/cart/listv2`,
        { languageId: "2bfa9d89-61c4-401e-aae3-346627460558" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Fetch cart count response:", response.data); // Debug
      if (response.data?.success) {
        const items = response.data.data.rows || [];
        setCartItemCount(items.length);
      } else {
        setCartItemCount(0);
      }
    } catch (err) {
      console.error("Error fetching cart item count:", err.message);
      setCartItemCount(0);
    }
  };

  const addToCart = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const { productId, quantity, varientId } = payload;

      const cartResponse = await axios.post(
        `${BASE_URL}/user/cart/listv2`,
        { languageId: "2bfa9d89-61c4-401e-aae3-346627460558" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const cartItems = cartResponse.data?.data?.rows || [];
      const existingItem = cartItems.find(
        (item) => item.product?.id === productId && item.varientId === varientId
      );

      if (existingItem) {
        await updateCartQuantity({ cartId: existingItem.id, quantity: existingItem.quantity + quantity });
      } else {
        await axios.post(
          `${BASE_URL}/user/cart/addv2`,
          { productId, quantity, varientId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      await fetchCartItemCount();
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      throw err;
    }
  };

  const updateCartQuantity = async ({ cartId, quantity }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      await axios.post(
        `${BASE_URL}/user/cart/edit`,
        { cartId, quantity: Math.max(1, Math.floor(quantity)) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchCartItemCount();
    } catch (err) {
      console.error("Error updating cart quantity:", err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCartItemCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartItemCount, fetchCartItemCount, addToCart, updateCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}