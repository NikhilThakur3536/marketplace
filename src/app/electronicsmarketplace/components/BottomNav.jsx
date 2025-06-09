"use client";

import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";

const BottomNav = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md">
      <div className="bg-gradient-to-r from-green-400 to-green-500 mx-4 mb-4 rounded-2xl px-6 py-4">
        <div className="flex items-center justify-around gap-12">
          <button className="p-2"
            onClick={()=>router.push("/electronicsmarketplace")}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </button>

          <button
            className="p-2"
            onClick={() => router.push("/electronicsmarketplace/cart")}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
              />
            </svg>
          </button>

          <button className="p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
           <button className="p-2" onClick={() => router.push("/electronicsmarketplace/orders")}>
                <ClipboardList color="white" size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;