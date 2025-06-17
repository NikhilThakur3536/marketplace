"use client"

import { useState } from "react"
import { Layout } from "../components/Layout"
import { Card, CardContent } from "../components/Card"
import { Button } from "../components/Button"
import { Icon } from "../components/Icon"
import { Badge } from "../components/Badge"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState([
    {
      id: "1",
      name: "Brembo Front Brake Pad Set P85121",
      brand: "Brembo",
      price: "₹2,450",
      originalPrice: "₹3,200",
      discount: "-23%",
      rating: 4.5,
      reviews: 128,
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
    },
    {
      id: "2",
      name: "Brembo Front Brake Pad Set P54030",
      brand: "Brembo",
      price: "₹2,890",
      originalPrice: "₹3,750",
      discount: "-23%",
      rating: 4.7,
      reviews: 95,
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
    },
    {
      id: "3",
      name: "Brembo Front Brake Pad Set P28034",
      brand: "Brembo",
      price: "₹3,120",
      originalPrice: "₹4,050",
      discount: "-23%",
      rating: 4.6,
      reviews: 156,
      image: "/placeholder.svg?height=200&width=200",
      inStock: false,
    },
  ])

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <Layout title="My Wishlist">
      <div className="p-4">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {favorites.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div
                      className="w-24 h-24 bg-slate-700 relative cursor-pointer"
                      onClick={() => router.push(`/product/${item.id}`)}
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                      {item.discount && (
                        <Badge variant="danger" className="absolute top-1 left-1 text-xs">
                          {item.discount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 p-3">
                      <div className="cursor-pointer" onClick={() => router.push(`/product/${item.id}`)}>
                        <div className="text-xs text-blue-400 mb-1">{item.brand}</div>
                        <h3 className="text-sm font-medium mb-1 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center gap-1 mb-1">
                          <Icon name="star" size={12} className="text-yellow-400" />
                          <span className="text-xs">{item.rating}</span>
                          <span className="text-xs text-gray-400">({item.reviews})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{item.price}</span>
                          <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <Badge variant={item.inStock ? "success" : "danger"} className="text-xs">
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        <div className="flex gap-2">
                          <button
                            onClick={() => removeFromFavorites(item.id)}
                            className="p-1.5 bg-slate-700 rounded-full"
                          >
                            <Icon name="trash" size={14} className="text-red-400" />
                          </button>
                          <Button variant="primary" size="sm" disabled={!item.inStock}>
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-slate-800 rounded-full p-6 mb-4">
              <Icon name="heart" size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 text-center mb-6">
              Save items you like by clicking the heart icon on products.
            </p>
            <Button variant="primary" onClick={() => router.push("/")}>
              Explore Products
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
