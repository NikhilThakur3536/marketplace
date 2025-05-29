"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([
    {
      id: "2",
      name: "Honda Civic Headlight Assembly",
      image: "/placeholder.svg?height=300&width=400",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.9,
      reviewCount: 156,
      type: "Original (OEM)",
      inStock: false,
    },
    {
      id: "5",
      name: "Audi A4 Spark Plugs (Set of 4)",
      image: "/placeholder.svg?height=300&width=400",
      price: 49.99,
      originalPrice: 59.99,
      rating: 4.5,
      reviewCount: 112,
      type: "Aftermarket Standard",
      inStock: true,
    },
  ])

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter((item) => item.id !== id))
  }

  const discount = (item) =>
    Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)

  return (
    <div className="w-full flex justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Wishlist</h1>

        {favorites.length > 0 ? (
          <>
            <p className="text-gray-600 mb-4">{favorites.length} items in your wishlist</p>
            <div className="flex flex-col gap-6">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  <div className="relative">
                    <Link href={`/products/${item.id}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={400}
                        height={300}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </Link>

                    {!item.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    <button
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full text-red-500 shadow"
                      onClick={() => removeFromFavorites(item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-4">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                    </Link>

                    <div className="flex items-center mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={i < Math.floor(item.rating) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={i < Math.floor(item.rating) ? "text-yellow-400" : "text-gray-300"}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-1">({item.reviewCount})</span>
                    </div>

                    <div className="flex items-center mb-2">
                      <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                      <span className="text-gray-500 line-through ml-2">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-green-600 ml-2">{discount(item)}% off</span>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">{item.type}</div>

                    <div className="flex gap-2">
                      {item.inStock ? (
                        <button className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
                          Add to Cart
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 border border-gray-300 text-gray-400 px-4 py-2 rounded-md opacity-50"
                        >
                          Out of Stock
                        </button>
                      )}

                      <button
                        onClick={() => removeFromFavorites(item.id)}
                        className="border border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/products"
                className="inline-block border border-gray-200 px-6 py-3 rounded-md hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-4">
              Save items you love to your wishlist and shop them later.
            </p>
            <Link
              href="/products"
              className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
