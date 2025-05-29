'use client'

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, UserRound } from "lucide-react"

export default function Header() {
  return (
    <div className="w-screen flex justify-center">
      <header className="z-50 w-full max-w-md sticky bg-black border-b border-gray-200 h-12 px-4">
        <div className="w-full flex justify-between">
          <Image src={"/infoware.png"} width={120} height={60} alt="logo" />
          <div className="flex gap-4 items-center">
            <Link href="/favourites">
              <Heart size={30} color="white" className="cursor-pointer" />
            </Link>
            <Link href="/cart">
              <ShoppingCart size={30} color="white" className="cursor-pointer" />
            </Link>
            <UserRound size={30} color="white" />
          </div>
        </div>
      </header>
    </div>
  )
}
