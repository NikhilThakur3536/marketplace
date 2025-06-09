"use client"

import { useRouter } from "next/navigation"

export default function Header() {

  const router=useRouter()

  return (
    <div className="flex items-center justify-between p-4 bg-[#EEF9FA]">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">HB</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Hi !! Buddy</h1>
          <p className="text-sm text-gray-500">Good morning</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center" onClick={()=>router.push("/electronicsmarketplace/cart")}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="flex flex-col space-y-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
