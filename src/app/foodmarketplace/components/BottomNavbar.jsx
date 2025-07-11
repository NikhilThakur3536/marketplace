"use client";

import { useState } from "react";
import { ClipboardList, ChevronUp, ChevronDown,Heart } from "lucide-react";
import { useRouter } from "next/navigation";

const BottomNav = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="z-10 fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full">
      <div
        className={`bg-gradient-to-r from-orange-500 to-orange-700 mx-2 mb-0 rounded-2xl transition-all duration-300 ease-in-out ${
          isCollapsed ? "h-12 w-12 flex items-center justify-center" : "px-6 py-4"
        }`}
      >
        {isCollapsed ? (
          <button onClick={toggleCollapse} className="p-2">
            <ChevronUp color="white" size={24} />
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-around gap-4 w-full">
              <button className="p-2" onClick={() => router.push("/foodmarketplace")}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </button>

              <button className="p-2" onClick={() => router.push("/foodmarketplace/cart")}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                  />
                </svg>
              </button>

              <button className="p-2"
                onClick={()=>router.push("/foodmarketplace/profile")}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              <button className="p-2" onClick={() => router.push("/foodmarketplace/orders")}>
                <ClipboardList color="white" size={20} />
              </button>
              
              <button className="p-2" onClick={() => router.push("/foodmarketplace/favourites")}>
                <Heart color="white" size={20} />
              </button>

               <button onClick={toggleCollapse} className="p-2">
                <ChevronDown color="white" size={24} />
              </button>
            </div>
           
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomNav;