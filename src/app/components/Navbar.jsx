"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, ShoppingCart, CircleUser, ClipboardList } from "lucide-react";

export const Navbar = () => {
  const [active, setActive] = useState("home");

  const navItems = [
    { id: "home", icon: <Home size={24} color="white" /> },
    { id: "orders", icon: <ClipboardList size={24} color="white" /> },
    { id: "cart", icon: <ShoppingCart size={24} color="white" /> },
    { id: "profile", icon: <CircleUser size={24} color="white" /> },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl z-50 flex gap-6">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => setActive(item.id)}
          initial={false}
          animate={{
            backgroundColor: active === item.id ? "rgba(255, 255, 255, 0.2)" : "transparent",
          }}
          transition={{ duration: 0.3 }}
          className="p-2 rounded-full"
        >
          {item.icon}
        </motion.button>
      ))}
    </div>
  );
};
