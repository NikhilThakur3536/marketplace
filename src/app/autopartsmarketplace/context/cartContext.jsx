// src/context/cartContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ;

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

      console.log("Fetch cart count response:", response.data); // Debug
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

  useEffect(() => {
    fetchCartItemCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartItemCount, fetchCartItemCount }}>
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